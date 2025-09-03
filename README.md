# Event Ticketing and Check-in System

A simple web application for event ticket management and check-in.

## Features

- Create tickets for attendees with different ticket types
- Generate unique QR codes for each ticket
- Create downloadable PDF tickets
- Check-in system to validate tickets at the event
- Track ticket status (valid/checked-in)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm start
   ```

The backend server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

The frontend application will run on http://localhost:3000

## Usage

1. **Admin Page (/)**: Create new tickets by entering attendee name, ticket type, and quantity
2. **Tickets Page (/tickets)**: View all created tickets and their status
3. **Check-in Page (/checkin)**: Scan QR codes or manually enter ticket IDs to check in attendees

## Technologies Used

- **Frontend**: React, Bootstrap, HTML5-QR-Code
- **Backend**: Node.js, Express
- **Database**: MongoDB (with fallback to in-memory storage)
- **Libraries**: QRCode, PDFKit, UUID