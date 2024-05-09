CREATE EXTENSION "uuid-ossp";

CREATE TABLE users (
  id INT NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  body TEXT NOT NULL,
  sender_id INT NOT NULL,
  recipient_id INT NOT NULL,
  date TIMESTAMP NOT NULL,
  read BOOL DEFAULT false,

  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);


