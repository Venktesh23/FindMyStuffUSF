# FindMyStuff@USF

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?logo=netlify)](https://guileless-kitsune-a510c3.netlify.app)

A full-stack web application designed to help University of South Florida (USF) students report and recover lost items across campus. The platform provides real-time location tracking, advanced search capabilities, and seamless user authentication to facilitate efficient lost-and-found operations within the campus community.

## Overview

FindMyStuff@USF addresses the common challenge of lost items on university campuses by providing a centralized platform where students can report lost items, search for found items, and communicate with other users. The application leverages geolocation services to pinpoint item locations on an interactive campus map, making it easier to reunite students with their belongings.

## Features

- **User Authentication**: Secure email/password authentication with session management
- **Item Reporting**: Submit detailed reports for lost or found items with category classification
- **Geolocation Services**: Interactive Google Maps integration for precise location marking
- **Advanced Search**: Filter items by category, location, date, and keyword
- **Real-time Updates**: Live notifications when items matching user queries are reported
- **User Dashboard**: Centralized profile management for tracking submitted items and status updates
- **Item Status Tracking**: Monitor the lifecycle of reported items (active, resolved, expired)

## Technology Stack

### Frontend
- **React 18** with **TypeScript** for type-safe component development
- **Tailwind CSS** for responsive UI design
- **Google Maps API** for location-based features
- **Vite** as the build tool and development server

### Backend & Services
- **Supabase** for authentication, real-time database, and storage
- **PostgreSQL** as the primary relational database
- **Row Level Security (RLS)** for data access control

### Development Tools
- **ESLint** for code quality
- **TypeScript** for static type checking
- **Git** for version control

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/findmystuff-usf.git
   cd findmystuff-usf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. **Run database migrations**
   
   Apply the Supabase migrations located in `src/supabase/migrations/`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   
   Navigate to `http://localhost:5173` in your browser

## Project Structure

```
findmystuff-usf/
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page-level components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and configurations
│   ├── types/          # TypeScript type definitions
│   ├── supabase/
│   │   └── migrations/ # Database schema migrations
│   └── App.tsx         # Root application component
├── public/             # Static assets
└── package.json
```

## Database Schema

The application uses PostgreSQL with the following primary tables:

- **users**: User profiles and authentication data
- **items**: Lost and found item records with metadata
- **locations**: Geographic coordinates for item locations
- **notifications**: User notification queue for matches and updates

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

This project follows standard TypeScript and React best practices. Please ensure all code passes ESLint checks before committing.

## Deployment

The application is deployed on Netlify with continuous deployment from the main branch. The live demo is available at the badge link above.

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is developed as part of an academic initiative at the University of South Florida.

## Contact

For questions or feedback regarding this project, please open an issue on the GitHub repository.
