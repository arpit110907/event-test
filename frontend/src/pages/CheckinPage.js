import React, { useState, useEffect } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const CheckinPage = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    // Import HTML5 QR Scanner dynamically
    const loadScanner = async () => {
      try {
        const Html5QrcodeScanner = (await import('html5-qrcode')).Html5QrcodeScanner;
        setScanner(new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 }));
      } catch (err) {
        console.error('Failed to load QR scanner:', err);
        setError('Failed to load QR scanner. Please try again.');
      }
    };
    
    loadScanner();
    
    return () => {
      // Clean up scanner on component unmount
      if (scanner) {
        try {
          scanner.clear();
        } catch (err) {
          console.error('Failed to clear scanner:', err);
        }
      }
    };
  }, [scanner]);

  const startScanner = () => {
    if (!scanner) return;
    
    setScanning(true);
    setScanResult(null);
    setError('');
    
    scanner.render(onScanSuccess, onScanError);
  };

  const stopScanner = () => {
    if (!scanner) return;
    
    try {
      scanner.clear();
      setScanning(false);
    } catch (err) {
      console.error('Failed to stop scanner:', err);
    }
  };

  const onScanSuccess = async (ticketId) => {
    try {
      stopScanner();
      
      // Validate the ticket
      const response = await axios.post(`/api/tickets/${ticketId}/checkin`);
      setScanResult({
        success: true,
        message: 'Ticket checked in successfully!',
        ticket: response.data.ticket
      });
    } catch (err) {
      const errorData = err.response?.data;
      
      if (errorData?.alreadyCheckedIn) {
        setScanResult({
          success: false,
          message: 'This ticket has already been checked in!',
          ticket: errorData.ticket
        });
      } else if (err.response?.status === 404) {
        setScanResult({
          success: false,
          message: 'Invalid ticket! Not found in the system.',
          ticket: null
        });
      } else {
        setScanResult({
          success: false,
          message: errorData?.error || 'Failed to validate ticket',
          ticket: null
        });
      }
    }
  };

  const onScanError = (err) => {
    console.error('QR Scan Error:', err);
    // We don't need to show this error to the user as it's usually just a failed scan attempt
  };

  const handleManualEntry = async (e) => {
    e.preventDefault();
    const ticketId = e.target.elements.ticketId.value.trim();
    
    if (!ticketId) {
      setError('Please enter a ticket ID');
      return;
    }
    
    try {
      setError('');
      setScanResult(null);
      
      // Validate the ticket
      const response = await axios.post(`/api/tickets/${ticketId}/checkin`);
      setScanResult({
        success: true,
        message: 'Ticket checked in successfully!',
        ticket: response.data.ticket
      });
    } catch (err) {
      const errorData = err.response?.data;
      
      if (errorData?.alreadyCheckedIn) {
        setScanResult({
          success: false,
          message: 'This ticket has already been checked in!',
          ticket: errorData.ticket
        });
      } else if (err.response?.status === 404) {
        setScanResult({
          success: false,
          message: 'Invalid ticket! Not found in the system.',
          ticket: null
        });
      } else {
        setScanResult({
          success: false,
          message: errorData?.error || 'Failed to validate ticket',
          ticket: null
        });
      }
    }
    
    e.target.reset();
  };

  return (
    <div>
      <h2 className="mb-4">Ticket Check-in</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {scanResult && (
        <Alert variant={scanResult.success ? 'success' : 'danger'}>
          {scanResult.message}
        </Alert>
      )}
      
      {scanResult && scanResult.ticket && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>{scanResult.ticket.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {scanResult.ticket.type} Ticket
            </Card.Subtitle>
            <Card.Text>
              Ticket ID: {scanResult.ticket.ticketId}
              <br />
              Status: <span className={scanResult.success ? 'ticket-status-checked-in' : 'ticket-status-valid'}>
                {scanResult.success ? 'Checked In' : 'Valid'}
              </span>
            </Card.Text>
          </Card.Body>
        </Card>
      )}
      
      {!scanning ? (
        <div className="mb-4">
          <Button variant="primary" onClick={startScanner} className="me-2">
            Scan QR Code
          </Button>
        </div>
      ) : (
        <div className="mb-4">
          <Button variant="secondary" onClick={stopScanner}>
            Stop Scanning
          </Button>
          <div id="reader" className="scanner-container mt-3"></div>
        </div>
      )}
      
      <div className="mt-4">
        <h4>Manual Check-in</h4>
        <form onSubmit={handleManualEntry}>
          <div className="input-group mb-3">
            <input
              type="text"
              name="ticketId"
              className="form-control"
              placeholder="Enter Ticket ID"
              required
            />
            <Button variant="outline-primary" type="submit">
              Check In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckinPage;