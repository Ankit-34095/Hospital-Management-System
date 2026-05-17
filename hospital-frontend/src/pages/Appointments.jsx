import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Appointments() {
  const role = localStorage.getItem('role');
  const patientId = localStorage.getItem('patientId');
  const doctorId = localStorage.getItem('doctorId');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctorId: role === 'DOCTOR' && doctorId ? doctorId : '', patientId: role === 'PATIENT' && patientId ? patientId : '', date: '', time: '' });
  const [error, setError] = useState('');

  function todayStr() {
    return new Date().toISOString().split('T')[0];
  }

  function nowTime() {
    const n = new Date();
    return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
  }

  async function load() {
    try {
      let apptUrl = '/appointments';
      if (role === 'PATIENT' && patientId) apptUrl = `/appointments/by-patient/${patientId}`;
      else if (role === 'DOCTOR' && doctorId) apptUrl = `/appointments/by-doctor/${doctorId}`;
      const [apptRes, docRes] = await Promise.all([
        api.get(apptUrl),
        api.get('/doctors')
      ]);
      setAppointments(Array.isArray(apptRes.data) ? apptRes.data : []);
      setDoctors(Array.isArray(docRes.data) ? docRes.data : []);
    } catch (e) {
      console.error('Load error:', e.response?.status, e.response?.data);
    }
  }
  useEffect(() => { load() }, [role, patientId, doctorId]);

  function isPastDateTime(selectedDate, selectedTime) {
    const currentDate = todayStr();
    if (!selectedDate) return false;
    if (selectedDate < currentDate) return true;
    if (selectedDate === currentDate && selectedTime && selectedTime < nowTime()) return true;
    return false;
  }

  async function handleBook(e) {
    e.preventDefault();
    setError('');
    if (isPastDateTime(form.date, form.time)) {
      setError('Cannot book an appointment in the past.');
      return;
    }
    try {
      const payload = {
        doctor: { id: form.doctorId },
        patient: { id: form.patientId },
        date: form.date,
        time: form.time
      };
      const res = await api.post('/appointments', payload);
      if (!res.data) throw new Error('No data returned');
      setForm({
        doctorId: role === 'DOCTOR' && doctorId ? doctorId : '',
        patientId: role === 'PATIENT' && patientId ? patientId : '',
        date: '',
        time: ''
      });
      load();
    } catch (e) {
      setError(e.response?.data || 'Failed to book appointment.');
    }
  }

  async function handleCancel(id) {
    try {
      await api.delete(`/appointments/${id}`);
      load();
    } catch (e) {
      setError('Failed to cancel appointment.');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Appointments</h2>
        <p className="page-subtitle">Schedule and manage patient appointments.</p>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Book Appointment</h3>
          </div>
          <form onSubmit={handleBook}>
            <div className="form-group">
              <label>Doctor</label>
              <select className="form-control" value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })} required disabled={!!(role === 'DOCTOR' && doctorId)}>
                <option value="">-- Select a Doctor --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Patient ID</label>
              <input className="form-control" placeholder="Enter Patient ID" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} required disabled={!!(role === 'PATIENT' && patientId)} />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input className="form-control" type="date" min={todayStr()} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input className="form-control" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
            </div>
            <button className="btn-primary">Book Appointment</button>
          </form>
        </div>

        <div className="card" style={{gridColumn: '1 / -1'}}>
          <div className="card-header">
            <h3>Upcoming Appointments</h3>
          </div>
          <div className="table-container">
            <table className="modern-table">
              <thead><tr><th>ID</th><th>Doctor</th><th>Patient</th><th>Date</th><th>Time</th><th>Actions</th></tr></thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign: 'center'}}>No appointments found.</td></tr>
                ) : appointments.map(a => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.doctor?.name || a.doctorId}</td>
                    <td>{a.patient?.name || a.patientId}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>
                      <button className="btn-secondary" style={{padding: '6px 12px', fontSize: '13px'}} onClick={() => handleCancel(a.id)}>Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
