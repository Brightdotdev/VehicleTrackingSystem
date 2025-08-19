# 🛠 Admin View - Vehicle Tracking Application

The Admin View is a crucial component of the Vehicle Tracking Application.
It allows administrators to manage vehicles, users, and monitor live vehicle locations through an intuitive dashboard.

## ✨ Features

### User Management

* View, edit, suspend, or delete user accounts
* Assign users specific vehicles or fleets

### Vehicle Management

* Add, update, or remove vehicles from the system
* View vehicle status (active, inactive, maintenance)

### Real-Time Tracking

* Monitor the live location of all registered vehicles on an interactive map
* View trip history and reports

### Reports and Analytics

* Generate reports on vehicle usage, trip durations, and user activity
* Export data in CSV/PDF formats

### Alerts and Notifications

* Receive alerts for:

  * Unauthorized vehicle movements
  * Speeding
  * Maintenance requirements

## 🖥 Interface Overview

### Dashboard

* Summary cards for:

  * Total vehicles
  * Active trips
  * User statistics
* Recent activity feed

### Map View

* Real-time GPS tracking of all vehicles
* Vehicle status indicators (e.g., moving, idle, offline)

### Users Section

* Table view of all users with filters and search options

### Vehicles Section

* Table view of all vehicles, including:

  * Status
  * Assigned driver
  * Last location update

### Reports Section

* Customizable reporting tool for analyzing operations

---

## 🚀 How to Run

Follow these steps to run the **Admin View** application:

1. **Start the backend services**

   * Navigate to the **root folder** of the project.
   * Run the following command to start all required services with Docker:

     ```bash
     docker compose up
     ```
   * Ensure all dependent services (e.g., API, database, message broker) are running successfully.

2. **Install dependencies**
   Inside the `admin-view` folder, install the required packages:

   ```bash
   npm install
   ```

3. **Build the application**
   Compile the frontend code:

   ```bash
   npm run build
   ```

4. **Start the application**
   Run the Admin View:

   ```bash
   npm run start
   ```

5. **Access the dashboard**
   Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

---

## 🛠 Development Mode (for debugging)

If you’re working on the application and want hot-reloading (automatic updates when you save changes):

1. Make sure backend services are already running via Docker:

   ```bash
   docker compose up
   ```

2. Start the Admin View in **development mode**:

   ```bash
   npm run dev
   ```

3. Open the dashboard in your browser:

   ```
   http://localhost:3000
   ```

> ⚡ In development mode, the app will automatically reload when you make code changes. This is useful for debugging and testing new features.

