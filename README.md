# Room Booking System

A modern web application for managing room bookings with time slots. Users can book one of 4 available rooms for specific dates and times, with automatic overlap prevention to ensure no double-bookings on the same day.

## Features

- **4 Rooms Available**: Room 1, Room 2, Room 3, Room 4
- **Calendar View**: Interactive calendar for date selection
- **Time-Based Bookings**: Specify start and end times for bookings
- **Overlap Prevention**: System prevents booking conflicts on the same date
- **CRUD Operations**: Create, read, update, and delete bookings
- **Modern UI**: Clean, responsive interface with teal theme
- **API Backend**: RESTful API built with Laravel
- **Frontend**: Vanilla JavaScript for dynamic interactions

## Technologies Used

- **Backend**: Laravel (PHP framework)
- **Database**: SQLite (for simplicity, can be changed to MySQL/PostgreSQL)
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Custom CSS with modern design

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TheZagreus/crud-testing.git
   cd crud-testing
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install PHP dependencies:
   ```bash
   composer install
   ```

4. Set up the database:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

5. Start the development server:
   ```bash
   php artisan serve
   ```

6. Open your browser and go to `http://localhost:8000`

## Usage

1. **View Calendar**: The main page displays an interactive calendar for the current month.
2. **Select Date**: Click on a date in the calendar to select it.
3. **Choose Room**: Select a room from the dropdown.
4. **Set Time**: Enter start and end times for your booking.
5. **Book**: Click "Book Room" to create the booking.
6. **Manage Bookings**: View all bookings in the list below. Use "Edit" to modify or "Delete" to remove.

## API Endpoints

- `GET /api/rooms` - Get all rooms
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/{id}` - Get a specific booking
- `PUT /api/bookings/{id}` - Update a booking
- `DELETE /api/bookings/{id}` - Delete a booking

## Project Structure

```
crud-testing/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── BookingController.php
│   │   │   └── RoomController.php
│   │   └── Models/
│   │       ├── Booking.php
│   │       └── Room.php
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── create_rooms_table.php
│   │   │   └── create_bookings_table.php
│   │   └── seeders/
│   │       ├── DatabaseSeeder.php
│   │       └── RoomSeeder.php
│   ├── public/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   └── composer.json
├── index.html
├── app.js
├── styles.css
├── package.json
└── README.md
```

## Troubleshooting

### 500 Server Error

If you encounter a 500 Internal Server Error when running the application, it is likely due to a missing or invalid application encryption key. Laravel requires this key for encryption and security.

**Solution:**

1. Ensure you have a `.env` file in the `backend` directory. If not, copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Generate a new application key:
   ```bash
   php artisan key:generate
   ```

3. Start the server again:
   ```bash
   php artisan serve
   ```

This should resolve the error. If the issue persists, check the Laravel logs in `storage/logs/laravel.log` for more details.

### Other Common Issues

- **Database Connection Error**: Ensure your database is set up correctly in the `.env` file and run `php artisan migrate` if needed.
- **Composer Dependencies**: Run `composer install` to install all required PHP packages.
- **Port Already in Use**: If `php artisan serve` fails, try specifying a different port: `php artisan serve --port=8001`.


## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Screenshots

<img width="1439" height="759" alt="Screenshot 2025-10-11 at 7 32 25 PM" src="https://github.com/user-attachments/assets/e28b0921-d252-4448-b402-91244770ff0c" />

## License

This project is open source and available under the [MIT License](LICENSE).
