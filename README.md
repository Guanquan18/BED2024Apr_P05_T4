# SpearAcademy

SpearAcademy is a full-stack learning management platform for students and educators. Educators can publish structured video courses and quizzes, while students can discover learning content and take part in course discussions.

## What problem does it solve?

Learning content, assessments, and discussions are often split across multiple tools. SpearAcademy brings them together in one place so that educators can manage a course from a single dashboard and learners can move naturally from a lesson to a quiz or community conversation.

## Why we built it

SpearAcademy was built as a team project to explore how a collaborative education platform could support learners in Southeast Asia. It takes inspiration from course platforms such as Udemy and community platforms such as Reddit, combining self-paced learning with course-specific discussion.

## Main features

- Role-based student and educator experiences
- Account registration and login with password hashing and JWT authentication
- Educator profiles, qualifications, profile photos, and social links
- Course and section creation, editing, and deletion
- Course thumbnail and lesson video uploads
- Interactive quizzes with questions, answer options, explanations, results, and review
- Course Q&A and comment threads
- OTP-based password reset and account deletion emails
- Request validation and role-based API authorization
- Interactive Swagger API documentation

## Screenshots / GIF

> Project screenshots and a demo GIF are not currently included in the repository. Add them to `docs/screenshots/` and replace this note with images such as the student course catalogue, educator course editor, quiz results, and community page.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML5, CSS3, vanilla JavaScript, Bootstrap, Font Awesome |
| Backend | Node.js, Express.js |
| Database | Microsoft SQL Server (`mssql`) |
| Authentication | JSON Web Tokens (`jsonwebtoken`), bcrypt |
| Validation | Joi and custom Express middleware |
| File uploads | Multer |
| Email | Nodemailer with Mailtrap SMTP |
| API documentation | Swagger UI, swagger-autogen |
| Testing | Jest |

## Architecture

SpearAcademy uses a model-controller structure with a static frontend served by Express:

```text
Browser (HTML, CSS, JavaScript)
              │
              │ HTTP/JSON + Bearer token
              ▼
Express routes and middleware
  ├── JWT authorization
  ├── request validation
  └── Multer media uploads
              │
              ▼
Controllers → Models → Microsoft SQL Server
              │
              └── Nodemailer → Mailtrap SMTP
```

The Express application also serves the files in `public/`, so the frontend and API run from the same origin. Uploaded course thumbnails, profile photos, and lesson videos are stored locally under `public/Images/` and `public/videos/`.

## Run locally

### Prerequisites

- Node.js 18 or later and npm
- Microsoft SQL Server running on port `1433`
- A SQL Server login with permission to create and use a database
- A Mailtrap account if you want to test OTP emails

### 1. Clone the repository

```bash
git clone <repository-url>
cd BED2024Apr_P05_T4
```

### 2. Create and seed the database

Open SQL Server Management Studio, Azure Data Studio, or `sqlcmd`, then:

1. Create a database named `SpearAcademy_db`.
2. Select that database.
3. Run [`Table Creation.sql`](./Table%20Creation.sql).

The script creates the tables and adds sample accounts, courses, sections, quizzes, and community data.

### 3. Configure the database connection

Update `SpearAcademy_website/config/dbConfig.js` with your local SQL Server username, password, server, database name, and port.

### 4. Configure environment variables

Create `SpearAcademy_website/.env`:

```env
ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
YOUR_MAILTRAP_USERNAME=your-mailtrap-username
YOUR_MAILTRAP_PASSWORD=your-mailtrap-password
PORT=3000
```

Generate a suitable JWT secret with:

```bash
openssl rand -base64 48
```

The Mailtrap values are only required for password-reset and account-deletion OTP emails.

### 5. Install dependencies and start the app

```bash
cd SpearAcademy_website
npm install
node app.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Swagger API documentation is available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Tests

From `SpearAcademy_website/`, run:

```bash
npm test
```

The current test suite covers course and section model/controller behavior.

## Project structure

```text
SpearAcademy_website/
├── app.js              # Express application and routes
├── config/             # Database and email configuration
├── controllers/        # Request handling and application logic
├── middlewares/        # JWT authorization and validation
├── models/             # SQL Server data access
├── public/             # Student/educator pages and media
├── services/           # Temporary OTP token store
└── tests/              # Jest tests
```
