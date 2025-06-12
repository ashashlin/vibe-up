# VIBEUP 🌍

**VIBEUP** is a full-stack web application that helps users discover live events around the world tailored to their vibe or mood. Whether you're feeling adventurous, romantic, artsy, or introverted, VIBEUP filters and displays relevant events using real-time data from the Ticketmaster API.

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

- 🔍 **Mood-Based Filtering**: Users can select a "vibe" (e.g. energetic, introvert, artsy, etc.) to explore relevant events.
- 🌆 **City Support**: Select a city from a list of global options.
- ❤️ **User Favorites**: Logged-in users can save and remove favorite events.
- 🔐 **Authentication**: Sign up and log in to access personal dashboard using JWT tokens.
- 🗺️ **(Stretch)** Map view to explore events by location.
- ✍️ **(Stretch)** Leave event ratings, reviews and reply to others.
- 🗂️ **User History**: Logged-in users can view their previously attended events in their dashboard.

---

## 🛠 Tech Stack

### Frontend:

- React (Vite)
- JavaScript
- Vanilla CSS with custom styling
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

1. User selects a mood and city from the frontend.
2. Frontend sends request to backend (`/api/events?city=...&vibe=...`).
3. Backend maps mood to classification types and calls Ticketmaster API.
4. Results are returned to frontend and displayed in a dynamic UI.
5. Logged-in users can save events via `/api/favorites` endpoints.

---

## 📸 Screenshots

_(To be added once the UI is complete)_

---

## 🚀 Getting Started

_To be completed (TBC)_

<!-- 1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/vibeup.git
   cd vibeup
   ```

2. Install dependencies:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Run development servers:
   ```bash
   # From root
   npm run dev  # or use concurrently
   ``` -->

---

## 📌 License

This project is for educational purposes and personal portfolio development.

---

## 🙋‍♀️ Author

_To be completed (TBC)_

<!-- [Ashley Lin](https://mywebsite.com) - fullstack developer with a strong front-end focus, based in NYC. -->
