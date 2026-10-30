# Online Examination System

A responsive online examination dashboard based on the supplied design. Frontend: HTML, CSS and vanilla JavaScript. Backend: Node.js + Express. Demo data is stored in `data/store.json` and persists between restarts.

## Requirements
- Node.js 18 or newer
- npm

## Run locally
```bash
cd online-examination-system
npm install
npm start
```
Open **http://localhost:8086**.

## Features
- Dashboard with learning snapshot cards
- Available exam list and timed multiple-choice assessment
- Automatic scoring and result history
- Practice zone and subjects
- Editable student profile
- Responsive layout for desktop and mobile
- REST API with JSON-file persistence

## API endpoints
- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/profile`, `PUT /api/profile`
- `GET /api/subjects`
- `GET /api/exams`, `GET /api/exams/:id`
- `POST /api/exams/:id/submit`
- `GET /api/results`

## Demo account
The dashboard opens directly with a demo student (`Student`, `student@example.com`). Authentication is intentionally not included in this starter version; add a proper login system before production use.
