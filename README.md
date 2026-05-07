# HN Reader - MERN Stack Assignment

A production-quality MERN stack application that scrapes top stories from Hacker News, with JWT authentication and bookmark functionality.

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication (`jsonwebtoken`)
- bcryptjs (password hashing)
- axios + cheerio (web scraping)

**Frontend:**
- React 18 + React Router v6
- Context API (auth state)
- Tailwind CSS (modern SaaS dashboard style)
- Axios (HTTP client)

## Features

- 🔐 JWT-based authentication with session invalidation
- 📰 Scrapes top 10 HN stories on startup + via API
- 🔖 Bookmark/unbookmark stories
- 📄 Paginated story listing
- 🎨 Modern minimal SaaS UI (Indigo/Slate palette)
- 🛡️ Protected routes with auth middleware
- 🚪 Proper logout with token blacklisting

## Project Structure

```
mern-assignment/
├── server/
│   └── src/
│       ├── config/          # Database connection
│       ├── controllers/     # Request handlers
│       ├── middleware/      # Auth, error handling
│       ├── models/          # Mongoose schemas
│       ├── routes/          # API route definitions
│       ├── services/        # Business logic (scraper)
│       ├── utils/           # Helpers (AppError)
│       ├── app.js           # Express app setup
│       └── server.js        # Entry point
└── client/                 # React frontend (Vite)
    └── src/
        ├── components/      # Navbar, StoryCard, ProtectedRoute
        ├── context/         # AuthContext
        ├── pages/           # Login, Register, Stories, Bookmarks
        └── services/        # Axios instance
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm

### 1. Clone & Install

```bash
git clone <repo-url>
cd mern-assignment
npm install
cd client && npm install && cd ..
```

### 2. Environment Configuration

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hackernews
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

⚠️ **Never commit `.env`** - it's already in `.gitignore`.

### 3. Run Development Servers

```bash
# Starts both backend (5000) and frontend (5173)
npm run dev

# Or separately:
npm run server:dev   # Backend only
npm run client:dev   # Frontend only (from client/ dir)
```

### 4. Production Build

```bash
npm run build        # Builds frontend to client/dist
npm start            # Runs backend in production mode
```

## API Endpoints

### Authentication
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login and receive JWT |
| POST | `/api/auth/logout` | ✅ | Invalidate JWT (blacklist) |

### Stories
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/stories?page=1&limit=10` | ❌ | Paginated story list |
| GET | `/api/stories/:id` | ❌ | Single story details |
| POST | `/api/stories/:id/bookmark` | ✅ | Toggle bookmark |
| GET | `/api/stories/bookmarks` | ✅ | User's bookmarked stories |

### Scraper
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/scrape` | ❌ | Trigger manual scrape |

## API Request/Response Examples

### Register
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
  }
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "123456"
}

Response: Same as register
```

### Get Stories (Paginated)
```bash
GET /api/stories?page=1&limit=10

Response:
{
  "success": true,
  "data": {
    "stories": [...],
    "pagination": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
  }
}
```

## Key Design Decisions

### 1. Why separate `app.js` from `server.js`?
- Enables unit testing routes without starting HTTP server
- `app.js` = middleware/config, `server.js` = process lifecycle

### 2. Why `bulkWrite` with upsert in scraper?
- Idempotent - safe to run multiple times without creating duplicates
- `hackerNewsUrl` has unique index to prevent duplicate stories

### 3. Why Context API over Redux?
- Simple auth state doesn't need Redux boilerplate
- Context + `useReducer` can scale if needed later

### 4. JWT Blacklist for Logout?
- JWTs can't be "invalidated" by default
- Blacklisted tokens are stored with TTL = JWT expiry
- MongoDB TTL index auto-cleans expired tokens

### 5. Route Ordering in `storyRoutes.js`
- `/bookmarks` MUST come before `/:id` (Express matches top-to-bottom)
- Otherwise `/bookmarks` gets caught by the `/:id` route

## Interview Questions You May Face

1. **How does the scraper avoid duplicate stories?**
   - Unique MongoDB index on `hackerNewsUrl` + `bulkWrite` with `upsert: true`

2. **Why did you separate controllers from services?**
   - Controllers handle HTTP req/res, services handle business logic
   - Easier to test, swap implementations (e.g., use HN API instead of scraping)

3. **How does the JWT logout work?**
   - Token is added to `BlacklistedToken` collection with TTL = JWT expiry
   - Auth middleware checks blacklist before allowing access
   - Tokens auto-expire from DB after JWT expires

4. **What happens if `next()` is called multiple times?**
   - Express will throw an error - always ensure `return next()` or single path

5. **How do you handle MongoDB connection failures?**
   - `connectDB()` throws on failure, `server.js` catches and exits process
   - In production, you'd add retry logic with exponential backoff

## Common Issues & Fixes

### Issue: "Invalid ID format" on `/api/stories/bookmarks`
**Fix:** Route ordering - `/bookmarks` must be defined before `/:id` in Express router.

### Issue: `next is not a function` in User pre-save hook
**Fix:** For async Mongoose 5+ hooks, don't use `next` parameter. Just use `async function() { ... }` without calling `next()`.

### Issue: Duplicate API calls on logout
**Fix:** Clear auth state immediately, use `AbortController` to cancel pending requests.

## License

MIT

---

**Built with ❤️ for the MERN Stack Assignment**
