// API Base URL
const API_BASE = '/api';

// Global variables
let rooms = [];
let bookings = [];

// Fetch rooms and populate select
async function loadRooms() {
    try {
        const response = await fetch(`${API_BASE}/rooms`);
        rooms = await response.json();
        const select = document.getElementById('room-select');
        select.innerHTML = '<option value="">Choose a room</option>';
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = room.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
        alert('Failed to load rooms');
    }
}

// Fetch bookings and render list
async function loadBookings() {
    try {
        const response = await fetch(`${API_BASE}/bookings`);
        bookings = await response.json();
        renderBookings();
    } catch (error) {
        console.error('Error loading bookings:', error);
        alert('Failed to load bookings');
    }
}

// Render bookings in the list
function renderBookings() {
    const ul = document.getElementById('bookings-ul');
    ul.innerHTML = '';
    bookings.forEach(booking => {
        const room = rooms.find(r => r.id === booking.room_id);
        if (room) {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="booking-info">
                    ${room.name} - ${booking.date} from ${booking.start_time} to ${booking.end_time}
                </div>
                <div class="booking-actions">
                    <button class="edit-btn" data-id="${booking.id}">Edit</button>
                    <button class="delete-btn" data-id="${booking.id}">Delete</button>
                </div>
            `;
            ul.appendChild(li);
        }
    });
}

// Create or update booking
async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = document.getElementById('edit-id').value;
    const roomId = document.getElementById('room-select').value;
    const date = document.getElementById('date-input').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    if (!roomId || !date || !startTime || !endTime) {
        alert('Please fill all fields');
        return;
    }

    const bookingData = {
        room_id: parseInt(roomId),
        date,
        start_time: startTime,
        end_time: endTime
    };

    try {
        let response;
        if (id) {
            // Update
            response = await fetch(`${API_BASE}/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
        } else {
            // Create
            response = await fetch(`${API_BASE}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Booking failed');
        }

        // Reset form
        e.target.reset();
        document.getElementById('edit-id').value = '';
        document.querySelector('button[type="submit"]').textContent = 'Book Room';

        // Reload bookings
        await loadBookings();
    } catch (error) {
        alert(error.message);
    }
}

// Delete booking
async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
        const response = await fetch(`${API_BASE}/bookings/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Delete failed');
        }

        await loadBookings();
    } catch (error) {
        alert(error.message);
    }
}

// Edit booking
function handleEdit(id) {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        document.getElementById('room-select').value = booking.room_id;
        document.getElementById('date-input').value = booking.date;
        document.getElementById('start-time').value = booking.start_time;
        document.getElementById('end-time').value = booking.end_time;
        document.getElementById('edit-id').value = id;
        document.querySelector('button[type="submit"]').textContent = 'Update Booking';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    await loadRooms();
    await loadBookings();

    document.getElementById('book-form').addEventListener('submit', handleSubmit);

    document.getElementById('bookings-ul').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            handleDelete(e.target.dataset.id);
        } else if (e.target.classList.contains('edit-btn')) {
            handleEdit(e.target.dataset.id);
        }
    });
});

// Simple calendar (placeholder - can be enhanced with fullcalendar.js if needed)
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    if (!calendar) return;

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `<h3>${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3><div class="calendar-grid">`;
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        html += `<div class="calendar-day ${isToday ? 'today' : ''}" data-date="${date.toISOString().split('T')[0]}">${day}</div>`;
    }
    html += '</div>';
    calendar.innerHTML = html;

    // Add click handler for date selection
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.addEventListener('click', () => {
            // Remove selected class from all days
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            // Add selected class to clicked day
            day.classList.add('selected');
            // Set the date input
            document.getElementById('date-input').value = day.dataset.date;
        });
    });
}

generateCalendar();
