"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    ResponsiveContainer,
} from "recharts";
import { DisplayStock } from "@/types/stock";
import { formatCurrency } from "@/lib/format";

interface GainLossChartProps {
    data: DisplayStock[];
}

function CustomTooltip({ active, payload }: any) {
    if (!active || !payload || !payload.length) return null;

    const stock = payload[0];
    const value = stock.value as number;
    const isProfit = value >= 0;

    return (
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3">
            <p className="font-semibold text-slate-100">{stock.payload.name}</p>
            <p className={isProfit ? "text-green-400" : "text-red-400"}>
                {isProfit ? "Profit " : "Loss "}
                {formatCurrency(Math.abs(value))}
            </p>
        </div>
    );
}

export function GainLossChart({ data }: GainLossChartProps) {
    const chartData = [...data]
        .sort((a, b) => b.gainLoss - a.gainLoss)
        .map((stock) => ({
            name: stock.exchange,
            gainLoss: stock.gainLoss,
        }));

    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="mb-4 text-xs uppercase tracking-wide text-slate-500">
                Gain / Loss by Holding
            </p>
            <ResponsiveContainer width="100%" height={500}>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ left: 10 }}
                >
                    <XAxis
                        type="number"
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={90}
                        tick={{ fill: "#cbd5e1", fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Bar dataKey="gainLoss" name="Gain/Loss">
                        {chartData.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={
                                    entry.gainLoss >= 0 ? "#34d399" : "#f87171"
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
