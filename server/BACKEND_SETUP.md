# Markdown Notes App - Backend

This document contains everything needed to setup, run, and test the backend.

## 1. Backend Run Instructions

1. **Install Dependencies**:
   Open a terminal in the `server/` directory and run:
   ```bash
   npm install
   ```

2. **Database Setup**:
   Ensure MySQL is running on your machine. Execute the `schema.sql` script into your database client to create the database and tables.
   ```bash
   mysql -u root -p < schema.sql
   ```

3. **Environment Setup**:
   Create a `.env` file in the `server/` directory using the sample below.

4. **Start the Server**:
   Run the development server using nodemon:
   ```bash
   npm run dev
   ```
   *Note: if `npm run dev` is not configured, you can start it with `npx nodemon server.js` or `node server.js`*

---

## 2. Sample .env File
Place this in `server/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=markdown_notes_db
JWT_SECRET=super_secret_jwt_key_example
JWT_EXPIRES_IN=7d
```

---

## 3. SQL Table Creation Script
*(For convenience, this matches `schema.sql` in the directory)*

```sql
CREATE DATABASE IF NOT EXISTS markdown_notes_db;
USE markdown_notes_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS note_versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  note_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  UNIQUE KEY unique_user_tag (user_id, name),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS note_tags (
  note_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (note_id, tag_id),
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

---

## 4. Sample API Requests (REST)

You can use these endpoints via Postman, cURL, or VS Code REST Client. 
*Note: Ensure you extract the `<TOKEN>` from the login/signup response and place it in the `Authorization` header for protected routes.*

### Authentication

**Signup**
```http
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "securepassword123"
}
```

**Login**
```http
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "johndoe@example.com",
  "password": "securepassword123"
}
```

### Notes Management (Protected)

**Create Note**
```http
POST http://localhost:5000/api/v1/notes
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "My First Markdown Note",
  "content": "# Hello World\nThis is a markdown note.",
  "tags": [1, 2] 
}
```

**Update Note (Auto-creates Version if content changes)**
```http
PUT http://localhost:5000/api/v1/notes/1
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "My First Markdown Note (Updated)",
  "content": "# Hello World\nThis is the updated content.",
  "tags": [1]
}
```

**Fetch All Notes (With Search/Filter parameters)**
```http
GET http://localhost:5000/api/v1/notes?search=Hello&tagId=1
Authorization: Bearer <TOKEN>
```

**Fetch Single Note by ID**
```http
GET http://localhost:5000/api/v1/notes/1
Authorization: Bearer <TOKEN>
```

**Delete Note**
```http
DELETE http://localhost:5000/api/v1/notes/1
Authorization: Bearer <TOKEN>
```

**Get Note Version History**
```http
GET http://localhost:5000/api/v1/notes/1/versions
Authorization: Bearer <TOKEN>
```

### Tags Management (Protected)

**Create Tag**
```http
POST http://localhost:5000/api/v1/tags
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "work"
}
```

**Get All Tags**
```http
GET http://localhost:5000/api/v1/tags
Authorization: Bearer <TOKEN>
```
