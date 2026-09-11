"use client";

import { DisplayStock } from "@/types/stock";
import { formatCurrency } from "@/lib/format";
import {
    Wallet,
    IndianRupee,
    TrendingUp,
    TrendingDown,
    Layers,
} from "lucide-react";

interface PortfolioSummaryProps {
    data: DisplayStock[];
}

export function PortfolioSummary({ data }: PortfolioSummaryProps) {
    const totalInvestment = data.reduce(
        (sum, stock) => sum + stock.investment,
        0,
    );
    const totalPresentValue = data.reduce(
        (sum, stock) => sum + stock.presentValue,
        0,
    );
    const totalGainLoss = totalPresentValue - totalInvestment;
    const isProfit = totalGainLoss >= 0;

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Total Investment
                    </p>
                    <Wallet className="h-4 w-4 text-blue-400" />
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-100 sm:text-2xl">
                    {formatCurrency(totalInvestment)}
                </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Present Value
                    </p>
                    <IndianRupee className="h-4 w-4 text-blue-400" />
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-100 sm:text-2xl">
                    {formatCurrency(totalPresentValue)}
                </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        {isProfit ? "Total Profit" : "Total Loss"}
                    </p>
                    {isProfit ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                </div>
                <p
                    className={`mt-2 text-lg font-semibold sm:text-2xl ${isProfit ? "text-green-400" : "text-red-400"}`}
                >
                    {formatCurrency(Math.abs(totalGainLoss))}
                </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Holdings
                    </p>
                    <Layers className="h-4 w-4 text-purple-400" />
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-100 sm:text-2xl">
                    {data.length}
                </p>
            </div>
        </div>
    );
}
