import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import News from './Components/News';
import Activity from './Components/Activity';
import Cards from './Components/Cards';
import ContactForm from './Components/ContactForm';
import StaffForm from './Components/StaffForm';
import Downloads from './Components/Downloads';
import Footer from './Components/Footer/Footer';
import VisitorStats from './Components/Visitor/VisitorStats';
import SubmenuList from './Components/submenu/SubmenuList'; // Import SubmenuList

// Modal Component for Login
function LoginModal({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple authentication logic
    if (username === 'admin' && password === 'Password@1') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Username หรือ Password ไม่ถูกต้อง');
    }
  };

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ element, isAuthenticated }) {
  return isAuthenticated ? element : <Navigate to="/" />;
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
      <Routes>
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <LoginModal setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <SubmenuList />
            )
          }
        />
        <Route
          path="/ข่าวสาร"
          element={<ProtectedRoute element={<News />} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/กิจกรรม"
          element={<ProtectedRoute element={<Activity />} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/การ์ด"
          element={<ProtectedRoute element={<Cards />} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/เอกสารเผยแพร่"
          element={<ProtectedRoute element={<Downloads />} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/โครงสร้างบุคลากร"
          element={<ProtectedRoute element={<StaffForm />} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/ติดต่อ"
          element={<ProtectedRoute element={<ContactForm />} isAuthenticated={isAuthenticated} />}
        />
        {/* Add other routes here */}
      </Routes>
      {isAuthenticated && <VisitorStats />}
      <Footer />
    </Router>
  );
};

// Simple styles for the modal
const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};

export default App;
