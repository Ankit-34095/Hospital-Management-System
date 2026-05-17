import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Topbar() {
  const role = localStorage.getItem('role') || 'PATIENT';
  const username = localStorage.getItem('username') || 'User';
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard Overview';
    if (path === '/patients') return 'Patient Management';
    if (path === '/doctors') return 'Doctor Directory';
    if (path === '/appointments') return 'Appointments Schedule';
    if (path === '/billing') return 'Billing & Invoices';
    if (path === '/records') return 'Medical Records';
    return 'Dashboard Overview';
  };

  return (
    <div className="topbar">
      <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
        <button className="icon-btn" style={{display: 'none'}} id="mobile-menu-btn">
          <Menu size={24} />
        </button>
        <div className="topbar-title">{getPageTitle()}</div>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: '30px'}}>
        <div className="topbar-search">
          <Search size={18} color="var(--text-light)" />
          <input type="text" placeholder="Search anything..." />
        </div>

        <div className="topbar-actions">
          <button className="icon-btn">
            <Bell size={20} />
          </button>
          
          <div className="profile-dropdown">
            <div className="avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <span className="profile-name">{username}</span>
              <span className="profile-role">{role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
