# HUSUMS Deployment Guide

This guide covers deploying the HUSUMS application using:
- **Frontend**: Netlify
- **Backend**: Render (compatible alternative to Netlify for Node.js apps)
- **Database**: MongoDB Atlas

---

## ⚠️ Important Note on File Uploads
The current backend stores uploaded photos **locally** in an `/uploads` folder. 
- On free hosting tiers (like Render Free), the file system is **ephemeral**, meaning **uploaded photos will disappear** every time the server restarts or redeploys.
- For production, I recommend updating the code to use **Cloudinary** or **AWS S3** for storage.
- For now, this guide will deploy the app as-is, but be aware that user photos may vanish on server restarts.

---

## Step 1: Push Code to GitHub
Ensure all your latest changes (including the configuration files I just added) are pushed to GitHub.
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## Step 2: Database Setup (MongoDB Atlas)

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Cluster (Free Tier).
3. **Network Access**: Add IP Address `0.0.0.0/0` (allows access from anywhere/Render).
4. **Database Access**: Create a database user (e.g., `husums_admin` with a password).
5. **Connect**: Click "Connect" -> "Connect your application" -> Copy the Connection String.
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password.
   - Keep this string safe; this is your `MONGO_URI`.

---

## Step 3: Backend Deployment (Render)

We use Render because Netlify Functions are stateless and tricky for full Express apps.

1. Log in to [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Select the repository `HUSUMS`.
5. Configure the service:
   - **Name**: `husums-api` (or similar)
   - **Root Directory**: `server` (Important!)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Scroll down to **Environment Variables** and add:
   - `MONGO_URI`: (Paste your Atlas connection string from Step 2)
   - `JWT_SECRET`: (Create a strong random secret, e.g. `mysecretkey123`)
   - `NODE_ENV`: `production`
7. Click **Create Web Service**.
8. Wait for deployment. Once live, copy the **URL** (e.g., `https://husums-api.onrender.com`).

---

## Step 4: Frontend Deployment (Netlify)

1. Log in to [Netlify](https://www.netlify.com).
2. Click **Add new site** -> **Import from an existing project**.
3. select **GitHub**.
4. Pick your `HUSUMS` repository.
5. Configure settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **Deploy site**.
7. Once the deploy starts, go to **Site settings** -> **Environment variables**.
8. Add a variable:
   - Key: `VITE_API_URL`
   - Value: (Paste your backend URL from Render, e.g., `https://husums-api.onrender.com`)
   - **Important**: Do NOT add a trailing slash `/` at the end.
9. Go to **Deploys** and **Trigger deploy** to rebuild with the new variable.

---

## Step 5: Verify Deployment

1. Open your Netlify URL.
2. Try to log in.
3. Check if data loads from the backend.
4. **Troubleshooting**:
   - If login fails, check Render logs to see if the backend is connected to MongoDB.
   - If images break, remember the file upload limitation mentioned above.
