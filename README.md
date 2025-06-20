# VIBEUP 🎡

**VIBEUP** is a full-stack web application that helps users discover live events in the US tailored to their vibe or mood. Whether you're feeling adventurous, romantic, artsy, or introverted, VIBEUP filters and displays relevant events using real-time data from the Ticketmaster API.

---

## 🧠 Overview

### 📌 Problem Statement

Most event discovery platforms are based on categories or what's trending — not how people _feel_. Users often don't know exactly what they're looking for, just that they're in a certain mood. VIBEUP solves this by connecting moods to live event types, letting users explore based on how they feel.

### 🎯 Goals

- Help users discover live events based on mood
- Support mood and city-based filtering
- Allow users to save events to favorites
- Enable easy sign-up/login for a personalized dashboard
- Provide a sleek, responsive UI experience

---

## 🌟 Core Features

- 🌆 **City Support**: Select a city from a list of options in the US.
- 🔍 **Mood-Based Filtering**: Users can select one or more "vibes" (e.g. energetic, introvert, artsy, etc.) to explore relevant events.
- 🔐 **Authentication**: Sign up and log in to access personal dashboard using JWT tokens.
- ❤️ **User Favorites**: Logged-in users can save and remove favorite events.
- 🗺️ **Map View(Stretch)** Map view to explore events by location.
- ✍️ **User Reviews(Stretch)** Leave event ratings, reviews and reply to others.
- 🗂️ **User History(Stretch)**: Logged-in users can view their previously attended events in their dashboard.

---

## 🛠 Tech Stack

### Frontend:

- React (Vite)
- JavaScript
- Vanilla CSS
- React Router

### Backend:

- Node.js
- Express.js
- PostgreSQL (with `pg` library)
- JWT (JSON Web Tokens)
- bcrypt (for password hashing)

### External APIs:

- [Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)

### Development Tools:

- Vite
- Thunder Client (for API testing)
- Git / GitHub

---

## 🏗 Architecture Overview

_To be completed (TBC)_

### System Flow

1. User selects a city from the frontend.
2. Frontend sends request to backend (`/api/events?city=...&vibe=...`). Default vibe is all vibes.
3. Backend calls Ticketmaster API, maps selected vibe(s) to classification types, and filters events based on those types.
4. Results are returned to frontend and displayed in a dynamic UI.
5. Logged-in users can save events via `/api/favorites` endpoints.

---

## 📸 Screenshots

_(To be added once the UI is complete)_

---

## 🚀 Getting Started

_To be completed (TBC)_

1. Clone the repo:

   ```bash
   git clone https://github.com/ashashlin/vibe-up.git
   cd vibe-up
   ```

2. Install dependencies:

   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```

3. Create a `.env` file in the `server` directory based on `.env.example`:

   ```bash
   cd server
   cp .env.example .env
   ```

   Then, edit the `.env` file to add your own API keys and secrets (e.g., Ticketmaster API key, JWT secret, database URL). You can obtain a free Ticketmaster API key by signing up at [https://developer.ticketmaster.com/products-and-docs/apis/getting-started/](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/).

4. Run development servers:
   Start the backend:

   ```bash
   cd server
   npm run dev
   ```

   Start the frontend (in a separate terminal):

   ```bash
   cd client
   npm run dev
   ```

---

## 📌 License

This project is for educational purposes and personal portfolio development.

---

## 🙋‍♀️ Author

<!-- _To be updated (TBU)_ -->

Ashley Lin - fullstack developer with a strong front-end focus.
