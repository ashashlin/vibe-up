import db from "../client.js";

export async function createFavoriteEvent(eventId, userId) {
  const sql = `
    INSERT INTO favorite_events(
      event_id,
      user_id
    )
    VALUES(
      $1,
      $2
    )
    RETURNING *;
  `;

  const {
    rows: [favoriteEvent],
  } = await db.query(sql, [eventId, userId]);

  return favoriteEvent;
}

export async function deleteFavoriteEvent(eventId, userId) {
  const sql = `
    DELETE FROM favorite_events
      WHERE event_id = $1
        AND user_id = $2;
  `;

  await db.query(sql, [eventId, userId]);
}
