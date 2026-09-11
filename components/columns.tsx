"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DisplayStock } from "@/types/stock";
import { formatCurrency, formatNumber } from "@/lib/format";

export const columns: ColumnDef<DisplayStock, unknown>[] = [
    {
        accessorKey: "name",
        header: "Particulars",
    },

    {
        accessorKey: "purchasePrice",
        header: "Purchase Price",
        cell: ({ row }) => {
            const value = row.original.purchasePrice;
            return <span>{formatCurrency(value)}</span>;
        },
    },

    {
        accessorKey: "qty",
        header: "Qty",
    },

    {
        accessorKey: "investment",
        header: "Investment",
        cell: ({ row }) => {
            const value = row.original.investment;
            return <span>{formatCurrency(value)}</span>;
        },
    },

    {
        accessorKey: "portfolioPercent",
        header: "Portfolio (%)",
        cell: ({ row }) => {
            const value = row.original.portfolioPercent;
            return <span>{(value * 100).toFixed(2)}%</span>;
        },
    },

    {
        accessorKey: "exchange",
        header: "NSE/BSE",
    },

    {
        accessorKey: "cmp",
        header: "CMP",
        cell: ({ row }) => {
            const value = row.original.cmp;
            return <span>{formatCurrency(value)}</span>;
        },
    },

    {
        accessorKey: "presentValue",
        header: "Present Value",
        cell: ({ row }) => {
            const value = row.original.presentValue;
            return <span>{formatCurrency(value)}</span>;
        },
    },

    {
        accessorKey: "gainLoss",
        header: "Gain/Loss",
        cell: ({ row }) => {
            const value = row.original.gainLoss;
            return (
                <span
                    className={value >= 0 ? "text-green-500" : "text-red-500"}
                >
                    {formatCurrency(value)}
                </span>
            );
        },
    },

    {
        accessorKey: "peRatio",
        header: "P/E Ratio",
        cell: ({ row }) => {
            const value = row.original.peRatio;
            return (
                <span>{value === undefined ? "—" : formatNumber(value)}</span>
            );
        },
    },

    {
        accessorKey: "latestEarnings",
        header: "Latest Earnings",
        cell: ({ row }) => {
            const value = row.original.latestEarnings;
            return (
                <span>{value === undefined ? "—" : formatNumber(value)}</span>
            );
        },
    },
];
