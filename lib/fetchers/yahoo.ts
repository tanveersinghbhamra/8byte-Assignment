import { LiveQuote } from "@/types/stock";
import YahooFinance from "yahoo-finance2";

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
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = (await yahooFinance.quote(
                ticker + ".NS",
            )) as YahooQuoteResult;

            if (!result || result.regularMarketPrice === undefined) {
                throw new Error("Missing regularMarketPrice");
            }

            return {
                cmp: result.regularMarketPrice,
                peRatio: result.trailingPE,
                latestEarnings: result.epsTrailingTwelveMonths,
            };
        } catch (error) {
            console.error(`Attempt ${attempt} failed for ${ticker}:`, error);

            if (attempt < maxAttempts) {
                await new Promise((resolve) =>
                    setTimeout(resolve, 300 * attempt),
                );
            }
        }
    }

    console.error(`All ${maxAttempts} attempts failed for ${ticker}`);
    return null;
}
