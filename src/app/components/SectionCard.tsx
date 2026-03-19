import { type ReactNode } from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function SectionCard({ title, subtitle, icon, children, className = "", headerAction }: SectionCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="text-violet-600">{icon}</div>}
          <div>
            <h3 className="text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        </div>
        {headerAction}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
