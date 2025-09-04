# Event Ticketing and Check-in System

A simple and efficient system for managing event tickets and checking in attendees. Built with Express.js, MongoDB, and a modern web interface.

## Features

### 🎫 Ticket Management
- **Create Tickets**: Generate multiple tickets with attendee information
- **4-Digit IDs**: Unique 4-digit ticket identifiers for easy reference
- **QR Codes**: Automatic QR code generation for each ticket
- **PDF Tickets**: Downloadable PDF tickets with all attendee details
- **Multiple Types**: Support for General, VIP, Premium, and Student tickets

### 👥 Attendee Information
- Attendee Name
- Attendee Number
- Email Address
- Ticket Type
- Ticket Quantity

### ✅ Check-in System
- **QR Code Scanning**: Scan tickets using mobile cameras
- **Manual Entry**: Enter 4-digit ticket IDs manually
- **Real-time Validation**: Instant ticket validation against database
- **Status Tracking**: Track checked-in vs. valid tickets
- **Duplicate Prevention**: Prevent multiple check-ins of the same ticket

### 🗄️ Data Storage
- **MongoDB Integration**: Primary database storage
- **Fallback Storage**: In-memory storage when MongoDB is unavailable
- **Ticket Status**: Track valid, checked-in, and invalid tickets

## Tech Stack

- **Backend**: Express.js
- **Database**: MongoDB (with in-memory fallback)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **QR Codes**: qrcode library
- **PDF Generation**: PDFKit
- **File Storage**: Local file system

## Installation

1. **Clone or download the project files**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Access the system**:
   Open your browser and go to `http://localhost:5001`

## Usage

### Admin Panel
1. **Navigate to the Admin Panel tab**
2. **Fill in attendee details**:
   - Attendee Name
   - Attendee Number
   - Email Address
   - Ticket Type (select from dropdown)
   - Quantity (1-10 tickets)
3. **Click "Generate Tickets"**
4. **View generated tickets** in the View Tickets tab

### Check-in Process
1. **Go to the Check-in tab**
2. **Scan QR Code** or **Enter 4-digit Ticket ID**
3. **Click "Check-in Ticket"**
4. **View results**:
   - ✅ Success: Ticket checked in
   - ⚠️ Warning: Already checked in
   - ❌ Error: Invalid ticket

### View All Tickets
1. **Navigate to the View Tickets tab**
2. **Click "Refresh Tickets"** to load current data
3. **View ticket details** including:
   - Ticket ID and Status
   - Attendee Information
   - Creation Date
   - QR Code and PDF download links

## API Endpoints

### Create Tickets
```
POST /api/tickets
Body: { name, attendeeNumber, email, type, quantity }
```

### Get All Tickets
```
GET /api/tickets
```

### Check-in Ticket
```
POST /api/tickets/:id/checkin
```

### Validate Ticket
```
GET /api/tickets/:id/validate
```

### Download QR Code
```
GET /api/tickets/:id/qr
```

### Download PDF Ticket
```
GET /api/tickets/:id/pdf
```

## File Structure

```
event-exp/
├── server.js          # Main Express server
├── index.html         # Web interface
├── package.json       # Dependencies
├── uploads/           # Generated files (QR codes, PDFs)
└── README.md          # This file
```

## Database Schema

```javascript
{
  ticketId: String,        // 4-digit unique ID
  name: String,            // Attendee name
  attendeeNumber: String,  // Attendee number
  email: String,           // Email address
  type: String,            // Ticket type
  status: String,          // 'valid' or 'checked-in'
  createdAt: Date          // Creation timestamp
}
```

## Features in Detail

### QR Code Generation
- Each ticket gets a unique QR code
- QR codes contain the 4-digit ticket ID
- Stored as PNG files in the uploads folder

### PDF Ticket Design
- Professional ticket layout
- Includes all attendee information
- Embedded QR code for easy scanning
- A4 format for easy printing

### Check-in Validation
- Real-time database lookup
- Prevents duplicate check-ins
- Clear status messages
- Mobile-friendly interface

### Responsive Design
- Works on desktop and mobile devices
- Modern, intuitive interface
- Tab-based navigation
- Loading states and error handling

## Troubleshooting

### MongoDB Connection Issues
- The system automatically falls back to in-memory storage
- Check your MongoDB connection string in server.js
- Ensure MongoDB service is running

### File Generation Issues
- Ensure the `uploads/` folder exists
- Check file permissions
- Verify all dependencies are installed

### Port Conflicts
- Change the PORT variable in server.js if needed
- Default port is 5001

## Security Features

- Input validation on all forms
- SQL injection prevention (MongoDB)
- File type restrictions
- Rate limiting considerations

## Future Enhancements

- User authentication and roles
- Event-specific configurations
- Bulk ticket import/export
- Advanced reporting and analytics
- Email notifications
- Mobile app integration

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is accessible (if using)
4. Check file permissions in the uploads folder

## License

This project is open source and available under the MIT License.


