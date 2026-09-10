import { portfolioSeed } from "@/lib/data/portfolio-seed";
import { DisplayStock, LiveQuote } from "@/types/stock";

const totalInvestment = portfolioSeed.reduce((total, stock) => {
    return total + stock.purchasePrice * stock.qty;
}, 0);

export function buildDisplayStocks(
    quotes: Record<string, LiveQuote>,
): DisplayStock[] {
    const displayStocks: DisplayStock[] = [];

    for (const stock of portfolioSeed) {
        const quote = quotes[stock.exchange];

        if (!quote) {
            continue;
        }

        const investment = stock.purchasePrice * stock.qty;
        const presentValue = quote.cmp * stock.qty;
        const gainLoss = presentValue - investment;
        const portfolioPercent = investment / totalInvestment;
        
        displayStocks.push({
            ...stock,
            ...quote,
            investment,
            presentValue,
            gainLoss,
            portfolioPercent
        })
    }

    return displayStocks;
}
