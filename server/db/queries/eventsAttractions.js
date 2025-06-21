import db from "../client.js";

export async function createEventAttraction(eventId, attractionId) {
  const sql = `
    INSERT INTO events_attractions(
      event_id,
      attraction_id
    )
    VALUES(
      $1,
      $2
    )
    RETURNING *;
  `;

  const {
    rows: [eventAttraction],
  } = await db.query(sql, [eventId, attractionId]);

  return eventAttraction;
}

export async function getEventAttractionByEventIdAndAttractionId(
  eventId,
  attractionId
) {
  const sql = `
    SELECT * FROM events_attractions
    WHERE event_id = $1
      AND attraction_id = $2;
  `;

  const {
    rows: [eventAttraction],
  } = await db.query(sql, [eventId, attractionId]);

  return eventAttraction;
}
