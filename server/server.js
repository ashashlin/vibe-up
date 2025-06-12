import db from "./db/client";
import app from "./app";

const PORT = process.env.PORT ?? 3000;

await db.connect();

app.listen(PORT, () => console.log(`Server connected on port ${PORT}...`));
