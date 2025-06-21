import db from "../client.js";

export async function createAttraction(
  id,
  name,
  image,
  segment,
  genre,
  subGenre
) {
  const sql = `
    INSERT INTO attractions(
      id,
      name,
      image,
      segment,
      genre,
      sub_genre
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
    rows: [attraction],
  } = await db.query(sql, [id, name, image, segment, genre, subGenre]);

  return attraction;
}

export async function getAttractionById(id) {
  const sql = `
    SELECT * FROM attractions
    WHERE id = $1;
  `;

  const {
    rows: [attraction],
  } = await db.query(sql, [id]);

  return attraction;
}
