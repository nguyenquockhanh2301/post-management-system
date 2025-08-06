# Post Management System

A simple full-stack application for creating, viewing, editing, and deleting posts with image upload, built using:

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React + Vite + Tailwind CSS
- **Authentication**: JWT
- **File Uploads**: Multer

---

## 🚀 Features

- User registration & login with JWT authentication
- Create posts with:
  - Title, content, category
  - Thumbnail image upload (JPG/PNG, ≤ 2MB)
- View all posts with thumbnails
- View single post detail
- Edit & delete your own posts
- Protected routes for creating, editing, deleting posts
- Pagination, filtering, and sorting (backend support ready)
- Tailwind CSS UI with responsive design

---

## 📂 Project Structure

project-root/
│
├── app.js
├── server.js
├── routes/
├── models/
├── middleware/
├── uploads/ # Uploaded thumbnails
├── package.json
├── .env
│
├── post-manager-client/ # React frontend (Vite)
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── .env
│
└── README.md

## Backend Setup
- Install dependencies
cd backend
npm install

- Create .env file
PORT=8080
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=some_secret_key_here

- Run server
npm run dev

## Frontend Setup
- Install dependencies
cd post-manager-client
npm install

- Create .env file
VITE_API_URL=https://your-backend-domain.com

- Run development server
npm run dev

- Open http://localhost:5173 in your browser.

## Usage
# Register & Login
- Go to /register to create an account.
- Go to /login to sign in.
- On successful login, a JWT token is stored in localStorage and used for authenticated API requests.

# Manage Posts
- Create Post: Click "Create" in the navbar, fill in the form, and upload an image.
- View Post: Click a post card in the list to open its detail page.
- Edit Post: In the detail page, click "Edit" and update details.
- Delete Post: In the detail page, click "Delete" (only available if you are the author).

##  API Endpoints (Backend)
# Auth
- POST /auth/register → Register new user ({ username, password })
- POST /auth/login → Login ({ username, password })

# Posts
- GET /posts → List posts (public or protected based on implementation)
- GET /posts/:id → Get single post
- POST /posts → Create post (auth required, multipart form)
- PUT /posts/:id → Update post (auth required, multipart or JSON)
-   DELETE /posts/:id → Delete post (auth required)

##  Image Upload Notes
- Supported formats: .jpg, .jpeg, .png
- Max file size: 2 MB
- Files are stored in the uploads/ folder on the backend

## Deployment Notes
- Deploy backend (Express) to Railway, Render, or Heroku.
- Deploy frontend (Vite React) to Vercel or Netlify.
- Set correct API URL in post-manager-client/.env (VITE_API_URL).