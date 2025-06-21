import db from "../client.js";

export async function createEventVenue(eventId, venueId) {
  const sql = `
    INSERT INTO events_venues(
      event_id,
      venue_id
    )
    VALUES(
      $1,
      $2
    )
    RETURNING *;
  `;

  const {
    rows: [eventVenue],
  } = await db.query(sql, [eventId, venueId]);

  return eventVenue;
}

export async function getEventVenueByEventIdAndVenueId(eventId, venueId) {
  const sql = `
    SELECT * FROM events_venues
    WHERE event_id = $1
      AND venue_id = $2;
  `;

  const {
    rows: [eventVenue],
  } = await db.query(sql, [eventId, venueId]);

  return eventVenue;
}
