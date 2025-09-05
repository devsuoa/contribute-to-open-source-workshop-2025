# DEVS Contest Platform

<p align="center">
  <img width="100" alt="devs-logo" src="frontend/public/devs-favicon.svg" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Node.js-23.x-green?logo=node.js&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
</p>

## 💻 About

## 🖼️ Images

## 🏗️ Architecture

## 🚀 Getting Started

### 1. 📦 Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or later (we use v23)
- **npm** (comes with Node.js)
- **Git**

Node.js can be installed [here](https://nodejs.org/en/download). Once downloaded, you can check your Node version with:

```bash
node -v
```

### 2. ⬇️ Clone the Repository

```bash
git clone <PROJECT_URL>
cd contest-platform
```

### 3. 🔐 Environment Variables

There are two `.env` files. One of them should be placed in the `frontend` folder, the other should be placed in the `backend` folder. Temporarily, the `.env` files have been placed [here](https://drive.google.com/drive/folders/1tHDZJMfA6SsEMivJBKn2lWmyk04RuCrI?usp=sharing). When downloaded from Google Drive, the `.` prefix may be removed, thus add it back on to make it a hidden file.

### 4. 📁 Install Dependencies

`npm install` in both the `frontend` and `backend` directory seperately:

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

### 4. 🚀 Start the App

`npm run dev` in both the `frontend` and `backend` directory seperately. In other words, run `npm run dev` for both the frontend and backend in separate terminal tabs:

```bash
cd frontend
npm run dev
```

```bash
cd backend
npm run dev
```

## 🗃️ Database Modifications

To make modifications to the data in the database "manually", there are two main ways. Firstly, there is a `init-db.ts` script in `backend/src/db`. If you run:

```bash
npm run init-db
```

This will clear the existing database and populate it with the values defined in the `init-db.ts` script.

For minor modifications, you can also edit the existing database through [MongoDB Compass](https://www.mongodb.com/try/download/compass), which is a GUI viewer/editor of the database. To link up the existing databse, you will want to:

1. Click on the plus button to add a new connection
2. Copy in the `MONGODB_CONNECTION_STRING` value from the backend `.env` file into the URI field.
3. Click Save & Connect

## 🎨 Linting and Formatting

Within the `frontend` and `backend` folder, you can run:

```bash
npm run format
```

Which will run the Prettier formatter on all the code within either `frontend` or `backend`. Similarly:

```bash
npm run lint
```

Can either fix or identify linting errors.

## © Attributions

## 👥 Contributors
