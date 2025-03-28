# 🧭 FindMyStuff@USF

A modern web application built to help students at the **University of South Florida (USF)** report and find lost items around campus. Focused on enhancing the campus community by enabling real-time item tracking and easy communication between students. 📍🎒

---

## 🌟 Key Features

- 🔐 User authentication with email/password  
- 📍 Real-time lost item reporting with map-based locations  
- 🗺️ Interactive campus map using Google Maps  
- 🔎 Advanced search and filtering options  
- 🔔 Real-time notifications for matched or nearby items  
- 👤 User profiles to manage items  
- ✅ Track status of lost and found items  

---

## 🧰 Tech Stack

- **React 18 + TypeScript** (Frontend)
- **Node.js** (Backend)
- **PostgreSQL** (Database)
- **Supabase** (Authentication & Real-time updates)
- **Google Maps API** (Location mapping)
- **Tailwind CSS** (Styling/UI)


## ⚙️ Installation & Setup

Follow these steps to get the project running locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/findmystuff-usf.git
   cd findmystuff-usf

2. **Install Dependencies**
   ```bash
   npm install

3. **Create Environment Variables**
   ```bash
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

4. **Start the Development Server**
   ```bash
   npm run dev

5. **Open the App in Your Browser**
   ```bash
   http://localhost:5173


## 🔍 Application Walkthrough

---

### 🏠 1. Welcome Screen – Login & Sign Up

The home page greets users with a clean interface and options to either log in or sign up securely.  
This ensures that only authenticated USF students can access the reporting and tracking features.

📸 *Screenshot Placeholder – Login/Signup Page*  
`![Login & Sign Up](path/to/login-signup.png)`

---

### 🔍 2. Main Home Page – Search & Report

Once logged in, users land on the main home page, where they can either **search for lost items** or **report a new item**.  
This acts as the central hub for navigation across the platform.

📸 *Screenshot Placeholder – Main Home Page*  
`![Home - Search & Report](path/to/home-search-report.png)`

---

### 👤 3. Profile Section

Every user has a personalized profile section where they can:
- View their reported items
- Check the status (Lost, Found, Returned)
- Edit or remove existing reports

📸 *Screenshot Placeholder – Profile Page*  
`![Profile](path/to/profile.png)`

---

### 📝 4. Report Lost or Found Item

Users can report an item by providing:
- Title
- Description
- Category (e.g., electronics, accessories, etc.)
- Location (with Google Maps integration)
- Optional image upload

This ensures clear documentation and better chances of item recovery.

📸 *Screenshot Placeholder – Report Form*  
`![Report Item](path/to/report.png)`

---

### 🔎 5. Search Functionality

The search section allows users to:
- Filter items by category, location, or keywords
- View results visually on a map or as a list
- Click items for more details

📸 *Screenshot Placeholder – Search Page*  
`![Search](path/to/search.png)`

---



