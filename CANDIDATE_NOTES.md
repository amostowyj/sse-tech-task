# Candidate Notes (Anya Mostowyj)

## Preamble

Seeing as I'm new to Typescript and Node, I decided to use my time trying to identify as many issues as I could by just revoiewing the code and exercising the API via Postman a little.

The following is a list of the issues I've spotted, but you'll have to forgive me if I missed any glaring TS bad pratice or coding conventions, as this isn't something I'm an expert on (yet!).

Instead of making clumsy code changes I've just tried to detail as many issues as I could in this document, and I've made suggestions of the changes I would make (with more time and a quick crash course in good Typescript conventions). I hope this is OK.

I'll hold my hands up now though, the process of setting up my development environment and reviewing/playing with the code definitely took me way over the allocated hour - apologies for this, I wasn't trying to cheat, I was just enjoying looking for errors in the code and lost track of time. Thank for taking the time to create this sample app, it's been a lot of fun to review.

## Issues

### Security

- The API uses basic auth -  unencrypted (base64 encoded) user IDs and passwords are being sent in the request headers of every user request

_There are several inherent and well-understood problems with using basic auth these days (like brute force attacks) and there are good alternatives available, like OAuth and JWT. I won't attempt to list them all here, but obviously implementing more robost authentication would be a good first step to improving the API._

- There are no authorisation checks

_Once authenticated, the system should check if the user is allowed to access the data they're requesting (authorisation). Currently there is no relationship between the authenticated user id (passed in the auth header) and the user id in the request, so any user can currently view the details and messages of any other user - when authenticated as Anya I shouldn't be able to access Jon's personal details or messages (or vice versa)._

_The lack of complex authentication and non-existant authorisation checks allows for easy farming of user data from this API._

- User IDs, usernames, passwords and email addresses (PII data) are all stored as plain text in the users database table. This is both a security risk for the API and a potential PII breach for our users. Message bodies are also stored as plain text, and could possibly hold sensitive/private data.

_Any sensitive/PII data should be 'encrypted at rest', limiting the impact of any unauthorised access to the database._

- The users table includes credentials for an admin account (with a simple user id and default password still in place)

_In this scenario, the admin user appears to have the same level of access as any other user, but seeing admin credentials with a default (easily guessable) user id and password is still a red flag._

- Base64 encoded admin credentials are stored in the .admin-credentials file and benchmark.js

_These credentials are probably only used for testing against the test database, but storing credentials of any kind in plain text and in GitHub repositories is generally best avoided. Ambiguous rules around credential storage can lead to genuine (but harmful) mistakes being made by inexperienced team members._

- User Ids are sequential integers, so are easy to guess. This is particularly problematic when users have unrestricted access to any userid they happen to try.

_A simple fix would be to use UUIDs instead of integers for user IDs (as we have for the message IDs in the messages table)_

- Test database credentials are hardcoded in docker-compose (so also visible in the GitHub repo)
- Production database credentials are hardcoced in Dockerfile (so also visible in the GitHub repo)

_Internal system credentials should be stored securely (outside of the codebase) and injected into the app environment during deployment (probably out of scope for this task)_

## Code issues:

- The auth middleware is not hooked up for user routes, so no authentication is in place for retrieving user data or creating new users

_The auth middleware needs to be imported and hooked up in users handler, replicating how it's being used in the messages handler_

- There is no validation/sanitisation of the values being submitted to the API 

_This is particularly problematic where these values are being used directly in SQL queries, as it makes the API vulnerable to SQL injection attacks. It also means we're not handling normal bad requests nicely. All input values should be validated and sanitised as the first step in handling a request._

- SQL queries are defined in the route handlers directly

_This is a code smell, but may not be such an issue in Node apps. Personally, I would prefer these queries were moved in the db.ts file to separate the functional/business logic from the storage/database logic_

- The users 'search' endpoint is unreachable

_The search endpoint is currently blocked due to the positioning of the GET endpoint that accepts a parameter at the top of the users handler (the /search path is being interpreted as a parameter and routed to this catch-all function). To resolve this, the search endpoint should be moved above the parameterised GET so it's evaluated first._

- The users 'search' endpoint is non-functioning

_The asynchronous call to the database within the search function needs to be awaited, as it's currently completing before the database results are returned. It also needs to have the optional QueryTypes.SELECT value from the sequelize library set to stop it exposing the table structure in the response_

- The users 'search' endpoint is inefficient

_The search endpoint allows for unrestricted, fuzzy text searching against any field and value passed in. Aside from the potential performance issues this also allows users to retrieve the personal details of any other user._

- The messages GET endpoint is non-functioning

_The asynchronous call to the database within the search function needs to be awaited, as it's currently completing before the database results are returned. As above, it also needs to have the optional QueryTypes.SELECT value from the sequelize library set to stop it exposing the table structure in the response._

- The healthcheck always responds with a 200 

_If an app has critical dependencies then these should really be checked as part of a healthcheck. For example, this service isn't really ready to handle requests until it knows it can reach the database._

- An error-handler has been created and registered globally, but currently has no implementation. This is causing the app to immediately crash when an error is thrown.

_The obvious fix is to implement the global error handler, but there are also opportunities for issues to be caught and handled in multiple places in the code before the errors are allowed to bubble up to this level._

- Last but DEFINITELY not least, there are **no** tests in the solution. 

_If this were a real app, and I was genuinely planning to implement changes, the first step would be to wrap some tests around the existing functionality. This would allow me to ensure there were no regressions to the working behaviour, and give me a framework to build on when attempting to fix issues and add new behaviours._

## App behaviours

These are items they should be discussed with the (fictional) Product Owner - clarity is needed on the API use cases and desired behaviours

- Users can only retrieve messages they have *sent* - they cannot retrieve messages that other users have sent to them

- Message senders have to know the recipients user Id when creating a new message (should we allow usernames instead? I'm probably overthinking here....)

- As already mentioned, any user can currently retrieve personal details for another user

- Any user can currently retrieve any messages created by another user