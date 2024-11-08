import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Transaction from './pages/Transaction';
import Donation from './pages/Donation';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}> {/*  */}
        <Sidebar /> {/*  */}
        <div style={{ flex: 1, padding: '20px' }}> {/*  */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/donation" element={<Donation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Login />} /> {/* Log Out */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;