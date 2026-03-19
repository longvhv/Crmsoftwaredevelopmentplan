/**
 * Deal Scoring Dashboard - AI-powered win probability analysis
 */
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Filter,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Target,
  Eye
} from "lucide-react";
import type { Deal } from "../../types/crm";
import { fetchDeals } from "../../api/crmApi";
import { DEAL_STAGE_CONFIG, formatCurrency } from "../../constants/crmConfig";

interface DealWithScore extends Deal {
  scoreTrend?: "up" | "down" | "stable";
  lastScoreUpdate?: string;
}

export function DealScoringDashboard() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<DealWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [sortBy, setSortBy] = useState<"score" | "value" | "stage">("score");

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    setLoading(true);
    try {
      const data = await fetchDeals();
      // Filter active deals only
      const activeDeals = data.filter(
        d => d.stage !== "closed-won" && d.stage !== "closed-lost"
      );
      
      // Add mock score trends
      const dealsWithScores = activeDeals.map(d => ({
        ...d,
        scoreTrend: Math.random() > 0.5 ? "up" : Math.random() > 0.3 ? "stable" : "down" as const,
        lastScoreUpdate: "2 hours ago"
      }));

      setDeals(dealsWithScores);
    } catch (error) {
      console.error("Error loading deals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort deals
  const filteredDeals = useMemo(() => {
    let result = [...deals];

    // Apply filter
    if (filter === "high") {
      result = result.filter(d => d.aiWinProbability >= 70);
    } else if (filter === "medium") {
      result = result.filter(d => d.aiWinProbability >= 40 && d.aiWinProbability < 70);
    } else if (filter === "low") {
      result = result.filter(d => d.aiWinProbability < 40);
    }

    // Apply sort
    if (sortBy === "score") {
      result.sort((a, b) => b.aiWinProbability - a.aiWinProbability);
    } else if (sortBy === "value") {
      result.sort((a, b) => b.value - a.value);
    } else if (sortBy === "stage") {
      const stageOrder = ["negotiation", "proposal", "discovery", "qualification"];
      result.sort((a, b) => stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage));
    }

    return result;
  }, [deals, filter, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const highProb = deals.filter(d => d.aiWinProbability >= 70);
    const mediumProb = deals.filter(d => d.aiWinProbability >= 40 && d.aiWinProbability < 70);
    const lowProb = deals.filter(d => d.aiWinProbability < 40);
    
    const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
    const weightedValue = deals.reduce((sum, d) => sum + d.value * (d.aiWinProbability / 100), 0);
    
    const avgScore = deals.length > 0 
      ? Math.round(deals.reduce((sum, d) => sum + d.aiWinProbability, 0) / deals.length)
      : 0;

    return {
      highProb: highProb.length,
      mediumProb: mediumProb.length,
      lowProb: lowProb.length,
      totalValue,
      weightedValue,
      avgScore,
      improving: deals.filter(d => d.scoreTrend === "up").length,
      declining: deals.filter(d => d.scoreTrend === "down").length,
    };
  }, [deals]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" };
    if (score >= 40) return { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" };
    return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" };
  };

  const getTrendIcon = (trend?: DealWithScore["scoreTrend"]) => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-600" />;
    return <div className="w-3 h-3" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/crm/pipeline")}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-6 h-6 text-violet-600" />
              AI Deal Scoring Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Win probability analysis cho {deals.length} active deals
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Win Probability</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.avgScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">High Probability</p>
                <p className="text-2xl font-semibold text-green-600">{stats.highProb}</p>
                <p className="text-xs text-gray-400">≥70% win rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Need Attention</p>
                <p className="text-2xl font-semibold text-amber-600">{stats.lowProb}</p>
                <p className="text-xs text-gray-400">&lt;40% win rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Weighted Pipeline</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(stats.weightedValue).slice(0, -4)}M
                </p>
                <p className="text-xs text-gray-400">
                  {Math.round((stats.weightedValue / stats.totalValue) * 100)}% of total
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Filter:</span>
              <div className="flex gap-2">
                {[
                  { id: "all", label: "All" },
                  { id: "high", label: "High (≥70%)" },
                  { id: "medium", label: "Medium (40-69%)" },
                  { id: "low", label: "Low (<40%)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id as typeof filter)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filter === f.id
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="score">Win Probability</option>
                <option value="value">Deal Value</option>
                <option value="stage">Stage</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deals List */}
        <div className="space-y-3">
          {filteredDeals.map((deal) => {
            const scoreColors = getScoreColor(deal.aiWinProbability);
            const stageConfig = DEAL_STAGE_CONFIG[deal.stage];

            return (
              <div
                key={deal.id}
                className={`bg-white border ${scoreColors.border} rounded-xl p-4 hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  {/* Score Circle */}
                  <div className={`flex-shrink-0 w-20 h-20 ${scoreColors.bg} rounded-xl flex flex-col items-center justify-center border ${scoreColors.border}`}>
                    <span className={`text-2xl font-bold ${scoreColors.text}`}>
                      {deal.aiWinProbability}%
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      {getTrendIcon(deal.scoreTrend)}
                      <span className="text-[10px] text-gray-500">
                        {deal.scoreTrend}
                      </span>
                    </div>
                  </div>

                  {/* Deal Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                          {deal.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded ${stageConfig.bgColor} ${stageConfig.color}`}>
                            {stageConfig.label}
                          </span>
                          <span className="text-xs text-gray-500">{deal.company}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{deal.contactName}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(deal.value)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Weighted: {formatCurrency(deal.value * (deal.aiWinProbability / 100))}
                        </p>
                      </div>
                    </div>

                    {/* AI Insights */}
                    {deal.aiNextAction && (
                      <div className="bg-violet-50 border border-violet-100 rounded-lg p-2.5 mb-2">
                        <p className="text-xs text-violet-700 flex items-center gap-1.5">
                          <Brain className="w-3 h-3" />
                          <span className="font-medium">AI Recommendation:</span>
                          <span>{deal.aiNextAction}</span>
                        </p>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Last updated: {deal.lastScoreUpdate}</span>
                        <span>•</span>
                        <span>Expected close: {deal.expectedCloseDate}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/crm/deals/${deal.id}?tab=ai-scoring`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs hover:bg-violet-700 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredDeals.length === 0 && (
            <div className="bg-white border border-dashed border-gray-200 rounded-xl p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Không có deal nào phù hợp với filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
