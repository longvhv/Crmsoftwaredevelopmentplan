import { Bot, Zap, Users } from "lucide-react";
import type { AIInvolvementLevel } from "../../types/plan";
import { AI_LEVEL_CONFIG } from "../../constants/planConfig";

const ICON_MAP = {
  bot: <Bot className="w-3 h-3" />,
  zap: <Zap className="w-3 h-3" />,
  users: <Users className="w-3 h-3" />,
};

interface AILevelBadgeProps {
  level: AIInvolvementLevel;
  showLabel?: boolean;
  className?: string;
}

export function AILevelBadge({ level, showLabel = true, className = "" }: AILevelBadgeProps) {
  const config = AI_LEVEL_CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${config.color} ${className}`}>
      {ICON_MAP[config.iconType]}
      {showLabel && <span>{level}</span>}
    </span>
  );
}
