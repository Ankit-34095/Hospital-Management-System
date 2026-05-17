import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Patients(){
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({name:'',age:'',gender:'',contact:'',address:''});
  const [error, setError] = useState('');

  async function load(){
    try {
      const res = await api.get('/patients');
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch(e) {
      console.error('Load patients error:', e.response?.status, e.response?.data);
    }
  }
  useEffect(()=>{load()},[]);

  async function handleAdd(e){
    e.preventDefault();
    setError('');
    try {
      const payload = {...form, age: form.age ? Number(form.age) : null};
      const res = await api.post('/patients', payload);
      if (!res.data) throw new Error('No data returned');
      setForm({name:'',age:'',gender:'',contact:'',address:''});
      setPatients(prev => {
        if (prev.find(p => p.id === res.data.id)) return prev;
        return [...prev, res.data];
      });
      load();
    } catch(e) {
      const status = e.response?.status ? `(HTTP ${e.response?.status})` : '';
      const msg = typeof e.response?.data === 'string' ? e.response.data
        : e.response?.data?.message || `${status} Failed to add patient.`;
      setError(msg);
      console.error('Add patient error:', e.response?.status, e.response?.data);
    }
  }

  async function handleDelete(id){
    try {
      await api.delete(`/patients/${id}`);
      load();
    } catch(e) {
      setError(e.response?.data || 'Failed to delete patient.');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Patient Management</h2>
        <p className="page-subtitle">View and manage all registered patients in the system.</p>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Add New Patient</h3>
          </div>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" placeholder="Patient Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
            </div>
            <div style={{display: 'flex', gap: '15px'}}>
              <div className="form-group" style={{flex: 1}}>
                <label>Age</label>
                <input className="form-control" type="number" placeholder="Age" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} required />
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label>Gender</label>
                <select className="form-control" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input className="form-control" placeholder="Phone Number" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input className="form-control" placeholder="Home Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
            </div>
            <button className="btn-primary">Add Patient</button>
          </form>
        </div>

        <div className="card" style={{gridColumn: '1 / -1'}}>
          <div className="card-header">
            <h3>Registered Patients</h3>
          </div>
          <div className="table-container">
            <table className="modern-table">
              <thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Contact</th><th>Actions</th></tr></thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>No patients found.</td></tr>
                ) : patients.map(p=> (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.contact}</td>
                    <td style={{display: 'flex', gap: '10px'}}>
                      <button className="btn-secondary" style={{padding: '6px 12px', fontSize: '13px'}} onClick={()=>navigator.clipboard.writeText(p.id)}>Copy ID</button>
                      <button className="btn-secondary" style={{padding: '6px 12px', fontSize: '13px', color: 'var(--error)'}} onClick={()=>handleDelete(p.id)}>Delete</button>
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
