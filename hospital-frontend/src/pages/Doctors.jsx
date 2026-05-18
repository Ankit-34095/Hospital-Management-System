import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Doctors(){
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({name:'',specialization:'',contact:'',email:''});
  const [deleteId, setDeleteId] = useState('');
  const [error, setError] = useState('');
  const [loginForm, setLoginForm] = useState({ doctorId: '', username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  async function load(){
    try {
      const res = await api.get('/doctors');
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch(e) {
      console.error('Load doctors error:', e.response?.status, e.response?.data);
    }
  }
  useEffect(()=>{load()},[]);

  async function handleAdd(e){
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/doctors', form);
      if (!res.data) throw new Error('No data returned');
      setForm({name:'',specialization:'',contact:'',email:''});
      setDoctors(prev => {
        if (prev.find(d => d.id === res.data.id)) return prev;
        return [...prev, res.data];
      });
      load();
    } catch(e) {
      const status = e.response?.status ? `(HTTP ${e.response?.status})` : '';
      const msg = typeof e.response?.data === 'string' ? e.response.data
        : e.response?.data?.message || `${status} Failed to add doctor.`;
      setError(msg);
      console.error('Add doctor error:', e.response?.status, e.response?.data);
    }
  }

  async function handleCreateLogin(e){
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    try {
      await api.post('/api/auth/register-doctor', loginForm);
      setLoginSuccess('Login credentials created for doctor #' + loginForm.doctorId);
      setLoginForm({ doctorId: '', username: '', password: '' });
    } catch(e) {
      setLoginError(e.response?.data || 'Failed to create login.');
    }
  }

  async function handleDelete(id){
    if (!id) return;
    try {
      await api.delete(`/doctors/${id}`);
      setDeleteId('');
      load();
    } catch(e) {
      setError(e.response?.data || 'Failed to delete doctor.');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Doctor Directory</h2>
        <p className="page-subtitle">Manage doctor records and specialties.</p>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px'}}>
        <div className="card">
          <div className="card-header">
            <h3>Add New Doctor Record</h3>
          </div>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Doctor Name</label>
              <input className="form-control" placeholder="e.g. Dr. John Doe" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <input className="form-control" placeholder="e.g. Cardiology" value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})} />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input className="form-control" placeholder="e.g. 555-1234" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input className="form-control" type="email" placeholder="e.g. dr.john@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
            </div>
            <button className="btn-primary">Add Doctor</button>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Remove Doctor Record</h3>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleDelete(deleteId); }}>
            <div className="form-group">
              <label>Select Doctor to Remove</label>
              <select className="form-control" value={deleteId} onChange={e => setDeleteId(e.target.value)} required>
                <option value="">-- Select a Doctor --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    ID: {d.id} - {d.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>
            <p style={{fontSize: '13px', color: 'var(--text-light)', marginBottom: '15px'}}>
              Removing a doctor will only delete their personal record. It will not delete records related to their appointments or treated patients.
            </p>
            <button className="btn-primary" style={{backgroundColor: 'var(--error)'}}>Remove Doctor</button>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Create Login Credentials</h3>
          </div>
          <form onSubmit={handleCreateLogin}>
            {loginError && <div className="alert error">{loginError}</div>}
            {loginSuccess && <div className="alert success">{loginSuccess}</div>}
            <div className="form-group">
              <label>Select Doctor</label>
              <select className="form-control" value={loginForm.doctorId} onChange={e => setLoginForm({...loginForm, doctorId: e.target.value})} required>
                <option value="">-- Select a Doctor --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    ID: {d.id} - {d.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Login Username</label>
              <input className="form-control" placeholder="e.g. dr.smith" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Login Password</label>
              <input className="form-control" type="password" placeholder="e.g. securePass123" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required />
            </div>
            <button className="btn-primary">Create Login</button>
          </form>
        </div>

        <div className="card" style={{gridColumn: '1 / -1'}}>
          <div className="card-header">
            <h3>Registered Doctors</h3>
          </div>
          <div className="table-container">
            <table className="modern-table">
              <thead><tr><th>ID</th><th>Name</th><th>Specialization</th><th>Contact</th><th>Actions</th></tr></thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>No doctors found.</td></tr>
                ) : doctors.map(d=> (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.specialization}</td>
                    <td>{d.contact}</td>
                    <td>
                      <button className="btn-secondary" style={{padding: '6px 12px', fontSize: '13px'}} onClick={()=>navigator.clipboard.writeText(d.id)}>Copy ID</button>
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
