import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('patientId');
    localStorage.removeItem('doctorId');
    navigate('/login');
  }

  return (
    <div className="nav">
      <div>
        <Link to="/dashboard">HMS</Link>
      </div>
      <div>
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {role === 'ADMIN' && <Link to="/patients">Patients</Link>}
            {role === 'ADMIN' && <Link to="/doctors">Doctors</Link>}
            <Link to="/appointments">Appointments</Link>
            <Link to="/billing">Billing</Link>
            <button className="btn secondary" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
