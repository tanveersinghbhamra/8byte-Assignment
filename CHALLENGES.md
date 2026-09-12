# Challenges I Faced (and How I Solved Them)

## The spreadsheet had two different ticker formats mixed together
When I actually looked closely at the NSE/BSE column in the given spreadsheet, I noticed some rows had normal NSE symbols like HDFCBANK, but others just had raw BSE numbers like 532174. At first I didn't even catch this, I just typed in what looked like a reasonable ticker for a couple of them and moved on. It was only after double checking that I realized the sheet itself was inconsistent.

I decided to normalize everything to NSE symbols since my fetcher only needed to handle one suffix format (.NS) instead of juggling .NS and .BO depending on the stock. For the ones that only had BSE codes, I looked up the actual NSE ticker manually (found one of my own early guesses was wrong along the way where I had written "SAVFIN" when the real symbol is "SAVFI").

## Three stocks had no sector at all
Below the sector totals in the spreadsheet, there were three more stocks (Infy, Happiest Mind, Easemytrip) just sitting there with no sector label. I almost just dumped them into "Others" without thinking about it, but then realized the sheet's own total did not even include them meaning they were probably added later and never got folded in properly. Instead of guessing which sector they "should" belong to, I added a separate "Unassigned" category so I was not making up data that was not there.

## The Yahoo Finance library literally broke mid-build
This one was frustrating. I had working code, then out of nowhere every single fetch started throwing: Call const yahooFinance = new YahooFinance() first. Turns out npm had installed a newer version of yahoo-finance2 than what I originally set up code against, and that version changed how you are supposed to use the library, from just importing a ready to go function to importing a class and creating an instance of it yourself. Took a bit of digging through the error message and their GitHub docs to figure out what changed. Honestly this was a good real world reminder of exactly what the assignment warned about which was depending on an unofficial library means it can change under you without warning.

## Some stocks just... did not return data sometimes
While testing, I noticed LTIM and SAVFI would occasionally come back completely empty from Yahoo, not an error exactly, just nothing there. My code already had a try/catch around each fetch, so when I first saw two stocks missing from my table I panicked a little thinking something broke, but then I checked my terminal logs and saw it was actually working as intended, those two failed gracefully and the other 27 stocks loaded fine. That was actually a nice moment of seeing the error handling I built actually do its job for real, not just in theory.

## Gensol's regulatory situation
One of my holdings, Gensol, is apparently under SEBI investigation right now (I found this out while double checking ticker symbols). I did not do anything special code wise for this specific stock, but it is a good example of why relying on live market data from an unofficial source is inherently a bit risky, a company under investigation can have weird/halted trading data, and my general error handling needs to be solid enough to just absorb that kind of thing rather than needing a special case for every possible weird stock.

## Fighting with library type definitions
Two separate times, npm installed a newer version of a package than what I expected, and TypeScript threw errors that did not match anything I could find in tutorials. First with @tanstack/react-table, it installed an unstable v9 beta version with a totally different type signature than the stable version everyone actually uses, so I had to specifically reinstall version 8. Then again with recharts, where the tooltip's formatter function wanted a type I was not giving it. Both times the fix was basically the same lesson: read what the actual error says rather than assuming the code I have "should" work.

## The dashboard felt slow on every single load
Since I am fetching 29 stocks individually (no batch option in the library), and the whole request has to wait for the slowest one, every fresh page load took a noticeable couple of seconds. I fixed this by adding a caching layer on the server, instead of fetching from Yahoo every single time someone loads the page, my server refreshes its own cached copy every 15 seconds in the background, and everyone just reads from that. Made a real difference, most loads are now instant instead of waiting on Yahoo directly every time.

## Getting the math order right for Portfolio %
Small thing, but I initially tried calculating each stock's Portfolio % before I had the total investment across the whole portfolio calculated which obviously does not work since you need the grand total first to know what percentage any individual stock is. Had to restructure it into two passes: calculate the total first, then go back and calculate each stock's share of it.

## Vercel deployment was missing more stocks than my local version
After deploying, I noticed the live dashboard was showing way fewer stocks than my local version did, not just the usual couple that sometimes failed, but a lot more. At first I assumed something was broken in my code specifically for production, but after digging into it, I realized the actual cause was more interesting than a bug.

Locally, my requests to Yahoo Finance all come from one consistent machine (my laptop's IP address). But when deployed on Vercel, my API route runs as a serverless function, which means it can execute on different, temporary instances each time, often sharing IP address ranges with a lot of other unrelated projects also hosted on Vercel. Yahoo's unofficial endpoint does not know or care that my project is small and legitimate, so it can end up rate limiting or momentarily rejecting requests that come from those busier, shared IPs more aggressively than it would from a single home connection.

The fix was adding retry logic to each individual stock fetch. If a request fails, I wait briefly (300ms, then 600ms for a second retry) and try again, up to 3 times total, before finally giving up on that stock for that refresh cycle. Since most of these production failures were momentary rate limiting rather than a stock genuinely having no data, retrying gave the request a chance to succeed once the rate limit window passed. This fixed the majority of the missing-stocks issue in production.

Two stocks specifically — LTIM and SAVFI still fail consistently, even with retries, both locally and in production. I double checked and both tickers are correct and currently valid on NSE, so this is not a typo or bad data on my end. It looks like Yahoo's unofficial endpoint just does not reliably serve data for these two specific stocks, regardless of how many times you ask. Retries can recover a momentary failure, but they can not fix a data source that genuinely does not have the data to give back, so this one stays as a known limitation rather than something fixable on my side.

## What I would improve with more time
- Batch fetching — right now each stock is fetched individually; if a batch endpoint existed for this kind of data, it would cut down the number of network calls significantly and reduce the overall latency floor
- A licensed market data API as a fallback — something like Alpha Vantage or Finnhub, so the dashboard does not fully depend on an unofficial, undocumented source for its core data
- Table sorting — I decided against this since sorting the whole table conflicts with the sector grouping requirement (sorting by a column would break apart the grouped bands). A per-sector sort would be a nice addition given more time, but felt like the wrong tradeoff for a 3 day window given grouping was an explicit requirement and sorting was not
- Broader memoization — I applied useMemo to the sector total calculations specifically, but there is more room to apply it across the component tree if the dataset or update frequency grew larger
- Building on the caching layer — right now it is a simple in-memory cache tied to server uptime; a more production grade version would use something like Redis so the cache survives server restarts and scales across multiple instances
