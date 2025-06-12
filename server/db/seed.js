import { faker } from "@faker-js/faker";
import db from "./client.js";
import { createUser } from "./queries/users.js";

await db.connect();
await seed();
await db.end();
console.log("Database seeded.");

async function seed() {
  // --- Seed 2 users ---
  const emails = [];
  const firstNames = ["Jen", "Daniel"];
  const lastNames = ["Smith", "Brown"];

  for (let i = 0; i < 2; i++) {
    let email = faker.internet.email({
      firstName: firstNames[i],
      lastName: lastNames[i],
    });
    // Just in case we need to seed more users in the future and some might have the same name
    while (emails.includes(email)) {
      email = faker.internet.email({
        firstName: firstNames[i],
        lastName: lastNames[i],
      });
    }
    emails.push(email);

    const password = faker.internet.password();
    // delete later
    console.log(email, password);

    const firstName = firstNames[i];
    const lastName = lastNames[i];

    await createUser(email, password, firstName, lastName);
  }
}
