import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import axios from 'axios';

const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/api/tickets');
      setTickets(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading tickets...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-4">All Tickets</h2>
      
      {tickets.length === 0 ? (
        <p>No tickets found. Create some tickets first.</p>
      ) : (
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
                    <br />
                    Status: {' '}
                    <Badge bg={ticket.status === 'valid' ? 'success' : 'danger'}>
                      {ticket.status === 'valid' ? 'Valid' : 'Checked In'}
                    </Badge>
                  </Card.Text>
                  <div className="ticket-actions">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      href={`/api/tickets/${ticket.ticketId}/qr`}
                      target="_blank"
                    >
                      View QR Code
                    </Button>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      href={`/api/tickets/${ticket.ticketId}/pdf`}
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
      )}
    </div>
  );
};

export default TicketListPage;