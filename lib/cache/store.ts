import { fetchQuotes } from "@/lib/fetchers/yahoo";
import { portfolioSeed } from "@/lib/data/portfolio-seed";
import { LiveQuote } from "@/types/stock";

let cachedQuotes: Record<string, LiveQuote> = {};
let hasStarted = false;

async function refreshCache() {
    const tickers = portfolioSeed.map((stock) => stock.exchange);
    const quotes = await fetchQuotes(tickers);
    cachedQuotes = quotes;
}

export async function getCachedQuotes(): Promise<Record<string, LiveQuote>> {
    if (!hasStarted) {
        hasStarted = true;
        await refreshCache();
        setInterval(refreshCache, 15000);
    }

    return cachedQuotes;
}