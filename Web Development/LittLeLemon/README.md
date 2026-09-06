# Ravi Joshi's Projects Repository
Welcome to my personal GitHub repository! This is a collection of various projects I have worked on, ranging from small scripts to full projects.

## 🌟 About Me

I'm a developer with a background in data analytics, working across full-stack development, Python, SQL, data analysis, and machine learning. I enjoy learning across disciplines and turning ideas, data, and problems into practical solutions.


# LittleLemon — Restaurant Ordering & Management Platform

> A full-stack restaurant ordering platform with role-based access for customers, delivery staff, and managers — built with React and Django REST Framework.\
**Render Server might take upto 45 seconds to cold start please be patient**.\
[**Live Demo**](https://littlelemon-gules.vercel.app/) · [**Full Repo / Code**](https://github.com/ravijoshi276/Projects/tree/d000fe983921bee852da87af06e897c2bd3377df/Web%20Development/LittLeLemon) 

---

## Overview

LittleLemon is a full-stack web application that lets customers browse a menu and place orders, delivery personnel manage and update order handoffs, and managers oversee the restaurant's operations — all from a single login page, with each role seeing a different experience based on their permissions.

The goal was to model a real restaurant's workflow rather than just a CRUD demo: one login system, three distinct roles, and backend-enforced permissions so each user only ever sees and can do what their role allows.

<!-- SCREENSHOT: Add a screenshot or short GIF here of the customer-facing menu/ordering flow. This matters more than any paragraph of description — put it near the top. -->

## The Problem

Small and medium sized restaurants often juggle separate systems for taking orders online, coordinating delivery, and managing the menu/staff. This project explores what a single, role-aware system for all three could look like.

## Key Features

- **Single login, role-based experience** — one login page for Customers, Delivery Personnel, and Managers, with the correct dashboard and permissions applied automatically after authentication.
- **Customer flow** — Browse menu, Add to cart, place order, Track order status,Reserva Table,Check Reservation status.
- **Delivery flow** — View assigned orders, update delivery status, mark as delivered .
- **Manager / Admin panel** — Manage menu items, view orders, manage staff, Edit staff, Edit Menu, Edit Orders, Assign Delivery Crew.
- **Backend-enforced permissions** — role checks are handled in Django REST Framework (not just hidden in the frontend), so access control holds even if someone tries to hit the API directly. 

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, [state management — Context/UseState/etc.,routing and navigation - react-router-dom,image compression - browser-image-compression ], [styling — CSS/Tailwind/etc.] |
| Backend | Django, Django REST Framework , Django CORS Headers, Cloudinary, Django Cloudinary Storage  |
| Database | PostgreSQL |
| Auth |  Django REST Framework (DRF) token authentication  |
| Other | [Anymail[Brevo] ] |

## Architecture


The React frontend communicates with a Django REST Framework API over REST endpoints. On login, the backend authenticates the user and returns a token along with their role; the frontend uses the role to route the user to the correct dashboard (customer / delivery / manager). Permission classes on the DRF side re-check the role on every relevant request, so the API itself — not just the UI — enforces who can see or modify what.

The manager can assign and edit groups, update and add menu items, assign and update delivery details and orders. 

## What I'd Do Differently / What's Next

- "Moved image uploads to cloud storage instead of local disk for production readiness."
- "Storing a compressed version of image using browser-image-compression and storing it to Cloudinay. This will enhance user experience as the compressed version is light weight and will act as place holder till the actual image loads."
- Created a single login page  for all the users.
- Intergrated Anymail[Brevo] to recive upates on sign up, reservation and updates in reservation status.


## Running Locally

### Clone the repo and install pipenv
```bash
# Backend
pipenv sync #This syncs the virtual env
pipenv shell # Activate Virtual Enviornment

cd LittleLemon #Backend for the project
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
npm install
npm start

```

# Backend Setup

 ## 1\. Create the Environment File

 Navigate to the backend folder (`LittleLemon`) and create a `.env` file.

 The folder structure should look like:

```
LittleLemon/
├── .env
├── manage.py
├── ...
```

 ## 2\. Configure Environment Variables

 Add the following variables to the `.env` file:

```
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_HOST=127.0.0.1
DB_PORT=5432

DEBUG=True

BREVO_API_KEY=
DEFAULT_FROM_EMAIL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

 ## 3\. Environment Variables Description

 | Variable | Description |
| --- | --- |
| `DB_USERNAME` | PostgreSQL database username |
| `DB_PASSWORD` | PostgreSQL database password |
| `DB_NAME` | Name of the PostgreSQL database |
| `DB_HOST` | Database host. Defaults to `127.0.0.1` |
| `DB_PORT` | PostgreSQL port. Defaults to `5432` |
| `DEBUG` | Enables or disables Django debug mode |
| `BREVO_API_KEY` | API key used for Brevo email services |
| `DEFAULT_FROM_EMAIL` | Default email address used for sending emails |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

 ## 4\. Example Configuration

 Replace the empty values with your actual credentials:

```
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_HOST=127.0.0.1
DB_PORT=5432

DEBUG=True

BREVO_API_KEY=your_brevo_api_key
DEFAULT_FROM_EMAIL=your_email@example.com

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```







# Frontend Setup

 ## 1\. Create the Environment File

 Navigate to the frontend folder and create a `.env.dev` file.

 The folder structure should look like:

```
frontend/
├── .env.dev
├── package.json
├── src/
├── public/
└── ...
```

 ## 2\. Configure Environment Variables

 Add the following variable to the `.env.dev` file:

```
REACT_APP_API_URL=http://localhost:8000
```

 ## 3\. Environment Variable Description

 | Variable | Description |
| --- | --- |
| `REACT_APP_API_URL` | Base URL of the backend API |

 For local development, the backend API runs on:

```
http://localhost:8000
```

 Therefore, the frontend uses:

```
REACT_APP_API_URL=http://localhost:8000
```

 > **Note:** After creating or modifying the `.env.dev` file, restart the frontend development server for the changes to take effect.```



[Adjust the above to match your actual setup — add any env variables needed (e.g. `.env` for DB credentials or secret keys) and note them here so someone could actually run it.]

## Test Accounts *(Might take time as render server takes 30seconds to cold start)*

If you have seed/demo accounts for each role, list them here so anyone reviewing (recruiter, interviewer) can log in and see all three experiences without creating accounts themselves:

| Role | Username | Password |
|---|---|---|
| Customer |You can register yourself and try it |
| Delivery | testdeliverycrew|Testuser@98989 |
| Manager | testmanager| Adminuser@98989|
