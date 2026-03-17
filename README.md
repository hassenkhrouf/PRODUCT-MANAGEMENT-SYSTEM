# Product Management System (CRUD)

A simple **Product Management System** built with **React** and **Firebase Realtime Database**. It supports creating, listing, searching, updating, and deleting products (including bulk delete and partial delete for multi-count items).

## Features

- **CRUD products**: create, update, delete
- **Bulk delete**: delete all products at once
- **Count-aware delete**: keep a chosen quantity or delete all
- **Search**: by title or by category
- **Auto total calculation**: price + taxes + ads − discount
- **Light/Dark mode** toggle

## Tech stack

- **React 18** (Create React App / `react-scripts`)
- **Firebase Realtime Database** (Firebase v9 modular SDK)
- **SweetAlert2** for dialogs
- **Bootstrap Icons**

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install & run

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Firebase setup

This app uses Firebase Realtime Database via `src/FirebaseCfg.js`.

- **Database**: Ensure Realtime Database is enabled in your Firebase project.
- **Rules**: For production, lock down rules and require authentication (do not leave the database public).

> Note: Firebase client config values are not “secret” by themselves, but your database rules determine whether data is protected. Treat rules and auth as the real security boundary.

## Project scripts

- **Start dev server**

```bash
npm start
```

- **Production build**

```bash
npm run build
```

The output is generated into `build/`.

- **Run tests**

```bash
npm test
```

## Deployment

Build and serve the static output:

```bash
npm run build
npx serve -s build
```

## License

MIT (or update this section to match your preferred license).
