# Supply Risk Frontend

React + Vite client for the supply-chain risk and route advisor app. It provides the user interface for analyzing shipment routes, viewing live risk assessments, managing saved routes, and editing profile information.

## Overview

The frontend includes:

- landing page and feature overview
- shipment analysis form
- risk and route visualization cards
- protected saved route pages
- profile editing and avatar controls
- login/signup flow for authenticated users

## Tech Stack

- React 18
- Vite
- React Router

## Prerequisites

- Node.js 18+
- backend API running at `http://localhost:8000`

## Install

```bash
npm install
```

## Run in Development

```bash
npm run dev
```

The app is served by Vite at:

```text
http://localhost:5173
```

The Vite config proxies `/api` requests to the backend:

```js
proxy: {
  '/api': 'http://localhost:8000',
}
```

## Production Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Main App Pages

- `/` — home page
- `/analyze` — analyze a shipment route
- `/login` — login and signup
- `/routes` — saved routes (protected)
- `/routes/:id` — route detail and risk trend (protected)
- `/profile` — account/profile management (protected)

## Environment Notes

This client does not require a custom `.env` file for normal local development. It expects the backend to be available on the local API host.

If you deploy behind a different backend URL, update the proxy or API client configuration accordingly.

## Project Structure

```text
frontend/
  src/
    components/
    pages/
    App.jsx
    api.js
    AuthContext.jsx
    main.jsx
    styles.css
  index.html
  vite.config.js
  package.json
```
