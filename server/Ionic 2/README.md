# Koa API for Book Management with WebSocket and JWT Authentication

This project is a Koa-based server that provides a REST API for managing books and communicates in real-time using WebSocket. The server allows creating, reading, and updating books, and sends updates to connected WebSocket clients whenever a book is added or updated. Authentication is handled via JSON Web Tokens (JWT), and data is stored in a database using DataStore.

## Features
- **JWT Authentication**: Secure endpoints with JWT authentication.
- **REST API** for book management
  - **GET /book**: Retrieve all books
  - **GET /book/:id**: Retrieve a book by ID
  - **POST /book**: Create a new book
  - **PUT /book/:id**: Update an existing book
- **Error Handling** for unexpected situations.
- **Simulated Delay** to mimic slow server responses.
- **CORS Support** for cross-origin requests.
- **Database Storage**: All book data is stored in a database using DataStore.

## Requirements
- Node.js (>= v14.x)
- npm (or yarn)
