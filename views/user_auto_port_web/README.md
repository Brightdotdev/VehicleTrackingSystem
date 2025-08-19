# 🚗 User View - Vehicle Tracking Application

The **User View** is the frontend application designed for drivers and regular users.
It allows them to view assigned vehicles, monitor their trips, and receive alerts through an intuitive interface.

---

## ✨ Features

### Vehicle Access

* View assigned vehicles or fleets
* Check current vehicle status (active, idle, maintenance)

### Trip Management

* Start and stop trips
* View personal trip history (duration, distance, routes taken)

### Real-Time Tracking

* Track the current location of assigned vehicles on an interactive map
* See live updates of movement, stops, and speed

### Alerts and Notifications

* Receive alerts for:

  * Unauthorized vehicle usage
  * Overspeeding warnings
  * Maintenance notifications

### Profile & Settings

* Manage personal details (name, email, contact)
---

## 🖥 Interface Overview

### Dashboard

* Summary of active trips and recent activities
* Quick view of assigned vehicles

### Map View

* Real-time vehicle tracking
* Indicators for moving, idle, and offline status

### Trips Section

* Table/list of all previous trips with filters and export options (in development)

### Alerts Section

* Notifications and alerts related to the user’s assigned vehicles

### Profile Section

* view user account details

---

## 🚀 How to Run

Follow these steps to run the **User View** application:

1. **Start the backend services**

   * Navigate to the **root folder** of the project.
   * Run the following command to start all required services with Docker:

     ```bash
     docker compose up
     ```
   * Ensure API, database, and related services are running.

2. **Install dependencies**
   Inside the `user-view` folder, install the required packages:

   ```bash
   npm install
   ```

3. **Build the application**
   Compile the frontend code:

   ```bash
   npm run build
   ```

4. **Start the application**
   Run the User View:

   ```bash
   npm run start
   ```

5. **Access the application**
   Open your browser and go to:

   ```
   http://localhost:3001
   ```

   > ⚠️ The User View may run on a different port than the Admin View (e.g., 3001 vs 3000).

---

## 🛠 Development Mode (for debugging)

For developers working on the User View with hot-reloading:

1. Ensure backend services are up:

   ```bash
   docker compose up
   ```

2. Start the app in **development mode**:

   ```bash
   npm run dev
   ```

3. Access it in your browser:

   ```
   http://localhost:3001
   ```

> ⚡ Changes to the code will automatically reflect in the browser.

