import db from "../client.js";

export async function getEventDetailsByEventId(eventId) {
  const sql = `
    SELECT
      events.*,
      venues.id AS venue_id,
      venues.name AS venue_name,
      venues.image AS venue_image,
      venues.postal_code,
      venues.address,
      venues.city,
      venues.state,
      venues.country,
      venues.longitude,
      venues.latitude,
      attractions.id AS attraction_id,
      attractions.name AS attraction_name,
      attractions.image AS attraction_image,
      attractions.segment,
      attractions.genre,
      attractions.sub_genre
    FROM favorite_events
    JOIN events
      ON favorite_events.event_id = events.id
    LEFT JOIN events_venues
      ON events.id = events_venues.event_id
    LEFT JOIN venues
      ON events_venues.venue_id = venues.id
    LEFT JOIN events_attractions
      ON events.id = events_attractions.event_id
    LEFT JOIN attractions
      ON events_attractions.attraction_id = attractions.id
    WHERE favorite_events.event_id = $1;
  `;

  const { rows: eventDetails } = await db.query(sql, [eventId]);

  return eventDetails;
}
