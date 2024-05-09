# By Miles Senior Backend Engineer technical task

Thank you for taking the time to look at this task.

## Task

This project is an API for storing user data and messages between those users. It's a contrived example containing many _many_ poor choices and implementation flaws, and is by no means suitable production code.

Your task is to begin productionising the codebase; get familiar with the code, identify the most important issues in your opinion (security, performance, architecture, code style etc.), prioritise any optimisations and rectify as many of the issues as you can in the time given, and document the rest.

Please spend no longer than **1 hour** on this exercise. If you are still working towards the end of the hour, make a note of anything else you'd like to work on, either as inline `@TODO`s in the code or in the `CANDIDATE_NOTES.md` file, and we can discuss them in the final stage of the interview.

This isn't a pop-quiz; it's a way of helping you and us understand what your priorities are, how you assess impact and urgency, and how you operate within a timebox'd window. It's also a satisfying exercise in clearing up some awful code!

Disclaimer: I'm pleased to say that we have very little code that is anywhere near this bad at By Miles!

## Getting Started

This project consists of a basic Node.js API service (written in TypeScript) that uses Postgres for data persistence. There is also a mocked external dependency.

First, compile the TypeScript source to JS, spin up the service using Docker Compose, and seed the data. If you encounter any build errors, please resolve them before continuing.

```sh
npm ci

npm run build

docker-compose up

# Populate the test database with mock data
docker exec bymiles-sse-takehome_app_1 \
    npm run db:populate
```

The `dist` directory is mounted inside the Docker container as a volume. Once running, you can rebuild the code on your host machine, and the Node process in the container will reload.

You should now be able to access the API on port 3000.

```sh
curl \
    -H "Authorization: Basic $(cat .admin-credentials)" \
    http://localhost:3000/user/1
```

## Load Testing

A good place to start could be benchmarking the service; if you make any performance tweaks, you will be able to easily see their effect.

The `misc/benchmark.js` script exists for this purpose; it uses Autocannon to batter the service with requests.

```sh
node misc/benchmark.js >> results.json
```

## Starting Over

You can wipe the test database data by truncating the `users` table and running the populate command above.

```sh
docker exec bymiles-sse-takehome_db_1 \
    psql -c 'truncate table users cascade' -U postgres -d test

# repopulate
```
