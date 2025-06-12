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
