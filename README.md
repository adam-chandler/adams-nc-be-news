# Northcoders News Back End

This repository is a RESTful news API which will later be built a front end.

You can find the repository hosted [here](https://adams-be-nc-news.herokuapp.com/api/).

This will take you to a JSON of the current endpoints.

The database is run using PSQL and interaction is through [Knex](https://knexjs.org)

## Getting Started

### Prerequisites

- PostgreSQL

- Node

## Step 1 - Downloading the repository

In your terminal navigate to the desired location for this repository and run

```bash
git clone https://github.com/superchand/adams-nc-be-news.git

cd adams-nc-be-news
```

Open in your desired code editor and run

```bash
npm install
```

to install all the dependencies.

## Step 2 - Setup

Run:

```bash
npm run setup-dbs

npm run seed
```

## Step 3 - Run locally

Run:

```bash
npm start
```

Connect to localhost:9090 to view, this port can be changed within listen.js

## Routes

```http
GET /api/topics

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api
```
