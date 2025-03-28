# FindMyStuff - USF Lost & Found

A web application that helps USF students and staff connect lost items with their owners across the campus.

## Features

- User authentication (signup, login, password reset)
- Report lost items with location and images
- Search and filter lost items
- Interactive map integration
- User profiles and item management

## Tech Stack

- React 18 with TypeScript
- Vite
- Tailwind CSS
- Supabase (Database, Auth, Storage)
- Google Maps API
- React Router v6

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## License

MIT