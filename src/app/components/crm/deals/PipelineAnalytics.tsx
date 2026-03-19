/**
 * Pipeline Analytics Dashboard - Revenue metrics, conversion rates, velocity
 */
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Clock,
  Zap,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import type { Deal, DealStage } from "../../../types/crm";
import { DEAL_STAGE_CONFIG, ACTIVE_DEAL_STAGES, formatCurrency, formatCompactNumber } from "../../../constants/crmConfig";

interface PipelineAnalyticsProps {
  deals: Deal[];
}

interface StageMetrics {
  stage: DealStage;
  count: number;
  value: number;
  avgDealSize: number;
  winRate: number;
}

export function PipelineAnalytics({ deals }: PipelineAnalyticsProps) {
  // Filter active deals (not closed)
  const activeDeals = deals.filter(d => 
    d.stage !== "closed-won" && d.stage !== "closed-lost"
  );
  
  const closedWonDeals = deals.filter(d => d.stage === "closed-won");
  const closedLostDeals = deals.filter(d => d.stage === "closed-lost");

  // Calculate metrics
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const totalWonValue = closedWonDeals.reduce((sum, d) => sum + d.value, 0);
  const totalDeals = deals.length;
  const avgDealSize = totalDeals > 0 ? totalPipelineValue / activeDeals.length : 0;
  
  // Win rate calculation
  const closedDeals = closedWonDeals.length + closedLostDeals.length;
  const winRate = closedDeals > 0 ? (closedWonDeals.length / closedDeals) * 100 : 0;

  // Calculate weighted pipeline value (probability-weighted)
  const weightedPipelineValue = activeDeals.reduce((sum, d) => {
    return sum + (d.value * (d.aiWinProbability / 100));
  }, 0);

  // Average deal cycle (mock - days in pipeline)
  const avgDealCycle = 45; // In real app, calculate from created_date to closed_date

  // Velocity (deals per week)
  const velocity = closedWonDeals.length / 4; // Assuming last 4 weeks

  // Stage metrics
  const stageMetrics: StageMetrics[] = ACTIVE_DEAL_STAGES.map(stage => {
    const stageDeals = deals.filter(d => d.stage === stage);
    const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
    
    return {
      stage,
      count: stageDeals.length,
      value: stageValue,
      avgDealSize: stageDeals.length > 0 ? stageValue / stageDeals.length : 0,
      winRate: 0 // Would need historical data
    };
  });

  // Conversion rates between stages (mock data)
  const conversionRates = [
    { from: "Qualification", to: "Discovery", rate: 75 },
    { from: "Discovery", to: "Proposal", rate: 60 },
    { from: "Proposal", to: "Negotiation", rate: 50 },
    { from: "Negotiation", to: "Closed Won", rate: 70 },
  ];

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Pipeline Value */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-violet-600" />
            <span className="text-xs text-gray-500">Pipeline Value</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">
            {formatCompactNumber(totalPipelineValue)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {activeDeals.length} active deals
          </div>
        </div>

        {/* Weighted Pipeline */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-500">Weighted Value</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">
            {formatCompactNumber(weightedPipelineValue)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-green-600">
              {Math.round((weightedPipelineValue / totalPipelineValue) * 100)}% probability
            </span>
          </div>
        </div>

        {/* Win Rate */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-500">Win Rate</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">
            {winRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {closedWonDeals.length} won / {closedDeals} closed
          </div>
        </div>

        {/* Avg Deal Size */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-gray-500">Avg Deal Size</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">
            {formatCompactNumber(avgDealSize)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            per deal
          </div>
        </div>
      </div>

      {/* Stage Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">Stage Breakdown</h3>
        </div>

        <div className="space-y-3">
          {stageMetrics.map((metric) => {
            const config = DEAL_STAGE_CONFIG[metric.stage];
            const percentage = totalPipelineValue > 0 
              ? (metric.value / totalPipelineValue) * 100 
              : 0;

            return (
              <div key={metric.stage}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${config.bgColor} ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {metric.count} deals
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatCompactNumber(metric.value)}
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full ${config.color === "text-green-700" ? "bg-green-500" : 
                      config.color === "text-blue-700" ? "bg-blue-500" :
                      config.color === "text-violet-700" ? "bg-violet-500" :
                      config.color === "text-amber-700" ? "bg-amber-500" : "bg-gray-500"}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">
                    {percentage.toFixed(1)}% of pipeline
                  </span>
                  <span className="text-xs text-gray-400">
                    Avg: {formatCompactNumber(metric.avgDealSize)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">Conversion Funnel</h3>
        </div>

        <div className="space-y-2">
          {conversionRates.map((conversion, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">
                    {conversion.from} → {conversion.to}
                  </span>
                  <span className={`text-xs font-medium ${
                    conversion.rate >= 70 ? "text-green-600" :
                    conversion.rate >= 50 ? "text-amber-600" : "text-red-600"
                  }`}>
                    {conversion.rate}%
                  </span>
                </div>
                <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full ${
                      conversion.rate >= 70 ? "bg-green-500" :
                      conversion.rate >= 50 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${conversion.rate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Avg Deal Cycle</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">{avgDealCycle} days</div>
          <div className="text-xs text-gray-500 mt-1">from create to close</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Velocity</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">{velocity.toFixed(1)} deals/week</div>
          <div className="text-xs text-gray-500 mt-1">closed won rate</div>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-gray-600 mb-1">Total Won Revenue</div>
            <div className="text-2xl font-semibold text-gray-900">
              {formatCurrency(totalWonValue)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600 mb-1">Forecast (Weighted)</div>
            <div className="text-2xl font-semibold text-violet-600">
              {formatCurrency(weightedPipelineValue)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <TrendingUp className="w-3 h-3 text-green-600" />
          <span>Expected close rate: {winRate.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
