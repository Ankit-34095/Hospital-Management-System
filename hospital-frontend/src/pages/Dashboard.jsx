import React, { useEffect, useState } from 'react';
import { Users, Activity, Calendar, DollarSign, Clock, FileText, CheckCircle, Plus } from 'lucide-react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Dashboard() {
  const role = localStorage.getItem('role') || 'ADMIN';
  const username = localStorage.getItem('username') || 'User';

  const patientId = localStorage.getItem('patientId');
  const doctorId = localStorage.getItem('doctorId');
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, revenue: 0, myId: '' });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const calls = [
          api.get('/api/patients').catch(() => ({data: []})),
          api.get('/api/doctors').catch(() => ({data: []})),
        ];

        if (role === 'PATIENT' && patientId) {
          calls.push(api.get(`/api/appointments/by-patient/${patientId}`).catch(() => ({data: []})));
        } else if (role === 'DOCTOR' && doctorId) {
          calls.push(api.get(`/api/appointments/by-doctor/${doctorId}`).catch(() => ({data: []})));
        } else {
          calls.push(api.get('/api/appointments').catch(() => ({data: []})));
        }

        const [patRes, docRes, apptRes] = await Promise.all(calls);
        
        const patients = patRes.data || [];
        const doctors = docRes.data || [];
        const appointments = apptRes.data || [];
        
        let myId = '';
        if (role === 'PATIENT') myId = patientId || '—';
        if (role === 'DOCTOR') myId = doctorId || '—';

        setStats({
          patients: patients.length,
          doctors: doctors.length,
          appointments: appointments.length,
          revenue: appointments.length * 700,
          myId
        });
        
        setRecentAppointments(appointments.slice(0, 3));

        const monthly = {};
        appointments.forEach(a => {
          if (a.date) {
            const d = new Date(a.date + 'T00:00:00');
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            monthly[key] = (monthly[key] || 0) + 700;
          }
        });
        setMonthlyRevenue(Object.entries(monthly).map(([name, revenue]) => ({ name, revenue })));
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      }
    }
    loadStats();
  }, [role, patientId, doctorId]);

  const AdminDashboard = () => (
    <>
      <div className="dash-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Users /></div>
          <div className="stat-info">
            <h4>Total Patients</h4>
            <h2>{stats.patients}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Activity /></div>
          <div className="stat-info">
            <h4>Total Doctors</h4>
            <h2>{stats.doctors}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Calendar /></div>
          <div className="stat-info">
            <h4>Total Appointments</h4>
            <h2>{stats.appointments}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><DollarSign /></div>
          <div className="stat-info">
            <h4>Total Revenue</h4>
            <h2>₹{stats.revenue}</h2>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Revenue Analytics (Monthly)</h3>
          </div>
          <div style={{height: '300px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue.length > 0 ? monthlyRevenue : [{ name: 'No Data', revenue: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-light)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-light)', fontSize: 12}} dx={-10} />
                <Tooltip cursor={{fill: 'var(--accent)'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Appointments</h3>
        </div>
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr><td colSpan="3" style={{textAlign: 'center', color: 'var(--text-light)'}}>No appointments found.</td></tr>
              ) : recentAppointments.map(a => (
                <tr key={a.id}>
                  <td>{a.patient?.name || a.patientId}</td>
                  <td>{a.doctor?.name || a.doctorId}</td>
                  <td>{a.date} {a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const DoctorDashboard = () => (
    <>
      <div className="dash-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Calendar /></div>
          <div className="stat-info">
            <h4>Total Appointments</h4>
            <h2>{stats.appointments}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Users /></div>
          <div className="stat-info">
            <h4>Total Patients</h4>
            <h2>{stats.patients}</h2>
          </div>
        </div>
        <div className="stat-card" style={{gridColumn: 'span 2'}}>
          <div className="stat-icon orange"><FileText /></div>
          <div className="stat-info">
            <h4>Your Doctor ID</h4>
            <h2>{stats.myId || '—'}</h2>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Recent Appointments</h3>
          </div>
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length === 0 ? (
                  <tr><td colSpan="2" style={{textAlign: 'center', color: 'var(--text-light)'}}>No appointments found.</td></tr>
                ) : recentAppointments.map(a => (
                  <tr key={a.id}>
                    <td>{a.patient?.name || a.patientId}</td>
                    <td>{a.date} {a.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <a href="/appointments" className="btn-secondary" style={{display: 'flex', textDecoration: 'none', justifyContent: 'flex-start', alignItems: 'center', gap: '10px'}}><Calendar size={18}/> View Schedule</a>
            <a href="/patients" className="btn-secondary" style={{display: 'flex', textDecoration: 'none', justifyContent: 'flex-start', alignItems: 'center', gap: '10px'}}><Users size={18}/> View Patients</a>
          </div>
        </div>
      </div>
    </>
  );

  const PatientDashboard = () => (
    <>
      <div className="dash-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Calendar /></div>
          <div className="stat-info">
            <h4>My Appointments</h4>
            <h2>{stats.appointments}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><FileText /></div>
          <div className="stat-info">
            <h4>Your Patient ID</h4>
            <h2>{stats.myId || '—'}</h2>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>My Appointments</h3>
            <a href="/appointments" className="btn-primary" style={{width: 'auto', textDecoration: 'none', padding: '8px 16px', fontSize: '14px', height: 'auto'}}><Plus size={16}/> Book New</a>
          </div>
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length === 0 ? (
                  <tr><td colSpan="2" style={{textAlign: 'center', color: 'var(--text-light)'}}>No appointments found.</td></tr>
                ) : recentAppointments.map(a => (
                  <tr key={a.id}>
                    <td>{a.doctor?.name || a.doctorId}</td>
                    <td>{a.date} {a.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {username}</h1>
        {role === 'ADMIN' && <p className="page-subtitle">Here's what's happening in your clinic today.</p>}
      </div>

      {role === 'ADMIN' && <AdminDashboard />}
      {role === 'DOCTOR' && <DoctorDashboard />}
      {role === 'PATIENT' && <PatientDashboard />}
    </div>
  );
}
