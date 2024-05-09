import { QueryTypes } from "sequelize";
import { faker } from "@faker-js/faker";
import { db } from "./db";

const MAX_USER_ID = 500;

interface IMessage {
  sender_id: number;
  recipient_id: number;
  body: string;
  date: Date;
}

function generateMessage(): IMessage {
  const message = {
    sender_id: faker.number.int({ min: 2, max: MAX_USER_ID }),
    recipient_id: faker.number.int({ min: 2, max: MAX_USER_ID }),
    body: faker.lorem.sentence(),
    date: faker.date.past({ years: 1 }),
  };

  return message.sender_id === message.recipient_id
    ? generateMessage()
    : message;
}

function generateUser(id: number) {
  return {
    id,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

async function main() {
  process.stdout.write("generating fake admin user...");
  await db.query(
    "INSERT INTO users VALUES (1, 'admin', 'admin@root', 'changeme');",
  );
  process.stdout.write("done.\n");

  process.stdout.write("generating users...");
  let users = [] as {
    id: number;
    username: string;
    password: string;
    email: string;
  }[];

  for (let i = 2; i <= MAX_USER_ID; i++) {
    users.push(generateUser(i));
  }

  await db.query(
    `INSERT INTO users ( id, username, password, email ) VALUES 
    ${users
      .map(
        ({ id, username, password, email }) =>
          `(${id}, '${username}', '${password}', '${email}')`,
      )
      .join(",")}
  `,
    { type: QueryTypes.INSERT },
  );

  process.stdout.write(" done.");

  process.stdout.write("generating messages...");
  let messages = [] as {
    sender_id: number;
    recipient_id: number;
    body: string;
    date: Date;
  }[];

  for (let i = 2; i <= 10000; i++) {
    messages.push(generateMessage());
  }

  await db.query(
    `INSERT INTO messages ( sender_id, recipient_id, body, date ) VALUES 
    ${messages
      .map(
        ({ sender_id, recipient_id, body, date }) =>
          `(${sender_id}, ${recipient_id}, '${body}', '${date.toISOString()}')`,
      )
      .join(",")}
  `,
    { type: QueryTypes.INSERT },
  );

  process.stdout.write(" done.");
  process.exit(0);
}

main();
