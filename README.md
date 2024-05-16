# Files manager

## Overview
This project gives a hands-on experience with various technologies and concepts such as authentication, Node.js, MongoDB, Redis, pagination, and background processing. The project aims to build a simple platform for uploading and viewing files. It includes features for user authentication via tokens, listing files, uploading new files, changing file permissions, viewing files, and generating thumbnails for images. While similar services exist in real life, this project serves as a learning exercise to assemble and implement each component into a functional product.

## Introduction
The project consists of multiple tasks, each focusing on a specific aspect of back-end development. These tasks include creating utilities for Redis and MongoDB, setting up an Express server, implementing user authentication, managing file uploads, and handling file operations such as publishing, unpublishing, and retrieving file data.

## Technologies to be applied
- JavaScript (ES6)
- Node.js
- Express.js
- MongoDB
- Redis

## Learning Objectives

- Create an API with Express.js
- Implement user authentication
- Store data in MongoDB
- Manage temporary data in Redis
- Setup and utilize background workers

## Tasks

1. `Redis Utils:` Create utility functions for interacting with Redis.
2. `MongoDB Utils:` Implement utility functions for MongoDB operations.
3. `First API:` Set up an Express server and define initial endpoints.
4. `Create a New User:` Implement user creation functionality.
5. `Authenticate a User:` Implement user authentication and token generation.
6. `First File:` Enable file upload functionality.
7. Get and List Files: Implement endpoints for retrieving and listing files.
8. `File Publish/Unpublish:` Implement functionality for publishing and unpublishing files.
9. `File Data:` Retrieve file content based on file ID.

## Project Structure
The project is made of the following components:

* `utils/`: Contains utility files for interacting with Redis and MongoDB.
* `routes/`: Defines API endpoints for the project.
* `controllers/`: Contains controller logic for handling API requests.
* `server.js`: Express server setup file.
* `package.json`: npm package configuration file.

## Available end-points

1. `GET /status`: Retrieves the status of Redis and MongoDB.
2. `GET /stats`: Retrieves statistics such as the number of users and files in the database.
3. `POST /users`: Creates a new user in the database.
4. `GET /connect`: Signs in a user and generates an authentication token.
5. `GET /disconnect`: Signs out a user based on the token.
6. `GET /users/me`: Retrieves user information based on the token.
7. `POST /files`: Uploads a new file to the server.
8. `GET /files/:id`: Retrieves file information based on the file ID.
9. `GET /files`: Retrieves a list of files with pagination.
10. `PUT /files/:id/publish`: Publishes a file.
11. `PUT /files/:id/unpublis`: Unpublishes a file.
12. `GET /files/:id/data`: Retrieves the content of a file.

## Installation and Running the project
1. Clone the repository: `git clone <repository_url>`
2. Navigate to the project directory: `cd alx-files_manager`
3. Install dependencies: `npm install`

- In order to run the server:
    * `npm run start-server`