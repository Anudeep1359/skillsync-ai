# SkillSync AI

SkillSync AI is a MERN-based web application that analyzes a user's current skills against a target job description and generates a personalized learning roadmap. The application helps users identify matched skills, missing skills, and career readiness for a selected role.

## Project Overview

Many students, graduates, and professionals struggle to understand how well their current skills match the requirements of a job description. Job postings often list several technical and professional skills, making it difficult to manually compare them with personal experience.

SkillSync AI solves this problem by allowing users to paste a job description, enter their current skills, and receive an automated skill gap analysis. The system calculates a readiness score, identifies missing skills, and recommends learning steps for improvement.

## Features

- Skill gap analysis based on job descriptions
- Readiness score calculation
- Required skills extraction
- Matched skills display
- Missing skills display
- Personalized learning roadmap
- MongoDB-based analysis history
- Clear history functionality
- Demo data loader for quick testing
- Responsive React user interface

## Technology Stack

### Frontend
- ReactJS
- Vite
- CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB Atlas
- Mongoose

### Architecture
- MERN stack
- Client-server architecture
- RESTful API communication

## Course Information

This project was developed for:

**Course:** CIS 602-1 Web Software Development  
**Project:** Semester Web Application Project  
**Application Name:** SkillSync AI

## Application Workflow

1. User enters a target job role.
2. User enters their current skills.
3. User pastes a job description.
4. The backend extracts required skills from the job description.
5. The system compares required skills with user skills.
6. The application displays:
   - Readiness score
   - Required skills
   - Matched skills
   - Missing skills
   - Personalized learning roadmap
7. The analysis result is saved to MongoDB.
8. Recent analysis history is displayed in the application.

## Folder Structure

```txt
skillsync-ai/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── index.html
│
├── .gitignore
└── README.md