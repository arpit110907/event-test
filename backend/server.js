const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB (with fallback to in-memory storage)
console.log('Attempting to connect to MongoDB...');
mongoose.connect('mongodb+srv://admin:jWWwR5EDvFN7srhT@admingavenue.wujpyea.mongodb.net/event-ticketing', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Reduce timeout for faster fallback
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Using in-memory storage instead');
});

// Ticket Schema
const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'valid' }, // valid or checked-in
  createdAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// In-memory fallback storage
let tickets = [];

// Routes
app.post('/api/tickets', async (req, res) => {
  try {
    const { name, type, quantity } = req.body;
    
    if (!name || !type || !quantity) {
      return res.status(400).json({ error: 'Name, type, and quantity are required' });
    }
    
    const createdTickets = [];
    
    for (let i = 0; i < quantity; i++) {
      const ticketId = uuidv4();
      const qrCodePath = path.join(__dirname, 'uploads', `${ticketId}.png`);
      const pdfPath = path.join(__dirname, 'uploads', `${ticketId}.pdf`);
      
      // Generate QR code
      await QRCode.toFile(qrCodePath, ticketId);
      
      // Create PDF ticket
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);
      
      // Add content to PDF
      doc.fontSize(25).text('Event Ticket', { align: 'center' });
      doc.moveDown();
      doc.fontSize(15).text(`Attendee: ${name}`);
      doc.fontSize(15).text(`Ticket Type: ${type}`);
      doc.fontSize(15).text(`Ticket ID: ${ticketId}`);
      doc.moveDown();
      doc.image(qrCodePath, {
        fit: [250, 250],
        align: 'center',
        valign: 'center'
      });
      
      doc.end();
      
      // Wait for PDF to be created
      await new Promise((resolve) => {
        writeStream.on('finish', resolve);
      });
      
      // Create ticket in database
      let ticket;
      try {
        ticket = new Ticket({
          ticketId,
          name,
          type,
          status: 'valid'
        });
        await ticket.save();
      } catch (err) {
        // Fallback to in-memory storage
        ticket = {
          ticketId,
          name,
          type,
          status: 'valid',
          createdAt: new Date()
        };
        tickets.push(ticket);
      }
      
      createdTickets.push({
        ...ticket._doc || ticket,
        qrCodeUrl: `/api/tickets/${ticketId}/qr`,
        pdfUrl: `/api/tickets/${ticketId}/pdf`
      });
    }
    
    res.status(201).json(createdTickets);
  } catch (error) {
    console.error('Error creating tickets:', error);
    res.status(500).json({ error: 'Failed to create tickets' });
  }
});

// Get all tickets
app.get('/api/tickets', async (req, res) => {
  try {
    let allTickets;
    try {
      allTickets = await Ticket.find();
    } catch (err) {
      // Fallback to in-memory storage
      allTickets = tickets;
    }
    
    res.json(allTickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get QR code
app.get('/api/tickets/:id/qr', (req, res) => {
  const { id } = req.params;
  const qrPath = path.join(__dirname, 'uploads', `${id}.png`);
  
  if (fs.existsSync(qrPath)) {
    res.sendFile(qrPath);
  } else {
    res.status(404).json({ error: 'QR code not found' });
  }
});

// Get PDF ticket
app.get('/api/tickets/:id/pdf', (req, res) => {
  const { id } = req.params;
  const pdfPath = path.join(__dirname, 'uploads', `${id}.pdf`);
  
  if (fs.existsSync(pdfPath)) {
    res.sendFile(pdfPath);
  } else {
    res.status(404).json({ error: 'PDF ticket not found' });
  }
});

// Check-in ticket
app.post('/api/tickets/:id/checkin', async (req, res) => {
  try {
    const { id } = req.params;
    
    let ticket;
    try {
      ticket = await Ticket.findOne({ ticketId: id });
      
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found', valid: false });
      }
      
      if (ticket.status === 'checked-in') {
        return res.status(400).json({ error: 'Ticket already checked in', valid: false, alreadyCheckedIn: true });
      }
      
      ticket.status = 'checked-in';
      await ticket.save();
    } catch (err) {
      // Fallback to in-memory storage
      ticket = tickets.find(t => t.ticketId === id);
      
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found', valid: false });
      }
      
      if (ticket.status === 'checked-in') {
        return res.status(400).json({ error: 'Ticket already checked in', valid: false, alreadyCheckedIn: true });
      }
      
      ticket.status = 'checked-in';
    }
    
    res.json({ message: 'Ticket checked in successfully', valid: true, ticket });
  } catch (error) {
    console.error('Error checking in ticket:', error);
    res.status(500).json({ error: 'Failed to check in ticket', valid: false });
  }
});

// Validate ticket without checking in
app.get('/api/tickets/:id/validate', async (req, res) => {
  try {
    const { id } = req.params;
    
    let ticket;
    try {
      ticket = await Ticket.findOne({ ticketId: id });
    } catch (err) {
      // Fallback to in-memory storage
      ticket = tickets.find(t => t.ticketId === id);
    }
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found', valid: false });
    }
    
    const isValid = ticket.status === 'valid';
    const isCheckedIn = ticket.status === 'checked-in';
    
    res.json({
      valid: isValid,
      alreadyCheckedIn: isCheckedIn,
      ticket
    });
  } catch (error) {
    console.error('Error validating ticket:', error);
    res.status(500).json({ error: 'Failed to validate ticket', valid: false });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});