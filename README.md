# Course Selling App

A full-stack course marketplace with an Express, MongoDB, and JWT backend plus a React/Vite frontend.

## Features

- Student signup and signin
- Admin signup and signin
- Public course catalog
- Course purchase flow
- Student purchased-course library
- Admin course create and edit dashboard

## Setup

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
npm install --prefix client
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Update `.env` with your MongoDB connection string and JWT secrets.

## Run

Start the backend:

```bash
npm run dev
```

Start the React frontend in another terminal:

```bash
npm run client:dev
```

The backend runs on `http://localhost:3000`.
The frontend runs on the Vite URL printed in the terminal, usually `http://localhost:5173`.

## Build Frontend

```bash
npm run client:build
```

## API Notes

Protected routes accept JWTs through the `Authorization` header:

```txt
Authorization: Bearer <token>
```

For compatibility, the backend still accepts the old `token` header too.
