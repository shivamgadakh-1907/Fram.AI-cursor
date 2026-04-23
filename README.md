# Farm AI Builder

## Run Locally

1. Install dependencies:
   - `npm install`
2. Create environment file:
   - Copy `.env.example` to `.env`
   - Optionally set `AGMARKNET_API_KEY`
3. Start app:
   - `npm start`
4. Open:
   - [http://localhost:3000](http://localhost:3000)

## New APIs

- `GET /markets?lat=<lat>&lng=<lng>&radiusKm=50`
- `GET /prices?marketId=<marketId>`

Compatibility aliases:
- `GET /nearby-markets`
- `GET /live-prices`

Both market APIs cache responses for 5 minutes.

## Map Integration (Free)

- Map uses Leaflet.js + OpenStreetMap tiles.
- No API key required.

## Agmarknet/Data.gov Source

- If `AGMARKNET_API_KEY` is configured, `/prices` tries to fetch Agmarknet-linked records via data.gov.in.
- If fetch fails, API serves cached data or fallback dataset to keep UI functional.
