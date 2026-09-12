# NSE Portfolio Dashboard

A realtime portfolio dashboard built for 8byte's technical assignment — tracks live NSE stock prices, P/E ratios, and portfolio performance grouped by sector.

## Live Demo
[nse-portfolio-dashboard.vercel.app](https://nse-portfolio-dashboard.vercel.app)

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- @tanstack/react-table
- recharts
- yahoo-finance2

## Features
- Live CMP, P/E ratio, and earnings data fetched every 15 seconds
- Sector grouped holdings with per sector Investment/Present Value/Profit-Loss summaries
- Portfolio summary cards and allocation/performance charts
- Sector filtering
- Server side caching to minimize redundant API calls
- Graceful error handling for failed or incomplete data fetches

## Setup

\`\`\`
git clone [https://github.com/tanveersinghbhamra/8byte-Assignment](https://github.com/tanveersinghbhamra/8byte-Assignment)
cd nse-portfolio-dashboard
npm install
npm run dev

\`\`\`

Visit http://localhost:3000

## Project Structure

\`\`\`

app/
    api/portfolio/route.ts   — API endpoint serving live portfolio data
    page.tsx                 — main dashboard page

components/ 
    columns.tsx — react-table column definitions and cell formatting
    GainLossChart.tsx — per stock gain/loss bar chart
    PortfolioSkeleton.tsx — loading placeholder shown on initial load
    PortfolioSummary.tsx — top summary stat cards
    PortfolioTable.tsx — table renderer with manual sector grouping
    SectorChart.tsx — sector allocation donut chart

lib/
    cache/store.ts           — server side caching layer
    data/portfolio-seed.ts   — static holdings data
    fetchers/yahoo.ts        — Yahoo Finance integration
    portfolio.ts             — merge + derived calculations
    format.ts — currency/number formatting helpers (Intl.NumberFormat)

types/
    stock.ts             — TypeScript interfaces

\`\`\`

## Notes
See CHALLENGES.md for technical challenges faced and solutions.
