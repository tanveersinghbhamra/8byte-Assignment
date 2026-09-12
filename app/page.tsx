"use client";

import { useState, useEffect } from "react";
import { DisplayStock } from "@/types/stock";
import { PortfolioTable } from "@/components/PortfolioTable";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { SectorChart } from "@/components/SectorChart";
import { PortfolioSkeleton } from "@/components/PortfolioSkeleton";
import { GainLossChart } from "@/components/GainLossChart";

export default function Home() {
    const [stocks, setStocks] = useState<DisplayStock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedSector, setSelectedSector] = useState<string>("All");

    useEffect(() => {
        async function loadPortfolio() {
            setIsRefreshing(true);
            const response = await fetch("/api/portfolio");
            const data = await response.json();
            setStocks(data);
            setIsLoading(false);
            setIsRefreshing(false);
        }

        loadPortfolio();
        const intervalId = setInterval(loadPortfolio, 15000);
        return () => clearInterval(intervalId);
    }, []);

    const sectors = ["All", ...new Set(stocks.map((s) => s.sector))];
    const filteredStocks =
        selectedSector === "All"
            ? stocks
            : stocks.filter((s) => s.sector === selectedSector);

    return (
        <>
            <div className="min-h-screen bg-slate-950 p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100">
                            Portfolio Dashboard
                        </h1>
                        <p className="text-sm text-slate-500">
                            Realtime NSE holdings tracker
                        </p>
                    </div>
                    <div
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${
                            isRefreshing
                                ? "border-blue-800 bg-blue-950"
                                : "border-slate-800 bg-slate-900"
                        }`}
                    >
                        <span className="relative flex h-2 w-2">
                            {!isRefreshing && (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            )}
                            <span
                                className={`relative inline-flex h-2 w-2 rounded-full ${
                                    isRefreshing
                                        ? "bg-blue-400"
                                        : "bg-green-500"
                                }`}
                            />
                        </span>
                        <span
                            className={`text-xs ${isRefreshing ? "text-blue-300" : "text-slate-400"}`}
                        >
                            {isRefreshing ? "Refreshing" : "Live"}
                        </span>
                    </div>
                </div>

                {isLoading ? (
                    <PortfolioSkeleton />
                ) : (
                    <div className="space-y-6">
                        <PortfolioSummary data={stocks} />

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <div className="lg:col-span-1">
                                <SectorChart data={stocks} />
                            </div>
                            <div className="lg:col-span-2">
                                <GainLossChart data={stocks} />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {sectors.map((sector) => (
                                <button
                                    key={sector}
                                    onClick={() => setSelectedSector(sector)}
                                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                        selectedSector === sector
                                            ? "bg-blue-500 text-white"
                                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                    }`}
                                >
                                    {sector}
                                </button>
                            ))}
                        </div>

                        <PortfolioTable data={filteredStocks} />
                    </div>
                )}
            </div>
            <footer className="mt-10 mb-10 border-t border-slate-800 pt-6 text-center text-s text-slate-400">
            Built by Tanveersingh Bhamra for 8byte
            </footer>
        </>
    );
}
