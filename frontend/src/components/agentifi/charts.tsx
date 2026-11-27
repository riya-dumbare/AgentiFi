"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { decisionDistribution, riskDistribution } from "@/data/mock-data";
import type { FeatureContribution } from "@/data/types";

export function DecisionDistributionChart() {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={decisionDistribution}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            dataKey="value"
            stroke="var(--surface)"
            strokeWidth={4}
            isAnimationActive={false}
          >
            {decisionDistribution.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{ border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
export function RiskDistributionChart() {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={riskDistribution} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="bucket"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }}
          />
          <Bar
            dataKey="applications"
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
            maxBarSize={42}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export function FeatureContributionChart({ data }: { data: FeatureContribution[] }) {
  return (
    <div style={{ height: Math.max(180, data.length * 44 + 40) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 20, bottom: 4 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[-30, 40]}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            axisLine={false}
          />
          <YAxis
            dataKey="feature"
            type="category"
            width={120}
            tick={{ fontSize: 11, fill: "var(--foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => `${Number(value) > 0 ? "+" : ""}${value}`}
            contentStyle={{ border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }}
          />
          <Bar dataKey="value" radius={3}>
            {data.map((entry) => (
              <Cell
                key={entry.feature}
                fill={entry.value > 0 ? "var(--success)" : "var(--danger)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
