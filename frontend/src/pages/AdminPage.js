import React, { useState } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'General',
    quantity: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tickets, setTickets] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('/api/tickets', formData);
      setTickets(response.data);
      setSuccess(true);
      setFormData({
        name: '',
        type: 'General',
        quantity: 1
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create tickets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Create Tickets</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Tickets created successfully!</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Attendee Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter attendee name"
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Ticket Type</Form.Label>
          <Form.Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="General">General</option>
            <option value="VIP">VIP</option>
            <option value="Premium">Premium</option>
          </Form.Select>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            max="10"
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Tickets'}
        </Button>
      </Form>
      
      {tickets.length > 0 && (
        <div className="mt-5">
          <h3>Created Tickets</h3>
          <Row>
            {tickets.map((ticket) => (
              <Col md={6} lg={4} key={ticket.ticketId}>
                <Card className="ticket-card">
                  <Card.Body>
                    <Card.Title>{ticket.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {ticket.type} Ticket
                    </Card.Subtitle>
                    <Card.Text>
                      Ticket ID: {ticket.ticketId}
                    </Card.Text>
                    <div className="ticket-actions">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        href={ticket.qrCodeUrl}
                        target="_blank"
                      >
                        View QR Code
                      </Button>
                      <Button 
                        variant="outline-success" 
                        size="sm"
                        href={ticket.pdfUrl}
                        target="_blank"
                      >
                        Download Ticket
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default AdminPage;