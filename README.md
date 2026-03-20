# Mechanic Mindset

Mechanic Mindset is a lightweight MERN-style study and diagnostic notes app for an automotive technician. It helps you learn automotive systems in a structured way and store real-world case notes from repairs.

## MVP features

- Create and browse structured study topics by category
- Edit existing study topics and move them to recently deleted
- Review each topic using five diagnostic study sections
- Manage study categories as real records instead of hardcoded values
- Create and browse personal diagnostic case notes
- Edit and permanently delete case notes
- Soft delete and restore topics and categories from a recently deleted view
- Create notebooks with chapter-based notes for longer study material
- Edit notebooks, remove chapter notes or images, and export as Markdown
- Attach chapter images through Cloudinary when configured
- Search topics and case notes quickly
- Use the app on desktop or mobile with a clean, lightweight interface

## Tech stack

- Client: React, Vite, React Router
- Server: Node.js, Express, Helmet, Mongoose
- Database: MongoDB
- Deployment target: Render-friendly split client/server structure

## Project structure

```text
AutoTechApp/
  client/
  server/
  package.json
  README.md
```

## Environment setup

Create the local environment files:

```powershell
Copy-Item .\server\.env.example .\server\.env
Copy-Item .\client\.env.example .\client\.env
```

Default server environment values:

```env
PORT=5000
NODE_ENV=development
USE_IN_MEMORY_DB=false
MONGODB_URI=your-mongodb-connection-string
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=mechanic-mindset/notebooks
```

Default client environment values:

```env
VITE_API_BASE_URL=
```

## Install dependencies

PowerShell on this machine blocks `npm` scripts through `npm.ps1`, so use `npm.cmd`:

```powershell
npm.cmd run install:all
```

If you are using Command Prompt, Git Bash, or a shell without that restriction, standard `npm` commands also work.

## Run locally

For the current local setup, [server/.env](C:/Users/ezaco/OneDrive/Desktop/AutoTechApp/server/.env) enables an in-memory MongoDB instance automatically, and [client/.env](C:/Users/ezaco/OneDrive/Desktop/AutoTechApp/client/.env) leaves the API base URL blank so Vite proxies `/api` requests without CORS issues:

```powershell
npm.cmd run dev
```

This starts:

- Client: `http://localhost:5173`
- Client: `http://127.0.0.1:5173`
- Server: `http://localhost:5000`
- Server: `http://127.0.0.1:5000`

## Seed sample data

If you later want to switch to a persistent local or hosted MongoDB database, set `USE_IN_MEMORY_DB=false` in [server/.env](C:/Users/ezaco/OneDrive/Desktop/AutoTechApp/server/.env) and point `MONGODB_URI` to your MongoDB instance.

If you want starter study topics and case notes in a persistent MongoDB database:

```powershell
npm.cmd run seed
```

When `USE_IN_MEMORY_DB=true`, sample data is loaded automatically when the server starts.

## Available scripts

- `npm.cmd run install:all` installs root, server, and client dependencies
- `npm.cmd run dev` runs client and server together
- `npm.cmd run dev:client` runs only the React app
- `npm.cmd run dev:server` runs only the Express API
- `npm.cmd run build` builds the client for production
- `npm.cmd run seed` loads sample MongoDB seed data
- `npm.cmd run start` starts the production server

## API routes

- `GET /api/health`
- `GET /api/categories`
- `POST /api/categories`
- `DELETE /api/categories/:id`
- `POST /api/categories/:id/restore`
- `GET /api/topics`
- `POST /api/topics`
- `GET /api/topics/:id`
- `PUT /api/topics/:id`
- `DELETE /api/topics/:id`
- `POST /api/topics/:id/restore`
- `GET /api/case-notes`
- `POST /api/case-notes`
- `GET /api/case-notes/:id`
- `PUT /api/case-notes/:id`
- `DELETE /api/case-notes/:id`
- `GET /api/notebooks`
- `POST /api/notebooks`
- `GET /api/notebooks/:id`
- `PUT /api/notebooks/:id`
- `DELETE /api/notebooks/:id`
- `GET /api/recently-deleted`
- `POST /api/uploads/cloudinary-signature`

## Notes

- Authentication is intentionally skipped for MVP to keep the app simple and personal-use focused.
- If you deploy the client as a static site later, make sure the host is configured for SPA route fallback to `index.html`.
- For Render, set `USE_IN_MEMORY_DB=false`, provide a real `MONGODB_URI`, and set `CORS_ALLOWED_ORIGINS` to the exact frontend URL or comma-separated list of allowed frontend URLs.

## Render deployment

The repository includes [render.yaml](C:/Users/ezaco/OneDrive/Desktop/AutoTechApp/render.yaml) for a two-service Render deployment:

- Backend web service: `mechanic-mindset-api`
- Frontend static site: `mechanic-mindset-web`

Expected default public URLs based on those service names:

- Frontend: `https://mechanic-mindset-web.onrender.com`
- Backend: `https://mechanic-mindset-api.onrender.com`

Recommended backend environment values on Render:

```env
NODE_ENV=production
USE_IN_MEMORY_DB=false
MONGODB_URI=your-production-mongodb-uri
CORS_ALLOWED_ORIGINS=https://mechanic-mindset-web.onrender.com
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_FOLDER=mechanic-mindset/notebooks
```

Recommended frontend environment values on Render:

```env
VITE_API_BASE_URL=https://mechanic-mindset-api.onrender.com
```

Render deployment flow:

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Create a new Render Blueprint or Web Service from that repository.
3. Use the included `render.yaml` at the repo root.
4. Add `MONGODB_URI` and the Cloudinary secrets in the Render dashboard.
5. After the first deploy, confirm the service URLs match the names above.
6. If Render assigns different URLs or you add custom domains later, update:
   `CORS_ALLOWED_ORIGINS` on the API service and `VITE_API_BASE_URL` on the static site.
7. Keep `USE_IN_MEMORY_DB=false` in production.

The frontend static site uses a rewrite route to send SPA paths to `index.html`, which is required for React Router on Render.
