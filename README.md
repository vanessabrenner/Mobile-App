# 📚 Book Management App (Android & Ionic) with Koa Backend

This mobile application allows efficient book management on Android and Ionic, featuring JWT authentication, local storage, real-time notifications, and offline support. The backend uses a Koa server with a REST API and WebSocket for book management and data synchronization.

## 🚀 Key Features

### 📌 Mobile App (Android & Ionic)
- **Book List**: View, search, filter, paginate, and infinite scrolling.
- **Add/Edit Book**: Manage books through the UI.
- **JWT Authentication**: Secures user access and keeps the session active.
- **Local Storage**: Books are stored locally for offline access and synchronized upon reconnection.
- **Real-Time Notifications**: Automatic updates via WebSocket.
- **Additional Features**:
  - 📍 **GPS Location**: Books have associated locations via Google Maps.
  - 📸 **Camera Integration**: Users can add images for books.
  - 📂 **File Management**: Supports storing and accessing local files.
  - 🎨 **Animations**: Enhanced user experience with animations.

### 🔧 Backend (Koa API)
- **JWT Authentication**: Secure endpoints with JWT.
- **REST API for Book Management**:
  - **GET /book**: Retrieve all books.
  - **GET /book/:id**: Retrieve a book by ID.
  - **POST /book**: Create a new book.
  - **PUT /book/:id**: Update an existing book.
- **Database Storage**: All book data is stored in a database using DataStore.
- **Error Handling** and **Simulated Delays**: Mimics slow server responses for testing.

## 🛠️ Requirements

- **Backend**:
  - Node.js (>= v14.x)
  - npm (or yarn)
- **Mobile App**:
  - Android Studio (for Android)
  - Ionic CLI (for Ionic)
