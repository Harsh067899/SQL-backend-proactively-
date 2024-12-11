# Speaker Booking System

This repository hosts a **Speaker Booking System** application that allows users to:
1. Browse a list of speakers.
2. Book sessions with speakers based on available time slots.
3. Ensure time slot blocking for booked sessions.
4. Receive email notifications and Google Calendar invites upon successful bookings.

## Features
1. **Speaker Profile Listing**:
   - Users can view speaker profiles and their expertise.
   - Each speaker's hourly session price is displayed.

2. **Time Slot Management**:
   - Available time slots between 9 AM and 4 PM.
   - Slots are allocated in 1-hour intervals.
   - Prevent double bookings for time slots.

3. **Session Booking**:
   - Requires user authentication.
   - Select and book available time slots for a speaker.

4. **Notifications**:
   - Email notifications sent to both users and speakers upon booking.
   - Google Calendar event creation for scheduled sessions.

## Prerequisites

1. **Node.js** and **npm/yarn** installed.
2. **MySQL** database setup with required tables:
   - `speakers`
   - `time_slots`
   - `appointments`
3. Backend environment configured (e.g., `PORT`, `DB_URL`, etc.).

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/speaker-booking.git
   cd speaker-booking
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Database**:
   - Create required tables in the database. Here's a schema example:
     ```sql
     CREATE TABLE speakers (
         id INT AUTO_INCREMENT PRIMARY KEY,
         first_name VARCHAR(255),
         last_name VARCHAR(255),
         expertise VARCHAR(255),
         price_per_session DECIMAL(10, 2),
         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
     );

     CREATE TABLE time_slots (
         id INT AUTO_INCREMENT PRIMARY KEY,
         speaker_id INT,
         start_time DATETIME,
         end_time DATETIME,
         is_booked BOOLEAN DEFAULT FALSE,
         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
     );

     CREATE TABLE appointments (
         id INT AUTO_INCREMENT PRIMARY KEY,
         speaker_id INT,
         time_slot_id INT,
         user_id INT,
         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
     );
     ```
   - Configure `DB_URL` in `.env` file.

4. **Start the Server**:
   ```bash
   npm start
   ```

5. **Access Application**:
   - Frontend is served on `http://localhost:3000/`.
   - API routes are under `/api`.

---

## API Documentation

### Authentication
All protected routes require a Bearer token. Include it in the `Authorization` header:
```json
{
  "Authorization": "Bearer <token>"
}
```

### Endpoints

#### 1. **Fetch Speakers**
   - **GET** `/api/speakers`
   - Response:
     ```json
     [
       {
         "id": 1,
         "first_name": "John",
         "last_name": "Doe",
         "expertise": "AI and Machine Learning",
         "price_per_session": "100.00"
       }
     ]
     ```

#### 2. **Fetch Speaker's Time Slots**
   - **GET** `/api/speakers/:speakerId/time-slots`
   - Response:
     ```json
     [
       {
         "id": 1,
         "start_time": "2024-12-11T09:00:00Z",
         "end_time": "2024-12-11T10:00:00Z",
         "is_booked": false
       }
     ]
     ```

#### 3. **Book a Time Slot**
   - **POST** `/api/appointments`
   - Body:
     ```json
     {
       "speakerId": 1,
       "timeSlotId": 1
     }
     ```
   - Response:
     ```json
     {
       "status": "success",
       "message": "Session booked successfully!"
     }
     ```

#### 4. **Handle Booking Failure**
   - If the time slot is already booked:
     ```json
     {
       "status": "already_booked",
       "message": "This time slot has already been booked."
     }
     ```

---

## Frontend Overview

### Pages

1. **Speakers List (`/speakers.html`)**:
   - Displays a list of speakers and their expertise with options to book a session.

2. **Booking Page (`/booking.html`)**:
   - Displays available time slots for the selected speaker. Users can choose a slot and confirm the booking.

### Key Scripts

1. **Fetch and Display Speakers**:
   ```javascript
   async function fetchSpeakers() {
       const token = localStorage.getItem('token');
       const response = await fetch('/api/speakers', {
           headers: { 'Authorization': `Bearer ${token}` }
       });
       const data = await response.json();
       // Render speakers
   }
   ```

2. **Confirm Booking**:
   ```javascript
   function confirmBooking() {
       const timeSlotId = document.querySelector('input[name="timeSlot"]:checked')?.value;
       if (!timeSlotId) {
           alert('Please select a time slot');
           return;
       }
       
       const token = localStorage.getItem('token');
       fetch('http://localhost:3000/api/appointments', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
           },
           body: JSON.stringify({ speakerId, timeSlotId })
       }).then(response => response.json())
         .then(data => {
             alert(data.message);
             window.location.href = '/speakers.html';
         }).catch(err => {
             console.error('Error booking appointment:', err);
             alert('Booking failed. Please try again later.');
         });
   }
   ```

---

## Deployment

1. **Environment Variables**:
   - Setup `.env` with necessary variables:
     ```
     PORT=3000
     DB_URL=mysql://user:password@localhost:3306/speaker_booking
     ```

2. **Run in Production**:
   ```bash
   npm run build
   npm start
   ```

---

## Contribution
Contributions are welcome! Please fork the repository and submit a pull request.

---

## License
This project is licensed under the MIT License.

