import { NextResponse } from "next/server";
import { getCachedQuotes } from "@/lib/cache/store";
import { buildDisplayStocks } from "@/lib/portfolio";

export async function GET() {
    const quotes = await getCachedQuotes();
    const displayStocks = buildDisplayStocks(quotes);

    return NextResponse.json(displayStocks);
}
