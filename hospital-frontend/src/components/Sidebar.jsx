import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Calendar, CreditCard, LogOut, FileText } from 'lucide-react';

export default function Sidebar() {
  const role = localStorage.getItem('role') || 'PATIENT';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  ];

  if (role === 'ADMIN') {
    menuItems.push({ path: '/patients', name: 'Manage Patients', icon: <Users size={20} /> });
    menuItems.push({ path: '/doctors', name: 'Manage Doctors', icon: <Activity size={20} /> });
    menuItems.push({ path: '/appointments', name: 'Appointments', icon: <Calendar size={20} /> });
    menuItems.push({ path: '/billing', name: 'Billing & Reports', icon: <CreditCard size={20} /> });
  } else if (role === 'DOCTOR') {
    menuItems.push({ path: '/patients', name: 'My Patients', icon: <Users size={20} /> });
    menuItems.push({ path: '/appointments', name: 'Appointments', icon: <Calendar size={20} /> });
    menuItems.push({ path: '/records', name: 'Medical Records', icon: <FileText size={20} /> });
  } else if (role === 'PATIENT') {
    menuItems.push({ path: '/appointments', name: 'My Appointments', icon: <Calendar size={20} /> });
    menuItems.push({ path: '/records', name: 'Medical Records', icon: <FileText size={20} /> });
    menuItems.push({ path: '/billing', name: 'Bills & Payments', icon: <CreditCard size={20} /> });
  }

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Activity color="#0F52BA" size={28} />
        MedCare Plus
      </div>
      
      <div className="sidebar-nav">
        {menuItems.map((item, index) => (
          <NavLink 
            to={item.path} 
            key={index}
            className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-item" onClick={handleLogout} style={{color: 'var(--error)'}}>
          <LogOut size={20} />
          Logout
        </div>
      </div>
    </div>
  );
}
