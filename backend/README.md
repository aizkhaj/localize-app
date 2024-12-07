# Localize App Backend

This is the backend for the Localize App, built with Node.js and Express.js. The server runs on `localhost:8080`.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these steps to set up and run the backend server:

1. **Clone the repository:**
  ```sh
  git clone https://github.com/aizkhaj/localize-app.git
  cd localize-app/backend
  ```

2. **Install dependencies:**
  ```sh
  npm install
  ```

3. **Start the Docker container for our MongoDB instance:**
  ```sh
  docker-compose up -d
  ```

4. **Run the (dev) server:**
  ```sh
  npm run dev
  ```

The server should now be running on `http://localhost:8080` and it should confirm that MongoDB is connected (on console).
