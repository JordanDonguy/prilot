# PRilot 🚀

## 📝 Overview

**PRilot** is an intelligent developer tool designed to **simplify and accelerate pull request workflows**.  
It can analyze commit differences between branches and assist in **automatically generating pull requests using AI** and **GitHub / GitLab integration**.  

**Currently in development**. The project already includes **GitHub integration** and **AI-powered pull request generation**.  
Upcoming features include sending pull requests directly to GitHub, two-way GitHub synchronization (webhooks), repository member invitations, and GitLab integration.  

---

## ✨ Key Features

- **AI-Powered Pull Requests**: Automatically generate pull requests based on commit differences between branches.  
- **GitHub & GitLab Integrations**: Connect your repositories and manage PRs seamlessly.  
- **User Authentication**: Sign in with credentials (currently functional) and GitHub / GitLab OAuth.  
- **Intuitive UI**: Modern interface built with TailwindCSS, designed for quick navigation and productivity.  
- **Team Collaboration**: Plan to support multiple members per repository for team workflows.  

---

## 🛠 Tech Stack

- **Frontend**: Next.js, TailwindCSS, Framer Motion, Lucide-React, Next-Themes   
- **Backend / API**: Next.js API Routes  
- **Database**: PostgreSQL, Prisma ORM  
- **Authentication**: JWT Based auth system
- **Containerization & DevOps**: Docker 

---

## 💻 Running Locally

1. Clone the repository:  
   ```bash
   git clone https://github.com/JordanDonguy/prilot.git
   cd prilot
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Replace the placeholder values with your own credentials, database URL, and API keys.

3. Start Docker services (if using Docker for PostgreSQL):

   ```bash
   docker compose up -d
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Set up the database:

   * Generate Prisma types :

     ```bash
     npx prisma generate
     ```

   * (Optional) Reset database if needed:

     ```bash
     npm run db:reset
     ```

   * Apply migrations:

     ```bash
     npm run db:migrate
     ```

   * Seed the database:

     ```bash
     npm run db:seed
     ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) to view the app.
