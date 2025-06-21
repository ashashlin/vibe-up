import db from "../client.js";

export async function createEvent(
  id,
  name,
  url,
  image,
  startLocalDate,
  startLocalTime
) {
  const sql = `
    INSERT INTO events(
      id,
      name,
      url,
      image,
      start_local_date,
      start_local_time
    )
    VALUES(
      $1,
      $2,
      $3,
      $4,
      $5,
      $6
    )
    RETURNING *;
  `;

  const {
    rows: [event],
  } = await db.query(sql, [
    id,
    name,
    url,
    image,
    startLocalDate,
    startLocalTime,
  ]);

  return event;
}

export async function getEventById(id) {
  const sql = `
    SELECT * FROM events
    WHERE id = $1;
  `;

  const {
    rows: [event],
  } = await db.query(sql, [id]);

  return event;
}
