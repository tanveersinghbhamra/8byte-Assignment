"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { DisplayStock } from "@/types/stock";
import { formatCurrency } from "@/lib/format";

interface SectorChartProps {
    data: DisplayStock[];
}

const COLORS = [
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
    "#f472b6",
    "#94a3b8",
];

export function SectorChart({ data }: SectorChartProps) {
    const sectorMap: Record<string, number> = {};
    for (const stock of data) {
        sectorMap[stock.sector] =
            (sectorMap[stock.sector] || 0) + stock.presentValue;
    }

    const chartData = Object.entries(sectorMap).map(([sector, value]) => ({
        name: sector,
        value,
    }));

    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="mb-4 text-xs uppercase tracking-wide text-slate-500">
                Allocation by Sector
            </p>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                    >
                        {chartData.map((_, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                {chartData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{
                                backgroundColor: COLORS[index % COLORS.length],
                            }}
                        />
                        {entry.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
