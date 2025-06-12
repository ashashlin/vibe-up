-- Might need to edit later
-- Drop tables in reverse order to avoid foreign key constraint errors
DROP TABLE IF EXISTS favorite_events;
DROP TABLE IF EXISTS events_attractions;
DROP TABLE IF EXISTS events_venues;
DROP TABLE IF EXISTS attractions;
DROP TABLE IF EXISTS venues;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  created_at
    TIMESTAMP WITH TIME ZONE
    NOT NULL
    DEFAULT CURRENT_TIMESTAMP
);

-- Save events that a user has favorited or attended to events
CREATE TABLE events(
  id VARCHAR(255) PRIMARY KEY, -- the Ticketmaster event id
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  start_date_time
    TIMESTAMP WITH TIME ZONE
    NOT NULL,
  end_date_time
    TIMESTAMP WITH TIME ZONE
);

CREATE TABLE venues (
  id VARCHAR(255) PRIMARY KEY, -- the Ticketmaster venue id
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  postal_code VARCHAR(20),
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50),
  country VARCHAR(50) NOT NULL,
  longitude FLOAT,
  latitude FLOAT
);

CREATE TABLE attractions (
  id VARCHAR(255) PRIMARY KEY, -- Ticketmaster attraction id
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  segment VARCHAR(100),
  genre VARCHAR(100),
  sub_genre VARCHAR(100)
);

CREATE TABLE events_venues (
  event_id VARCHAR(255) NOT NULL
    REFERENCES events(id) ON DELETE CASCADE,
  venue_id VARCHAR(255) NOT NULL
    REFERENCES venues(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, venue_id)
);

CREATE TABLE events_attractions (
  event_id VARCHAR(255) NOT NULL
    REFERENCES events(id) ON DELETE CASCADE,
  attraction_id VARCHAR(255) NOT NULL
    REFERENCES attractions(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, attraction_id)
);

CREATE TABLE favorite_events(
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(255) NOT NULL
    REFERENCES events(id) ON DELETE CASCADE,
  user_id INT NOT NULL
    REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, event_id)
);

-- Stretch:
-- Later create the reviews and replies tables, and use attended_events to check if a user has attended an event. If yes, they will be able to post a review or reply
-- CREATE TABLE attended_events(
--   id SERIAL PRIMARY KEY,
--   event_id VARCHAR(255) NOT NULL
--     REFERENCES events(id) ON DELETE CASCADE,
--   user_id INT NOT NULL
--     REFERENCES users(id) ON DELETE CASCADE,
--   UNIQUE(user_id, event_id)
-- );
