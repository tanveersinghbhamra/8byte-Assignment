export interface Stock {
    name: string;
    purchasePrice: number;
    qty: number;
    exchange: string;
    sector:
        | "Financial"
        | "Tech"
        | "Consumer"
        | "Power"
        | "Pipe"
        | "Others"
        | "Unassigned";
}

export interface LiveQuote {
    cmp: number;
    peRatio?: number;
    latestEarnings?: number;
}

export interface DisplayStock extends Stock, LiveQuote {
    investment: number;
    portfolioPercent: number;
    presentValue: number;
    gainLoss: number;
}
