let selectedDate = null;
let selectedRoom = null;
let selectedSlot = null;

// Data storage
let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

function saveBookings() {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

// Availability check
function isAvailable(roomId, date, start, end) {
    return !bookings.some(b => b.roomId === roomId && b.date === date && !(end <= b.start || start >= b.end));
}

// CRUD functions
function createBooking(roomId, date, start, end) {
    if (!isAvailable(roomId, date, start, end)) throw new Error('Room not available at this time');
    const id = Date.now().toString();
    bookings.push({ id, roomId, date, start, end });
    saveBookings();
    return id;
}

function getBookings() {
    return bookings;
}

function updateBooking(id, roomId, date, start, end) {
    const b = bookings.find(b => b.id === id);
    if (!b) throw new Error('Booking not found');
    if (roomId !== b.roomId || date !== b.date || start !== b.start || end !== b.end) {
        if (!isAvailable(roomId, date, start, end)) throw new Error('Room not available at this time');
    }
    b.roomId = roomId;
    b.date = date;
    b.start = start;
    b.end = end;
    saveBookings();
}

function deleteBooking(id) {
    const i = bookings.findIndex(b => b.id === id);
    if (i === -1) throw new Error('Booking not found');
    bookings.splice(i, 1);
    saveBookings();
}

// Rooms
const rooms = [
    { id: '1', name: 'Room 1' },
    { id: '2', name: 'Room 2' },
    { id: '3', name: 'Room 3' },
    { id: '4', name: 'Room 4' }
];

// Calendar rendering
function generateCalendar(year, month) {
    const date = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = date.getDay();
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    let row = document.createElement('tr');
    for (let i = 0; i < firstDay; i++) {
        const td = document.createElement('td');
        row.appendChild(td);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        if (row.children.length === 7) {
            tbody.appendChild(row);
            row = document.createElement('tr');
        }
        const td = document.createElement('td');
        td.textContent = day;
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasBooking = bookings.some(b => b.date === fullDate);
        if (hasBooking) td.classList.add('booked');
        td.addEventListener('click', () => selectDate(fullDate, td));
        row.appendChild(td);
    }
    tbody.appendChild(row);
    table.appendChild(tbody);
    return table;
}

function selectDate(date, td) {
    selectedDate = date;
    document.querySelectorAll('#calendar td').forEach(cell => cell.classList.remove('selected'));
    td.classList.add('selected');
    renderTimeSlots();
}

// Time slots rendering
const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'
];

function renderTimeSlots() {
    if (!selectedDate || !selectedRoom) {
        document.getElementById('time-slots').style.display = 'none';
        document.getElementById('book-btn').style.display = 'none';
        return;
    }
    document.getElementById('time-slots').style.display = 'block';
    const ul = document.getElementById('slots-ul');
    ul.innerHTML = '';
    timeSlots.forEach(slot => {
        const [start, end] = slot.split('-');
        const li = document.createElement('li');
        li.textContent = slot;
        const isBooked = bookings.some(b => b.roomId === selectedRoom && b.date === selectedDate && b.start === start && b.end === end);
        if (isBooked) li.classList.add('booked');
        else li.addEventListener('click', () => selectSlot(slot, li));
        ul.appendChild(li);
    });
}

function selectSlot(slot, li) {
    selectedSlot = slot;
    document.querySelectorAll('#slots-ul li').forEach(s => s.classList.remove('selected'));
    li.classList.add('selected');
    document.getElementById('book-btn').style.display = 'block';
}

// Booking function
document.getElementById('book-btn').addEventListener('click', () => {
    if (!selectedRoom || !selectedDate || !selectedSlot) return;
    const [start, end] = selectedSlot.split('-');
    try {
        createBooking(selectedRoom, selectedDate, start, end);
        renderTimeSlots();
        renderBookings();
        selectedSlot = null;
        document.getElementById('book-btn').style.display = 'none';
    } catch (error) {
        alert(error.message);
    }
});

// Room selection
document.getElementById('room-select').addEventListener('change', (e) => {
    selectedRoom = e.target.value;
    renderTimeSlots();
});

// Render bookings
function renderBookings() {
    const ul = document.getElementById('bookings-ul');
    ul.innerHTML = '';
    getBookings().forEach(b => {
        const li = document.createElement('li');
        const room = rooms.find(r => r.id === b.roomId);
        const roomName = room ? room.name : 'Unknown Room';
        li.innerHTML = `
            <div class="booking-info">${roomName} - ${b.date} ${b.start} to ${b.end}</div>
            <div class="booking-actions">
                <button class="edit-btn" data-id="${b.id}">Edit</button>
                <button class="delete-btn" data-id="${b.id}">Delete</button>
            </div>
        `;
        ul.appendChild(li);
    });
    // Re-render calendar to update booked dates
    const now = new Date();
    document.getElementById('calendar').innerHTML = '';
    document.getElementById('calendar').appendChild(generateCalendar(now.getFullYear(), now.getMonth()));
}

// Edit/Delete handlers
document.getElementById('bookings-ul').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        try {
            deleteBooking(e.target.dataset.id);
            renderBookings();
        } catch (error) {
            alert(error.message);
        }
    } else if (e.target.classList.contains('edit-btn')) {
        const b = bookings.find(b => b.id === e.target.dataset.id);
        if (b) {
            // For simplicity, alert or redirect to form; in full app, populate form
            alert(`Edit booking: ${b.date} ${b.start}-${b.end} for ${rooms.find(r => r.id === b.roomId)?.name}`);
            // Implement full edit by populating selectors and calling update
        }
    }
});

// Initial render
window.addEventListener('load', () => {
    const now = new Date();
    document.getElementById('calendar').appendChild(generateCalendar(now.getFullYear(), now.getMonth()));
    renderBookings();
});
