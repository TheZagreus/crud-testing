const API_BASE = 'http://127.0.0.1:8000/api';

async function fetchRooms() {
    const res = await fetch(`${API_BASE}/rooms`);
    return await res.json();
}

async function fetchBookings() {
    const res = await fetch(`${API_BASE}/bookings`);
    return await res.json();
}

async function createBooking(data) {
    const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error creating booking');
    }
    return await res.json();
}

async function updateBooking(id, data) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error updating booking');
    }
    return await res.json();
}

async function deleteBooking(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw new Error('Error deleting booking');
    }
}

function generateCalendar(year, month) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const date = new Date(year, month, 1);
    const firstDay = date.getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    let row = document.createElement('tr');
    for (let i = 0; i < firstDay; i++) {
        row.appendChild(document.createElement('td'));
    }
    for (let date = 1; date <= lastDate; date++) {
        if (row.children.length === 7) {
            tbody.appendChild(row);
            row = document.createElement('tr');
        }
        const td = document.createElement('td');
        td.textContent = date;
        td.addEventListener('click', () => selectDate(`${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`, td));
        row.appendChild(td);
    }
    while (row.children.length < 7) {
        row.appendChild(document.createElement('td'));
    }
    tbody.appendChild(row);

    table.appendChild(thead);
    table.appendChild(tbody);
    calendar.appendChild(table);
}

function selectDate(date, td) {
    document.querySelectorAll('#calendar td').forEach(cell => cell.classList.remove('selected'));
    td.classList.add('selected');
    document.getElementById('date-input').value = date;
}

async function renderBookings() {
    const bookings = await fetchBookings();
    const ul = document.getElementById('bookings-ul');
    ul.innerHTML = '';
    bookings.forEach(booking => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="booking-info">
                ${booking.room.name} - ${booking.date} ${booking.start_time} - ${booking.end_time}
            </div>
            <div class="booking-actions">
                <button class="edit-btn" data-id="${booking.id}">Edit</button>
                <button class="delete-btn" data-id="${booking.id}">Delete</button>
            </div>
        `;
        ul.appendChild(li);
    });
}

document.getElementById('book-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const roomId = document.getElementById('room-select').value;
    const date = document.getElementById('date-input').value;
    const start = document.getElementById('start-time').value;
    const end = document.getElementById('end-time').value;
    const editId = document.getElementById('edit-id').value;
    try {
        if (editId) {
            await updateBooking(editId, {room_id: roomId, date, start_time: start, end_time: end});
            document.getElementById('edit-id').value = '';
            document.querySelector('button[type="submit"]').textContent = 'Book Room';
        } else {
            await createBooking({room_id: roomId, date, start_time: start, end_time: end});
        }
        renderBookings();
        this.reset();
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('bookings-ul').addEventListener('click', async function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        try {
            await deleteBooking(id);
            renderBookings();
        } catch (error) {
            alert(error.message);
        }
    } else if (e.target.classList.contains('edit-btn')) {
        const id = e.target.dataset.id;
        const bookings = await fetchBookings();
        const booking = bookings.find(b => b.id == id);
        if (booking) {
            document.getElementById('room-select').value = booking.room_id;
            document.getElementById('date-input').value = booking.date;
            document.getElementById('start-time').value = booking.start_time;
            document.getElementById('end-time').value = booking.end_time;
            document.getElementById('edit-id').value = id;
            document.querySelector('button[type="submit"]').textContent = 'Update Booking';
        }
    }
});

window.addEventListener('load', async () => {
    const rooms = await fetchRooms();
    const roomSelect = document.getElementById('room-select');
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = room.name;
        roomSelect.appendChild(option);
    });
    renderBookings();
    generateCalendar(new Date().getFullYear(), new Date().getMonth());
});
