import db from "../client.js";

export async function createVenue(
  id,
  name,
  image,
  postalCode,
  address,
  city,
  state,
  country,
  longitude,
  latitude
) {
  const sql = `
    INSERT INTO venues(
      id,
      name,
      image,
      postal_code,
      address,
      city,
      state,
      country,
      longitude,
      latitude
    )
    VALUES(
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10
    )
    RETURNING *;
  `;

  const {
    rows: [venue],
  } = await db.query(sql, [
    id,
    name,
    image,
    postalCode,
    address,
    city,
    state,
    country,
    longitude,
    latitude,
  ]);

  return venue;
}

export async function getVenueById(id) {
  const sql = `
    SELECT * FROM venues
    WHERE id = $1;
  `;

  const {
    rows: [venue],
  } = await db.query(sql, [id]);

  return venue;
}
