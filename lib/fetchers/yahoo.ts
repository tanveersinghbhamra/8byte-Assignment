import { LiveQuote } from "@/types/stock";
import  YahooFinance  from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function fetchQuotes(
    tickers: string[],
): Promise<Record<string, LiveQuote>> {
    const promises = tickers.map((ticker) => fetchOneQuote(ticker));

    const results = await Promise.allSettled(promises);

    const quotes: Record<string, LiveQuote> = {};

    for (let i = 0; i < tickers.length; i++) {
        const ticker = tickers[i];
        const result = results[i];

        if (result.status === "fulfilled" && result.value) {
            quotes[ticker] = result.value;
        }
    }
    console.log(quotes);
    return quotes;
}

interface YahooQuoteResult {
    regularMarketPrice?: number;
    trailingPE?: number;
    epsTrailingTwelveMonths?: number;
}

async function fetchOneQuote(ticker: string): Promise<LiveQuote | null> {
    try {
        const result = (await yahooFinance.quote(
            ticker + ".NS",
        )) as YahooQuoteResult;

        if (!result || result.regularMarketPrice === undefined) {
            console.error(`Failed to fetch ${ticker}'s regularMarketPrice`);
            return null;
        }

        return {
            cmp: result.regularMarketPrice,
            peRatio: result.trailingPE,
            latestEarnings: result.epsTrailingTwelveMonths,
        };
    } catch (error) {
        console.error(`Failed to fetch ${ticker}:`, error);
        return null;
    }
}
