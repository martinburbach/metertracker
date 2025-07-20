#  मीटर ट्रैकर 📊

A comprehensive and user-friendly application for tracking and managing various types of utility meters, such as electricity, water, and gas. This application helps you monitor your consumption, visualize trends, and never miss a reading with its smart reminder system.

## ✨ Features

*   **Dashboard:** 📈 Get an at-a-glance view of all your meters, their latest readings, and consumption trends.
*   **Meter Management:** 🛠️ Add, edit, and manage an unlimited number of meters for different utilities like electricity, water, gas, and more.
*   **Reading History:** 📜 Keep a detailed log of all your meter readings with timestamps.
*   **Consumption Charts:** 💹 Visualize your consumption data with interactive charts to understand your usage patterns.
*   **User Management:** 👥 Supports multiple user accounts with a simple and secure login system.
*   **Customizable Categories:** 🎨 Create and customize meter categories with unique names, colors, and icons.
*   **Smart Reminders:** ⏰ Set up periodic reminders (daily, weekly, monthly, yearly) to ensure you never forget to record a meter reading.
*   **Activity Log:** 📝 A complete history of all actions performed within the application for accountability and tracking.
*   **Dark Mode:** 🌙 A sleek and eye-friendly dark mode for comfortable use in low-light environments.
*   **Multi-language Support:** 🌐 The application is internationalized and currently supports English and German.
*   **External API:** 🔌 An API is exposed on the `window` object for integration with other services or for advanced usage.

## 🚀 Technologies Used

*   **Frontend:** React, TypeScript
*   **Styling:** Tailwind CSS
*   **Charting:** Chart.js
*   **Internationalization:** i18next
*   **Build Tool:** Vite

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm installed on your machine.

### Installation

1.  Clone the repo:
    ```sh
    git clone https://github.com/your_username/vite-react-typescript-starter.git
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Run the development server:
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 🧑‍💻 Usage

1.  **Login:** The first time you run the application, a default user will be created. You can log in with the username "admin" and password "admin".
2.  **Dashboard:** After logging in, you'll see the dashboard where you can add your first meter.
3.  **Add a Meter:** Click on the "Add Meter" button, fill in the details, and save.
4.  **Add Readings:** Once a meter is created, you can add readings to it.
5.  **Settings:** In the settings page, you can manage users, set up reminders, and customize the application's appearance.

## 🤖 API

The application exposes a global API on the `window` object for advanced users and integrations.

### `window.MeterTrackerAPI`

This object provides a set of methods to interact with the application's data.

*   `getAllMeters()`: Returns an array of all meters.
*   `getMeterById(id: string)`: Returns a specific meter by its ID.
*   `getMeterByNumber(number: string)`: Returns a specific meter by its number.
*   `getCurrentReading(meterId: string)`: Returns the latest reading for a meter.
*   `getAverageDailyConsumption(meterId: string)`: Calculates the average daily consumption for a meter.
*   `getMeterSummary()`: Returns a summary of all meters.
*   `getVoiceResponse(query: string)`: A function to process natural language queries about meter data.

### `window.getMeterData(query: string)`

A simplified function to query meter data.

**Example Queries:**

*   `"all meters"`
*   `"summary"`
*   `"voice what is the reading for meter 12345"`
*   `"12345"` (to get data for a specific meter number)
