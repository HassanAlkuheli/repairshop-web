import { readFileSync } from "fs";
import path from "path";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

// load env (.env.local preferred, then .env)
config({ path: ".env.local", override: false });
config({ path: ".env", override: false });

const conn = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;
if (!conn) {
    throw new Error("No DATABASE_URL / NEON_DATABASE_URL found. Set it in .env.local or .env");
}

const client = neon(conn);

async function run() {
    const files = [
        path.resolve(__dirname, "../data/customers.sql"),
        path.resolve(__dirname, "../data/tickets.sql"),
    ];

    try {
        await client.query("BEGIN");
        for (const f of files) {
            const sql = readFileSync(f, "utf8");
            if (!sql.trim()) continue;
            await client.query(sql);
            console.log(`Executed ${path.basename(f)}`);
        }
        await client.query("COMMIT");
        console.log("Seeding completed.");
    } catch (err) {
        await client.query("ROLLBACK").catch(() => { });
        console.error("Seeding failed:", err);
        process.exitCode = 1;
    } finally {
        // serverless client may not need explicit close, but call a noop if available
        if (typeof (client as any).end === "function") await (client as any).end();
    }
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});