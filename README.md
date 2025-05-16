# Todolist Web Application

This is a simple full-stack Todo application where a user can create, update, delete, and view todos. The frontend is built using React.js, the backend uses ASP.NET Core (C#), and data is stored in MongoDB Atlas (cloud database). JWT is used for login and token expires after 1 hour.

## Technologies Used

- React.js (Frontend)
- C# (.NET 6 Web API)
- MongoDB Atlas (Database)
- JWT Token for authentication

## Features

- User Registration and Login
- Add, Update, Delete todos
- Mark todo status (Pending, Ongoing, Done)
- Secure routes using JWT (expires in 1 hour)
- Data is stored in MongoDB Atlas

## Setup Instructions

### 1. Install Tools First

Make sure these are installed on your system:

- Node.js (https://nodejs.org)
- .NET SDK (https://dotnet.microsoft.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)

### 2. Clone the Project

```bash
git clone https://github.com/payel-18/todo-app.git
cd todo-app
```

### 3. Configure MongoDB Atlas

In the backend project, open the `appsettings.json` file and replace the MongoDB connection string like this:

```json
"TodoDatabaseSettings": {
  "ConnectionString": "your-mongodb-connection-url",
  "DatabaseName": "TodoDb",
  "TodoCollectionName": "Todos"
}
```

### 4. Run the Backend

Navigate to the backend folder and run the API:

```bash
cd backend
dotnet restore
dotnet run
```

The backend will run on:

- `http://localhost:5235` (default API URL)

Make sure it is running before testing frontend.

### 5. Run the Frontend

Now open another terminal and move to the frontend:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder and add:

```
REACT_APP_BACKEND_URL=http://localhost:5235/api
```

Then run the React app:

```bash
npm start
```

Your app will open in browser at:

```
http://localhost:3000
```

## JWT Token Authentication

- When user logs in, a JWT token is generated and stored in localStorage.
- This token is sent in headers (`Authorization`) for every API call.
- Token is valid for 1 hour, after that it expires and user needs to login again.
- If token is invalid or expired, backend will return unauthorized error.
