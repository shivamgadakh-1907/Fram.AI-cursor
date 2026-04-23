# Farm AI Builder

## Run Locally

1. Install dependencies:
   - `npm install`
2. Create environment file:
   - Copy `.env.example` to `.env`
   - Set `GOOGLE_MAPS_API_KEY`
   - Optionally set `AGMARKNET_API_KEY`
3. Start app:
   - `npm start`
4. Open:
   - [http://localhost:3000](http://localhost:3000)

## New APIs

- `GET /nearby-markets?lat=<lat>&lng=<lng>&radiusKm=100`
- `GET /live-prices?marketId=<marketId>`
- `GET /api/config`

Both market APIs cache responses for 5 minutes.

## Google Maps Setup

1. In Google Cloud Console, enable:
   - Maps JavaScript API
   - Places API
2. Create an API key.
3. Restrict key by:
   - HTTP referrers (recommended)
   - API restrictions (Maps JavaScript API, Places API)
4. Put the key in `.env`:
   - `GOOGLE_MAPS_API_KEY=your_key_here`

## Agmarknet/Data.gov Source

- If `AGMARKNET_API_KEY` is configured, `/live-prices` tries to fetch Agmarknet-linked records via data.gov.in.
- If fetch fails, API serves cached data or fallback dataset to keep UI functional.
