# ECHO

ECHO is a private, full-stack memory application for capturing personal moments and, over time, organizing them into a connected visual universe.

Phase 1 establishes the product foundation: secure authentication, image-backed memory management, a personal gallery, and an immersive Universe entry point. AI analysis and graph generation are planned for later phases and are not yet implemented.

## Core idea

Most photo libraries organize content by date or album. ECHO is designed to eventually organize memories by meaning—people, places, concepts, visual similarity, and relationships—while keeping each user's collection private.

## Current features

- Account registration, login, logout, session refresh, and current-user lookup
- JWT authentication with short-lived access and refresh tokens in HttpOnly cookies
- Protected client routes and owner-scoped API access
- Create memories with an image, title, description, date, and location
- Browse memories in a personal gallery
- View, edit, and delete individual memories
- Cloudinary-backed image upload and cleanup
- Dashboard for navigating the main experience
- Full-screen Universe placeholder ready for the future graph interface
- Responsive UI with animated transitions

## Architecture

```text
React client
    │  REST requests + HttpOnly cookies
    ▼
Express API
    ├── Authentication and authorization
    ├── Memory CRUD
    ├── MongoDB Atlas ── users and memory metadata
    └── Cloudinary ───── uploaded images
```

The client automatically attempts a token refresh after an expired authenticated request. Every memory operation is protected by authentication and scoped to the memory's owner.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Motion, React Router |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB Atlas, Mongoose |
| Media | Cloudinary, Multer |
| Authentication | JWT, HttpOnly cookies, bcrypt |

## Folder structure

```text
echo/
├── client/
│   ├── src/
│   │   ├── components/     # Shared UI and route protection
│   │   ├── context/        # Authentication state
│   │   ├── layouts/        # Authenticated application shell
│   │   ├── pages/          # Landing, auth, dashboard, memories, Universe
│   │   ├── services/       # API client and token-refresh handling
│   │   └── types/          # Shared frontend types
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/         # MongoDB and Cloudinary configuration
│   │   ├── controllers/    # Authentication and memory handlers
│   │   ├── middleware/     # Authentication and file upload middleware
│   │   ├── models/         # User and Memory models
│   │   ├── routes/         # REST API routes
│   │   ├── utils/          # Token utilities
│   │   └── server.ts       # API entry point
│   └── package.json
└── README.md
```

## Local setup

### Prerequisites

- Node.js and npm
- A MongoDB Atlas database
- A Cloudinary account

### 1. Clone the repository

```bash
git clone <repository-url>
cd echo
```

### 2. Configure and run the server

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5050
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_long_random_access_secret
JWT_REFRESH_SECRET=your_long_random_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the API:

```bash
npm run dev
```

### 3. Install and run the client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The client currently expects the API at `http://localhost:5050/api`, and the server allows credentials from the local Vite origin.

## API endpoints

### Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Sign in and set auth cookies |
| `POST` | `/api/auth/refresh` | Refresh the access token |
| `POST` | `/api/auth/logout` | Clear the session |
| `GET` | `/api/auth/me` | Return the authenticated user |

### Memories

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/memories` | List the user's memories |
| `GET` | `/api/memories/:id` | Get one memory |
| `POST` | `/api/memories` | Create a memory with an image upload |
| `PATCH` | `/api/memories/:id` | Update memory details |
| `DELETE` | `/api/memories/:id` | Delete a memory and its stored image |
| `GET` | `/api/health` | Check API availability |

Memory creation uses `multipart/form-data`; the image field is named `image`.

## Project status

**Phase 1 — Complete**

The core application flow is working end to end: authentication, protected navigation, media upload, memory CRUD, gallery browsing, memory detail management, the dashboard, and the Universe placeholder.

The `aiStatus` field exists in the memory model to support later processing, but no AI pipeline is active in Phase 1.

## Roadmap

### Phase 2 — Memory intelligence

- Extract useful metadata from images and memory text
- Generate image embeddings for semantic and visual similarity
- Calculate relationship scores between memories
- Cluster related memories into meaningful groups

### Phase 3 — Memory Universe

- Render memories and clusters as an interactive graph
- Explore relationships through zoom, focus, and navigation
- Surface meaningful connections without replacing the original memory timeline

## Security notes

- Access and refresh tokens are stored in HttpOnly cookies rather than browser storage.
- Passwords are hashed with bcrypt before persistence.
- Memory routes require authentication and enforce per-user ownership.
- Production cookies use the `Secure` flag.
- Secrets belong only in `server/.env`; `.env` files are excluded from version control.
- Use strong, separate JWT secrets and restrict CORS to the deployed client origin before production deployment.

## Vision

ECHO aims to turn a private collection of moments into a navigable map of personal context. The long-term goal is a calm, visual way to rediscover how memories connect—built on a secure and useful application first.
