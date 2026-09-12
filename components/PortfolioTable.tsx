"use client";

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { DisplayStock } from "@/types/stock";
import { columns } from "./columns";
import { formatCurrency } from "@/lib/format";
import { useMemo } from "react";

interface PortfolioTableProps {
    data: DisplayStock[];
}

export function PortfolioTable({ data }: PortfolioTableProps) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const sectorTotals = useMemo(() => {
        const totals: Record<
            string,
            { investment: number; presentValue: number }
        > = {};
        for (const stock of data) {
            if (!totals[stock.sector]) {
                totals[stock.sector] = { investment: 0, presentValue: 0 };
            }
            totals[stock.sector].investment += stock.investment;
            totals[stock.sector].presentValue += stock.presentValue;
        }
        return totals;
    }, [data]);

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-sm text-slate-200">
                <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-3 text-left font-medium"
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {(() => {
                        const rows = table.getRowModel().rows;

                        const output: React.ReactNode[] = [];
                        let previousSector: string | null = null;

                        for (const row of rows) {
                            const currentSector = row.original.sector;

                            if (currentSector !== previousSector) {
                                const totals = sectorTotals[currentSector];
                                const sectorGainLoss =
                                    totals.presentValue - totals.investment;

                                output.push(
                                    <tr key={`sector-${currentSector}`}>
                                        <td
                                            colSpan={11}
                                            className="bg-slate-800/80 px-4 py-3"
                                        >
                                            <div className="flex items-center justify-start gap-8 text-sm">
                                                <span className="font-semibold text-slate-200">
                                                    {currentSector}
                                                </span>
                                                <div className="text-slate-400">
                                                    <span className="text-slate-500">
                                                        Investment{" "}
                                                    </span>
                                                    <span className="text-slate-200">
                                                        {formatCurrency(
                                                            totals.investment,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="text-slate-400">
                                                    <span className="text-slate-500">
                                                        Present Value{" "}
                                                    </span>
                                                    <span className="text-slate-200">
                                                        {formatCurrency(
                                                            totals.presentValue,
                                                        )}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`font-semibold ${sectorGainLoss >= 0 ? "text-green-400" : "text-red-400"}`}
                                                >
                                                    {sectorGainLoss >= 0
                                                        ? "Profit "
                                                        : "Loss "}
                                                    {formatCurrency(
                                                        Math.abs(
                                                            sectorGainLoss,
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>,
                                );
                                previousSector = currentSector;
                            }

                            output.push(
                                <tr
                                    key={row.id}
                                    className="border-t border-slate-800 hover:bg-slate-900/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-4 py-3 whitespace-nowrap"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>,
                            );
                        }

                        return output;
                    })()}
                </tbody>
            </table>
        </div>
    );
}
