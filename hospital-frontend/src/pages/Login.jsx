import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import api from '../services/api';
import { Activity, Mail, Lock, LogIn } from 'lucide-react';

export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setError('');
    setLoading(true);
    try{
      const res = await login(username, password, role);
      const token = res.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      localStorage.removeItem('patientId');
      localStorage.removeItem('doctorId');
      if (role === 'PATIENT') {
        try {
          const pRes = await api.get(`/api/patients/by-name/${username}`);
          if (pRes.data && pRes.data.id) localStorage.setItem('patientId', pRes.data.id);
        } catch (e) {
          console.error('Could not fetch patient ID:', e);
        }
      }
      if (role === 'DOCTOR') {
        try {
          const dRes = await api.get(`/api/doctors/by-name/${username}`);
          if (dRes.data && dRes.data.id) localStorage.setItem('doctorId', dRes.data.id);
        } catch (e) {
          console.error('Could not fetch doctor ID:', e);
        }
      }
      navigate('/dashboard');
    }catch(err){
      setError(err.response?.data || 'Login failed. Please check credentials and role.');
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <Activity size={32} />
          </div>
          <h2>Welcome Back</h2>
          <p>Please log in to your MedCare account</p>
        </div>

        <div className="role-selector">
          {['PATIENT', 'DOCTOR', 'ADMIN'].map(r => (
            <button 
              key={r}
              type="button" 
              className={`role-btn ${role === r ? 'active' : ''}`}
              onClick={() => setRole(r)}
            >
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {error && <div className="alert error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div style={{position: 'relative'}}>
              <input 
                className="form-control"
                style={{paddingLeft: '40px'}}
                placeholder="Enter your username" 
                value={username} 
                onChange={e=>setUsername(e.target.value)} 
                required 
              />
              <Mail size={18} color="var(--text-light)" style={{position: 'absolute', left: '14px', top: '14px'}} />
            </div>
          </div>
          
          <div className="form-group" style={{marginBottom: '30px'}}>
            <label>Password</label>
            <div style={{position: 'relative'}}>
              <input 
                type="password" 
                className="form-control"
                style={{paddingLeft: '40px'}}
                placeholder="Enter your password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                required 
              />
              <Lock size={18} color="var(--text-light)" style={{position: 'absolute', left: '14px', top: '14px'}} />
            </div>
          </div>
          
          <button className="btn-primary" disabled={loading}>
            {loading ? 'Authenticating...' : (
              <>
                <LogIn size={18} />
                Log In
              </>
            )}
          </button>
        </form>

        <div style={{textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-light)'}}>
          Don't have an account? <Link to="/register" style={{color: 'var(--primary)', fontWeight: '600', textDecoration: 'none'}}>Register here</Link>
        </div>
      </div>
    </div>
  );
}
