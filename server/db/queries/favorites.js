import db from "../client.js";

export async function getFavoritesByUserId(id) {
  const sql = `
    SELECT * FROM favorite_events
    WHERE user_id = $1;
  `;

  const { rows: favorites } = await db.query(sql, [id]);

  return favorites;
}

export async function getEventByEventIdAndUserId(eventId, userId) {
  const sql = `
    SELECT * FROM favorite_events
    WHERE event_id = $1
      AND user_id = $2;
  `;

  const {
    rows: [favoriteEvent],
  } = await db.query(sql, [eventId, userId]);

  return favoriteEvent;
}
