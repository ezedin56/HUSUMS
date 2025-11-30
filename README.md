# HUSUMS - Haramaya University Student Union Management System

HUSUMS is a comprehensive web-based platform designed to streamline the operations of the Haramaya University Student Union. It facilitates efficient communication, transparent elections, and effective management of student affairs.

## 🚀 Features

### 1. **Role-Based Access Control**
*   **Public Vote Admin (`publicvote_admin`)**: Dedicated dashboard for managing public elections.
*   **President/VP**: Full administrative control over the union system, events, and announcements.
*   **Secretary**: Manage records, members, and attendance.
*   **Department Head**: Manage department-specific tasks and action plans.
*   **Member**: View events, vote in elections, and access resources.

### 2. **Dashboards**
*   **Main Dashboard**: For President, Secretary, Dept Heads, and Members.
*   **Admin Dashboard**: A separate, secure interface for the Public Vote Admin to manage elections without interference.

### 3. **Voting System**
*   **Secure Voting**: One-person-one-vote system.
*   **Real-time Results**: Live visualization of election results.
*   **Candidate Management**: Profiles with photos and manifestos.
*   **Election Management**: Create, open, close, and publish elections.

### 4. **Union Management**
*   **Events**: Create and manage union events.
*   **Announcements**: Broadcast messages to members.
*   **Resource Sharing**: Upload and share documents.
*   **Attendance Tracking**: QR code-based or manual attendance.

### 5. **Modern UI/UX**
*   **Glassmorphism Design**: Modern, translucent card effects.
*   **Responsive Layout**: Fully functional on desktop and mobile.
*   **Dark/Light Modes**: Themed interfaces (currently optimized for a dark/glass theme).

---

## 🛠️ Tech Stack

*   **Frontend**: React.js, Vite, Tailwind CSS (custom CSS), Lucide React Icons.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB.
*   **Authentication**: JWT (JSON Web Tokens).
*   **File Storage**: Multer (Local storage for images).

---

## 📦 Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/HUSUMS.git
    cd HUSUMS
    ```

2.  **Install Dependencies**
    *   **Root (Concurrent running)**:
        ```bash
        npm install
        ```
    *   **Server**:
        ```bash
        cd server
        npm install
        ```
    *   **Client**:
        ```bash
        cd client
        npm install
        ```

3.  **Environment Setup**
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

---

## 🏃‍♂️ Usage

### Running the Application
From the root directory, run:
```bash
npm run dev
```
This command starts both the backend server (port 5000) and the frontend client (port 5173).

### Default Credentials (for Testing)

| Role | Username (Student ID) | Password | Access |
| :--- | :--- | :--- | :--- |
| **Public Vote Admin** | `PVADMIN` | `123456` | `/admin` |
| **President** | `PRES001` | `123456` | `/dashboard` |
| **Member** | `MEM001` | `123456` | `/dashboard` |

---

## 📂 Project Structure

```
HUSUMS/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components (Footer, Navbar, etc.)
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Public Vote Admin pages
│   │   │   ├── auth/       # Login page
│   │   │   ├── dashboard/  # Main dashboard pages
│   │   │   └── public/     # Public landing pages
│   │   └── ...
│   └── ...
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   └── ...
│   └── ...
└── ...
```

---

## 🔒 Security

*   Passwords are hashed using `bcryptjs`.
*   API routes are protected using JWT middleware.
*   Role-based authorization ensures users only access allowed resources.

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

---

&copy; 2025 Haramaya University Student Union Management System
