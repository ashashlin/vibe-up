import bcrypt from "bcrypt";
import db from "../client.js";

export async function createUser(email, password, firstName, lastName) {
  const sql = `
    INSERT INTO users(
      email,
      password,
      first_name,
      last_name
    )
    VALUES(
      $1,
      $2,
      $3,
      $4
    )
    RETURNING *;
  `;

  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [email, hashedPassword, firstName, lastName]);

  delete user.password;
  return user;
}

export async function getUserByEmail(email, password) {
  const sql = `
    SELECT * FROM users
    WHERE email = $1;
  `;

  const {
    rows: [user],
  } = await db.query(sql, [email]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  delete user.password;
  return user;
}
