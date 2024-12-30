# Overview

This is an API for a to-do list app. It is written in TypeScript and uses MongoDB as a database.

The API can create, update, and delete to-dos for different users. Pagination, filtering by dates, and sorting (in ascending or descending order and/or by multiple fields) are included.

Users can create accounts, log in to the app, update and delete their accounts.

User authorization is based on JWT and incorporates access and refresh tokens, refresh token rotation, refresh token reuse detection, and multiple device support.

The repository also includes route tests, written with Mocha and `node:assert`.

# Routes

All the POST requests must be sent with a JSON object as the body.

All the routes (GET, POST, and PUT) that return a non-empty response return a JSON object.

Only success status codes are described below. Other status codes are possible in case of errors. If a response only contains a status code, it will have the form of `{ message }`, where `message` is a formatted standard status message.

## Auth

`POST /auth/login`

- Logs the user in to the app
- Requires the following JSON object: `{ email, password }`
- Returns an access token as `{ token }` and a refresh token as an HTTP-only cookie

`GET /auth/refresh`

- Returns a new access token as `{ token }` and a new refresh token as an HTTP-only cookie

`POST /auth/logout`

- Logs the user out of the app
- Doesn't require a body. The POST method is used to prevent pre-fetching by browsers
- Returns an empty 204 response

## Users

`POST /user`

- Creates a user account
- Requires the following JSON object: `{ name, email, password }`
- Returns a 201 response as `{ message }`

`GET /user`

- Returns info about the current user as `{ name, email }`

`PUT /user/name`

- Updates the current user's name
- Requires the following JSON object: `{ name }`
- Returns a 200 response as `{ message }`

`PUT /user/email`

- Updates the current user's email
- Requires the following JSON object: `{ email, password }`
- Returns a 200 response as `{ message }`

`PUT /user/password`

- Updates the current user's password
- Requires the following JSON object: `{ password, new-password, confirmed-new-password }`
- Returns a 200 response as `{ message }`

`DELETE /user`

- Deletes the current user
- Requires the following JSON object: `{ password }`
- Returns an empty 204 response

## To-dos

All the to-do routes require a user to be logged in.

`POST /todo`

- Creates a to-do
- Requires the following JSON object: `{ title, description }`
- Returns the newly created to-do as `{ id, title, description, createdAt }`

`GET /todo?page=X&limit=X`

- Returns a list of the current user's to-dos
- Accepts the following query parameters:
  - `limit`: the number of to-dos per page, a **required** parameter
  - `page`: the page number, a **required** parameter
  - `sort`: the accepted values to sort by are "title," "createdAt," and/or "description," separated by a whitespace. The default order is ascending; put a minus sign before a value to sort the list in descending order. For example, `sort=createdAt -title` will sort the list first by `createdAt` in ascending order and then by `title` in descending order
  - `filter`: accepts a date in the format "yyyy-mm-dd" to get records after this date or "yyyy-mm-dd:yyyy-mm-dd" to get records between the dates

`PUT /todo/:id`

- Updates the to-do with the provided id
- Requires the following JSON object: `{ title, description }`
- Returns the updated to-do as `{ id, title, description }`

`DELETE /todo/:id`

- Deletes the to-do with the provided id
- Returns an empty 204 response
