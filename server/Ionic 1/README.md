# Koa Book API with WebSocket

This project is a simple Koa-based server that provides a RESTful API for managing books and communicates in real-time using WebSocket. The server allows you to create, read, and update books. It also broadcasts updates to connected WebSocket clients whenever a new book is added or a book is updated.

## Features
- **RESTful API** for managing books
  - **GET /book**: Get a list of all books
  - **GET /book/:id**: Get a book by ID
  - **POST /book**: Create a new book
  - **PUT /book/:id**: Update an existing book
- **WebSocket integration** for real-time notifications
  - Clients are notified whenever a new book is created or an existing book is updated.
- **Error handling** for unexpected situations.
- **Simulated delays** to mimic slow server responses.
- **CORS support** for cross-origin requests.
- **Automatic generation of new books** every 5 seconds.

## Requirements
- Node.js (>= v14.x)
- npm (or yarn)
