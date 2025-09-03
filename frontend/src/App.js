import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import AdminPage from './pages/AdminPage';
import CheckinPage from './pages/CheckinPage';
import TicketListPage from './pages/TicketListPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">Event Ticketing System</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Admin</Nav.Link>
                <Nav.Link href="/tickets">Tickets</Nav.Link>
                <Nav.Link href="/checkin">Check-in</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<AdminPage />} />
            <Route path="/tickets" element={<TicketListPage />} />
            <Route path="/checkin" element={<CheckinPage />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;