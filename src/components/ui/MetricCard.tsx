import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: {
    value: number;
    label?: string;
    isPositiveGood?: boolean;
  };
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  delta,
  subtitle,
  icon,
  badge,
  className = '',
}: MetricCardProps) {
  const isPositive = delta ? delta.value >= 0 : false;
  const isGood = delta?.isPositiveGood !== undefined ? (isPositive ? delta.isPositiveGood : !delta.isPositiveGood) : isPositive;

  return (
    <div
      className={`p-5 rounded-xl bg-[#FFFFFF] border border-[#E7E5DF] shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:bg-[#161815] dark:border-[#2A2C27] flex flex-col justify-between transition-colors ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-medium text-[#6B6A63] dark:text-[#9A9A92] truncate">{title}</span>
        {icon && <span className="text-[#6B6A63] dark:text-[#9A9A92] shrink-0">{icon}</span>}
        {badge && (
          <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-[#F5F4EF] text-[#161714] border border-[#E7E5DF] dark:bg-[#20221E] dark:text-[#F2F1EC] dark:border-[#2A2C27]">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className="text-[26px] font-bold text-[#161714] dark:text-[#F2F1EC] tabular-nums tracking-tight leading-none">
          {value}
        </div>

        <div className="flex items-center gap-2 mt-2.5">
          {delta && (
            <span
              className={`inline-flex items-center gap-0.5 text-[11.5px] font-semibold px-1.5 py-0.5 rounded ${
                isGood
                  ? 'bg-[#2F7D4F]/10 text-[#24633E] dark:text-[#52B77A]'
                  : 'bg-[#C0392B]/10 text-[#962B20] dark:text-[#E86253]'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
              )}
              <span>{Math.abs(delta.value)}%</span>
            </span>
          )}

          {delta?.label && (
            <span className="text-[11.5px] text-[#8C8B83] dark:text-[#7A7972]">{delta.label}</span>
          )}

          {!delta && subtitle && (
            <span className="text-[11.5px] text-[#8C8B83] dark:text-[#7A7972]">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
