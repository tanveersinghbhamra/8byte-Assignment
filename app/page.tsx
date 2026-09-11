"use client";

import { useState, useEffect } from "react";
import { DisplayStock } from "@/types/stock";
import { PortfolioTable } from "@/components/PortfolioTable";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { SectorChart } from "@/components/SectorChart";
import { PortfolioSkeleton } from "@/components/PortfolioSkeleton";

export default function Home() {
    const [stocks, setStocks] = useState<DisplayStock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSector, setSelectedSector] = useState<string>("All");

    useEffect(() => {
        async function loadPortfolio() {
            const response = await fetch("/api/portfolio");
            const data = await response.json();
            setStocks(data);
            setIsLoading(false);
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
        <div className="min-h-screen bg-slate-950 p-6">
            <h1 className="mb-6 text-xl font-semibold text-slate-100">
                Portfolio Dashboard
            </h1>

            {isLoading ? (
                <PortfolioSkeleton />
            ) : (
                <div className="space-y-6">
                    <PortfolioSummary data={stocks} />

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            <SectorChart data={stocks} />
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
    );
}
