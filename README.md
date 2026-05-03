# ⛽ Fleet Fuel Consumption Management

A locally-run web application for tracking and managing fuel consumption, mileage, and costs across a fleet of vehicles. Built with vanilla HTML, CSS, and JavaScript on the frontend, and a lightweight Python (Flask) backend that stores all data in a local JSON file — no cloud, no database server, no subscription required.

---

## Features

- **Vehicle Management** — Register vehicles with plate numbers, assigned drivers, and custom alert thresholds
- **Fuel Records** — Log every trip with auto-filled vehicle info, calculated distance, efficiency, and cost fields
- **Smart Alerts** — Form fields turn red when values exceed configured limits (trip distance, max gallons, MPG floor, cost ceiling)
- **Live Dashboard** — 4 interactive bar charts and 4 KPI cards, filterable by date range, plate, and driver
- **Reports** — Generate detailed reports by driver or vehicle for any date range, with summary totals and averages
- **Persistent Storage** — All data saved to `fleet_data.json` on your hard drive — survives browser clears, reinstalls, and restarts
- **Cross-platform** — Runs on Windows 11 and Debian/Linux with OS-specific launchers included

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Charts | [Chart.js](https://www.chartjs.org/) v4.4 (CDN) |
| Backend | Python 3, [Flask](https://flask.palletsprojects.com/) |
| Storage | JSON file (`fleet_data.json`) |
| Server | Flask development server (localhost) |

No frameworks. No npm. No build step. No database software.

---

## Project Structure

```
fleet-fuel-management/
 ├── index.html          # App UI — all screens and modals
 ├── app.js              # All frontend logic — forms, charts, fetch() calls
 ├── style.css           # Full stylesheet — navy blue industrial theme
 ├── server.py           # Flask server — serves app + reads/writes JSON
 ├── START_SERVER.bat    # Windows 11 launcher
 ├── start_server.sh     # Debian/Linux launcher
 ├── requirements.txt    # Python dependencies (Flask only)
 ├── LICENSE             # MIT
 └── README.md           # This file

# Auto-created on first run (not committed — see .gitignore):
 └── fleet_data.json     # Your local database
```

---

## Getting Started

### Prerequisites

- **Python 3.8+** — [python.org](https://www.python.org/downloads/)
- A modern browser (Chrome, Firefox, Edge)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/fleet-fuel-management.git
cd fleet-fuel-management
```

**2. Install Python dependencies**
```bash
pip install -r requirements.txt
```

### Running the App

#### Windows 11
Double-click `START_SERVER.bat`

The script will verify Python, install Flask if needed, and start the server automatically.

#### Debian / Linux
```bash
# Make the script executable (first time only)
chmod +x start_server.sh

# Start the server
./start_server.sh
```

#### Manual (any OS)
```bash
python server.py
# or
python3 server.py
```

**3. Open the app**

Navigate to [http://localhost:5000](http://localhost:5000) in your browser.

---

## How It Works

```
Browser (index.html + app.js)
        │
        │  fetch() — HTTP GET/POST
        ▼
Python Server (server.py / Flask)
        │
        │  read / write
        ▼
fleet_data.json (your hard drive)
```

When you save a record, `app.js` sends the data to `server.py` via `fetch()`. Flask receives it and writes it to `fleet_data.json`. When the app loads, it fetches everything back from that file. The browser is purely a display layer — all data lives on disk.

---

## Data Backup

Your entire database is a single human-readable file:

```
fleet_data.json
```

**To back up:** Copy this file anywhere — USB drive, cloud storage, email.

**To restore:** Replace `fleet_data.json` with your backup and restart the server.

**To migrate to another PC:** Copy the entire project folder (including `fleet_data.json`) and follow the setup steps on the new machine.

---

## Screenshots

> *(Add your own screenshots here after running the app)*

| Home | Records | Dashboard |
|---|---|---|
| ![home](screenshots/home.png) | ![records](screenshots/records.png) | ![dashboard](screenshots/dashboard.png) |

---

## Roadmap

- [ ] SQLite backend option for larger datasets
- [ ] Export records to CSV / Excel
- [ ] Print-friendly report PDF export
- [ ] Multi-user support with login
- [ ] Dark mode

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

[MIT](LICENSE)
