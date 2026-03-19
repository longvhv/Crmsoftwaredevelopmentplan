-- ============================================================
-- V013: Materialized Views cho Dashboard tổng hợp
-- Mục đích: Pre-compute dữ liệu nặng cho các trang analytics
-- Refresh: Chạy REFRESH MATERIALIZED VIEW CONCURRENTLY theo cron job
-- ============================================================

-- ============================================================
-- 1. Revenue Waterfall: Doanh thu theo tháng, phân loại
-- Dùng cho: RevenueWaterfallPage
-- ============================================================
CREATE MATERIALIZED VIEW mv_revenue_waterfall AS
SELECT
    d.tenant_id,
    DATE_TRUNC('month', d.actual_close_date)::DATE  AS month_start,
    TO_CHAR(d.actual_close_date, 'YYYY-MM')         AS period,
    -- New Business (deal mới, won)
    COALESCE(SUM(d.value) FILTER (
        WHERE d.won = TRUE
        AND NOT EXISTS (
            SELECT 1 FROM contracts c
            WHERE c.contact_id = d.contact_id
            AND c.tenant_id = d.tenant_id
            AND c.start_date < d.actual_close_date
            AND c.deleted_at IS NULL
        )
    ), 0) AS new_business,
    -- Expansion (upsell trên khách cũ)
    COALESCE(SUM(d.value) FILTER (
        WHERE d.won = TRUE
        AND EXISTS (
            SELECT 1 FROM contracts c
            WHERE c.contact_id = d.contact_id
            AND c.tenant_id = d.tenant_id
            AND c.start_date < d.actual_close_date
            AND c.deleted_at IS NULL
        )
    ), 0) AS expansion,
    -- Churned (renewals lost)
    COALESCE(SUM(r.current_value) FILTER (
        WHERE r.status = 'churned'
    ), 0) AS churned,
    -- Contraction (downgrades)
    COALESCE(SUM(GREATEST(r.current_value - r.proposed_value, 0)) FILTER (
        WHERE r.status = 'downgraded'
    ), 0) AS contraction,
    -- Renewed
    COALESCE(SUM(r.proposed_value) FILTER (
        WHERE r.status = 'renewed'
    ), 0) AS renewed,
    -- Total deals closed
    COUNT(*) FILTER (WHERE d.won = TRUE) AS deals_won_count,
    COUNT(*) FILTER (WHERE d.won = FALSE) AS deals_lost_count
FROM deals d
LEFT JOIN renewals r ON r.tenant_id = d.tenant_id
    AND DATE_TRUNC('month', r.created_at) = DATE_TRUNC('month', d.actual_close_date)
    AND r.deleted_at IS NULL
WHERE d.actual_close_date IS NOT NULL
    AND d.deleted_at IS NULL
GROUP BY d.tenant_id, DATE_TRUNC('month', d.actual_close_date), TO_CHAR(d.actual_close_date, 'YYYY-MM')
ORDER BY d.tenant_id, month_start;

CREATE UNIQUE INDEX uk_mv_revenue_waterfall ON mv_revenue_waterfall (tenant_id, period);

-- ============================================================
-- 2. Pipeline Summary: Tổng hợp pipeline theo stage
-- Dùng cho: CrmDashboardPage, PipelinePage, PredictiveAnalyticsPage
-- ============================================================
CREATE MATERIALIZED VIEW mv_pipeline_summary AS
SELECT
    d.tenant_id,
    d.pipeline,
    d.stage,
    COUNT(*)                                    AS deal_count,
    COALESCE(SUM(d.value), 0)                  AS total_value,
    COALESCE(AVG(d.value), 0)                  AS avg_deal_value,
    COALESCE(AVG(d.probability), 0)            AS avg_probability,
    COALESCE(SUM(d.value * d.probability / 100.0), 0) AS weighted_value,
    MIN(d.expected_close_date)                  AS earliest_close,
    MAX(d.expected_close_date)                  AS latest_close,
    COALESCE(AVG(EXTRACT(DAY FROM (NOW() - d.created_at))), 0) AS avg_age_days
FROM deals d
WHERE d.won IS NULL -- open deals only
    AND d.deleted_at IS NULL
GROUP BY d.tenant_id, d.pipeline, d.stage;

CREATE UNIQUE INDEX uk_mv_pipeline ON mv_pipeline_summary (tenant_id, pipeline, stage);

-- ============================================================
-- 3. Sales Rep Performance: Hiệu suất nhân viên sales
-- Dùng cho: LeaderboardPage, TeamPage, RevenueIntelligencePage
-- ============================================================
CREATE MATERIALIZED VIEW mv_sales_rep_performance AS
SELECT
    e.tenant_id,
    e.id                                        AS employee_id,
    e.full_name,
    e.department_id,
    -- Deal metrics
    COUNT(d.id)                                 AS total_deals,
    COUNT(d.id) FILTER (WHERE d.won = TRUE)     AS deals_won,
    COUNT(d.id) FILTER (WHERE d.won = FALSE)    AS deals_lost,
    COALESCE(SUM(d.value) FILTER (WHERE d.won = TRUE), 0) AS revenue_won,
    CASE
        WHEN COUNT(d.id) FILTER (WHERE d.won IS NOT NULL) > 0
        THEN ROUND(COUNT(d.id) FILTER (WHERE d.won = TRUE)::NUMERIC / COUNT(d.id) FILTER (WHERE d.won IS NOT NULL) * 100, 1)
        ELSE 0
    END AS win_rate,
    COALESCE(AVG(EXTRACT(DAY FROM (d.actual_close_date - d.created_at))) FILTER (WHERE d.won = TRUE), 0) AS avg_cycle_days,
    -- Activity metrics
    COUNT(a.id)                                 AS total_activities,
    COUNT(a.id) FILTER (WHERE a.activity_type = 'call') AS calls,
    COUNT(a.id) FILTER (WHERE a.activity_type = 'email') AS emails,
    COUNT(a.id) FILTER (WHERE a.activity_type = 'meeting') AS meetings,
    -- Quota
    COALESCE(qr.quota_amount, 0)               AS current_quota,
    COALESCE(qr.achieved_amount, 0)            AS current_achieved,
    COALESCE(qr.attainment_pct, 0)             AS quota_attainment
FROM employees e
LEFT JOIN deals d ON d.owner_id = e.id AND d.tenant_id = e.tenant_id AND d.deleted_at IS NULL
LEFT JOIN activities a ON a.owner_id = e.id AND a.tenant_id = e.tenant_id AND a.deleted_at IS NULL
    AND a.created_at >= DATE_TRUNC('quarter', NOW())
LEFT JOIN quota_reps qr ON qr.employee_id = e.id AND qr.tenant_id = e.tenant_id AND qr.deleted_at IS NULL
    AND qr.period = TO_CHAR(NOW(), 'YYYY-Q') || EXTRACT(QUARTER FROM NOW())
WHERE e.deleted_at IS NULL
    AND e.employee_type = 'human'
    AND e.status = 'active'
GROUP BY e.tenant_id, e.id, e.full_name, e.department_id, qr.quota_amount, qr.achieved_amount, qr.attainment_pct;

CREATE UNIQUE INDEX uk_mv_sales_perf ON mv_sales_rep_performance (tenant_id, employee_id);

-- ============================================================
-- 4. Customer Health Overview: Tổng quan sức khoẻ khách hàng
-- Dùng cho: Customer360Page, CustomerHealthPage, ChurnPredictionPage
-- ============================================================
CREATE MATERIALIZED VIEW mv_customer_health_overview AS
SELECT
    ch.tenant_id,
    ch.contact_id,
    c.full_name                                 AS contact_name,
    c.company,
    ch.overall_score,
    ch.health_status,
    ch.arr,
    -- NPS
    ns.avg_score                                AS nps_avg,
    ns.latest_score                             AS nps_latest,
    -- Churn risk
    cr.risk_level                               AS churn_risk_level,
    cr.risk_score                               AS churn_risk_score,
    cr.arr_at_risk,
    -- Renewal info
    MIN(rn.renewal_date)                        AS next_renewal_date,
    -- Support
    COUNT(st.id)                                AS open_tickets,
    AVG(st.satisfaction)                        AS avg_satisfaction,
    -- Subscription MRR
    COALESCE(SUM(sub.mrr), 0)                  AS total_mrr
FROM customer_healths ch
JOIN contacts c ON c.id = ch.contact_id AND c.tenant_id = ch.tenant_id AND c.deleted_at IS NULL
LEFT JOIN client_nps_snapshots ns ON ns.contact_id = ch.contact_id AND ns.tenant_id = ch.tenant_id AND ns.deleted_at IS NULL
LEFT JOIN churn_risk_accounts cr ON cr.contact_id = ch.contact_id AND cr.tenant_id = ch.tenant_id AND cr.deleted_at IS NULL
LEFT JOIN renewals rn ON rn.contact_id = ch.contact_id AND rn.tenant_id = ch.tenant_id AND rn.deleted_at IS NULL AND rn.status = 'upcoming'
LEFT JOIN support_tickets st ON st.contact_id = ch.contact_id AND st.tenant_id = ch.tenant_id AND st.deleted_at IS NULL AND st.status IN ('open','in-progress')
LEFT JOIN subscriptions sub ON sub.contact_id = ch.contact_id AND sub.tenant_id = ch.tenant_id AND sub.deleted_at IS NULL AND sub.status = 'active'
WHERE ch.deleted_at IS NULL
GROUP BY ch.tenant_id, ch.contact_id, c.full_name, c.company, ch.overall_score, ch.health_status, ch.arr,
         ns.avg_score, ns.latest_score, cr.risk_level, cr.risk_score, cr.arr_at_risk;

CREATE UNIQUE INDEX uk_mv_customer_health ON mv_customer_health_overview (tenant_id, contact_id);

-- ============================================================
-- 5. Revenue Attribution: Gán doanh thu theo kênh & chiến dịch
-- Dùng cho: RevenueAttributionPage, CampaignRoiPage
-- ============================================================
CREATE MATERIALIZED VIEW mv_revenue_attribution AS
SELECT
    d.tenant_id,
    TO_CHAR(d.actual_close_date, 'YYYY-MM')     AS period,
    d.source                                     AS channel,
    COUNT(d.id)                                  AS deals_count,
    COALESCE(SUM(d.value), 0)                   AS total_revenue,
    COALESCE(AVG(d.value), 0)                   AS avg_deal_value,
    COALESCE(AVG(EXTRACT(DAY FROM (d.actual_close_date - d.created_at))), 0) AS avg_cycle_days,
    COALESCE(
        SUM(d.value)::NUMERIC / NULLIF(SUM(cr.spend), 0),
        0
    ) AS roi_ratio
FROM deals d
LEFT JOIN campaign_rois cr ON cr.tenant_id = d.tenant_id AND cr.channel = d.source
    AND cr.period = TO_CHAR(d.actual_close_date, 'YYYY-MM')
    AND cr.deleted_at IS NULL
WHERE d.won = TRUE
    AND d.actual_close_date IS NOT NULL
    AND d.deleted_at IS NULL
GROUP BY d.tenant_id, TO_CHAR(d.actual_close_date, 'YYYY-MM'), d.source;

CREATE UNIQUE INDEX uk_mv_rev_attr ON mv_revenue_attribution (tenant_id, period, channel);

-- ============================================================
-- 6. Territory Performance: Hiệu suất theo lãnh thổ
-- Dùng cho: TerritoryManagementPage, RevenueIntelligencePage
-- ============================================================
CREATE MATERIALIZED VIEW mv_territory_performance AS
SELECT
    t.tenant_id,
    t.id                                        AS territory_id,
    t.name                                      AS territory_name,
    t.region,
    -- Rep count
    COUNT(DISTINCT tr.employee_id)              AS rep_count,
    -- Deal metrics
    COUNT(DISTINCT d.id)                        AS total_deals,
    COALESCE(SUM(d.value) FILTER (WHERE d.won = TRUE), 0)  AS revenue_won,
    COALESCE(SUM(d.value) FILTER (WHERE d.won IS NULL), 0) AS pipeline_value,
    -- Quarter revenue vs target
    COALESCE(tqr.revenue, 0)                    AS quarter_revenue,
    COALESCE(tqr.target, 0)                     AS quarter_target,
    CASE
        WHEN COALESCE(tqr.target, 0) > 0
        THEN ROUND(COALESCE(tqr.revenue, 0) / tqr.target * 100, 1)
        ELSE 0
    END AS attainment_pct
FROM territories t
LEFT JOIN territory_reps tr ON tr.territory_id = t.id AND tr.tenant_id = t.tenant_id AND tr.deleted_at IS NULL
LEFT JOIN deals d ON d.owner_id = tr.employee_id AND d.tenant_id = t.tenant_id AND d.deleted_at IS NULL
LEFT JOIN territory_quarter_revenues tqr ON tqr.territory_id = t.id AND tqr.tenant_id = t.tenant_id
    AND tqr.quarter = TO_CHAR(NOW(), 'YYYY') || '-Q' || EXTRACT(QUARTER FROM NOW())
    AND tqr.deleted_at IS NULL
WHERE t.deleted_at IS NULL
    AND t.status = 'active'
GROUP BY t.tenant_id, t.id, t.name, t.region, tqr.revenue, tqr.target;

CREATE UNIQUE INDEX uk_mv_territory ON mv_territory_performance (tenant_id, territory_id);

-- ============================================================
-- Refresh script (chạy bởi pg_cron hoặc external scheduler)
-- Gợi ý: mỗi 15 phút cho real-time, mỗi 1 giờ cho analytics
-- ============================================================
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_pipeline_summary;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_sales_rep_performance;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_customer_health_overview;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_revenue_waterfall;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_revenue_attribution;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_territory_performance;
