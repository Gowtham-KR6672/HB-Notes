# HB Notes

HB Notes is a production-oriented full-stack notes web application built with Next.js App Router, MongoDB, Mongoose, Cloudinary, JWT cookie authentication, Tailwind CSS, Zustand, and PWA support for installable offline-friendly usage.

## Features

- Email/password signup and login with bcrypt password hashing
- JWT session cookies with protected routes via middleware
- Create, edit, auto-save, search, pin, trash, restore, and permanently delete notes
- Markdown editor with live preview
- Tagging, pagination, and public share links
- File uploads to Cloudinary with drag-and-drop support and validation
- Responsive sidebar/editor workspace with dark and light themes
- `next-pwa` manifest and offline fallback page
- Secure headers, basic API rate limiting, and validation with Zod

## Stack

- Next.js 15 App Router
- React 19
- MongoDB Atlas with Mongoose
- Cloudinary for file storage
- Tailwind CSS
- Zustand
- Vercel deployment target

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_FROM=
EMAIL_PASS=
EMAIL_USER=
PORT=3000
VAPID_PRIVATE_KEY=
VAPID_PUBLIC_KEY=
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`.

## MongoDB Setup

1. Create a MongoDB Atlas cluster.
2. Add a database user and allow your local IP.
3. Copy the connection string into `MONGODB_URI`.

## Cloudinary Setup

1. Create a Cloudinary account.
2. Create an upload environment and copy the cloud name, API key, and API secret.
3. Put those values into the Cloudinary environment variables.

## Brevo Mail Setup

1. Create a Brevo SMTP sender and verified sender email.
2. Add `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_FROM` to your environment.
3. The current app stores these values for future mail workflows; no outgoing email flow is wired into the UI yet.

## Deployment to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the environment variables from `.env.example` in the Vercel project settings.
4. Set `NEXT_PUBLIC_APP_URL` to your production domain.
5. Deploy.

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/notes`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`
- `POST /api/upload`
- `GET /api/share/:shareId`

## Project Structure

```text
app/
  api/
  login/
  notes/
  share/
components/
  workspace/
lib/
  store/
models/
public/
types/
```

## Notes

- Offline support is aimed at cached application shells and locally persisted note lists in the browser for read access when disconnected.
- The included in-memory rate limiter is simple and works best as a baseline. For heavier production traffic, replace it with Upstash Redis or another distributed store.
- Export uses the browser print flow so users can save a note as PDF.
