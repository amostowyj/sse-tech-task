import { Sequelize } from "sequelize-typescript";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("db not configured.");
}

export const db = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: process.env.NODE_ENV !== "production" ? console.log : false,
  pool: {
    min: 1,
    max: 1,
  },
});

export async function testConnection() {
  try {
    await db.authenticate();
    console.log("Connection to database established successfully.");
  } catch (error) {
    console.error("Unable to connect to database:", error);
    process.exit(1);
  }
}
