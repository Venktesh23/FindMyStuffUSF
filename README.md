# FindMyStuff@USF

A web app for USF students to report and recover lost items across campus. Built with React, Supabase, and Google Maps.

## Features

- **User Authentication** — email/password login with session management via Supabase
- **Item Reporting** — report lost or found items with category and location
- **Interactive Map** — Google Maps integration for pinpointing item locations on campus
- **Advanced Search** — filter by category, location, date, and keyword
- **Real-time Updates** — live notifications when matching items are reported
- **Dashboard** — track your submitted items and their status

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Backend:** Supabase (auth, database, real-time), PostgreSQL
- **Maps:** Google Maps API + Places API

## Getting Started

### Prerequisites

- Node.js v16+
- Supabase project
- Google Maps API key (with Maps JavaScript API and Places API enabled)

### Setup

1. Clone and install:
   ```bash
   git clone https://github.com/your-username/findmystuff-usf.git
   cd findmystuff-usf
   npm install
   ```

2. Create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

3. Apply database migrations from `src/supabase/migrations/` in your Supabase project.

4. Start the dev server:
   ```bash
   npm run dev
   ```
   Then open `http://localhost:5173`.

### Google Maps API Setup

In [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials, edit your API key:
- **HTTP referrers:** add `http://localhost:*` for local development
- **API restrictions:** enable Maps JavaScript API and Places API
- Billing must be enabled (Google requires it; free tier credits apply)

## Project Structure

```
findmystuff-usf/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and config
│   ├── types/          # TypeScript types
│   └── supabase/
│       └── migrations/ # Database schema
├── public/
└── config/             # Vite and ESLint config
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Deployment

Deployable to Netlify. Set the build command to `npm run build` and publish directory to `dist`. Add all `.env` variables in Netlify's environment settings. A `_redirects` file is included in `public/` to handle React Router.

## License

Developed as part of an academic initiative at the University of South Florida.
