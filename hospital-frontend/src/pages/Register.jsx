import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth';
import { UserPlus, Mail, Lock, Activity } from 'lucide-react';

export default function Register(){
  const [form, setForm] = useState({username:'', password:''});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setError('');
    setLoading(true);
    try{
      await register(form);
      navigate('/login');
    }catch(err){
      setError(err.response?.data || 'Registration failed');
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
          <h2>Patient Registration</h2>
          <p>Create your patient account to book appointments</p>
        </div>

        {error && <div className="alert error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div style={{position: 'relative'}}>
              <input 
                className="form-control"
                style={{paddingLeft: '40px'}}
                placeholder="Choose a username" 
                value={form.username} 
                onChange={e=>setForm({...form,username:e.target.value})} 
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
                placeholder="Create a strong password" 
                value={form.password} 
                onChange={e=>setForm({...form,password:e.target.value})} 
                required 
              />
              <Lock size={18} color="var(--text-light)" style={{position: 'absolute', left: '14px', top: '14px'}} />
            </div>
          </div>
          
          <button className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div style={{textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-light)'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--primary)', fontWeight: '600', textDecoration: 'none'}}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
