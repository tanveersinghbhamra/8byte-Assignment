import { NextResponse } from "next/server";
import { portfolioSeed } from "@/lib/data/portfolio-seed";
import { fetchQuotes } from "@/lib/fetchers/yahoo";
import { buildDisplayStocks } from "@/lib/portfolio";

export async function GET() {
    const tickers = portfolioSeed.map((stock) => stock.exchange);
    const quotes = await fetchQuotes(tickers);

    const displayStocks = buildDisplayStocks(quotes);

    return NextResponse.json(displayStocks);
}
