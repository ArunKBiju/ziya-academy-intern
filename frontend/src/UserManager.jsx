import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function UserManager() {
  const [token, setToken] = useState('');
  const [auth, setAuth] = useState({ username: '', password: '' });
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', username:'', photo:null });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get(`${API_BASE}/users`, { headers:{ Authorization:`Bearer ${token}` }});
    setUsers(res.data.users);
  };
  useEffect(()=>{ if(token) fetchUsers(); }, [token]);

  const handleLogin = async () => {
    const res = await axios.post(`${API_BASE}/login`, auth);
    setToken(res.data.token);
    setAuth({ username:'', password:'' });
  };
  const handleRegister = async () => {
    await axios.post(`${API_BASE}/register`, auth);
    alert('Registered, now login');
    setAuth({ ...auth, password:'' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('username', form.username);
    if (form.photo) fd.append('photo', form.photo);

    if (editingId) {
      await axios.put(`${API_BASE}/users/${editingId}`, fd, {
        headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'multipart/form-data' }
      });
      setEditingId(null);
    } else {
      await axios.post(`${API_BASE}/users`, fd, {
        headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'multipart/form-data' }
      });
    }
    setForm({ name:'', email:'', username:'', photo:null });
    fetchUsers();
  };

  const startEdit = u => {
    setEditingId(u._id);
    setForm({ name:u.name, email:u.email, username:u.username, photo:null });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`${API_BASE}/users/${id}`, {
      headers:{ Authorization:`Bearer ${token}` }
    });
    fetchUsers();
  };

  const container = { fontFamily:'Arial, sans-serif', padding:'20px', maxWidth:'700px',
                      margin:'30px auto', background:'#f8f9fa', borderRadius:'10px',
                      boxShadow:'0 0 12px rgba(0,0,0,0.1)' };

  const input = { width:'100%', padding:'10px', marginBottom:'15px',
                  borderRadius:'6px', border:'1px solid #ccc' };

  return (
    <div style={container}>
      {!token ? (
        <>
          <h2 style={{ textAlign:'center' }}>Admin Login/Register</h2>
          <input style={input} placeholder="Username"
                 value={auth.username} onChange={e=>setAuth({ ...auth, username:e.target.value })}/>
          <input style={input} placeholder="Password" type="password"
                 value={auth.password} onChange={e=>setAuth({ ...auth, password:e.target.value })}/>
          <div style={{ textAlign:'center' }}>
            <button className="btn btn-add" onClick={handleLogin}>Login</button>
            <button className="btn btn-save" onClick={handleRegister}>Register</button>
          </div>
        </>
      ) : (
        <>
          <h2 style={{ textAlign:'center' }}>{editingId ? 'Edit User' :'Create New User'}</h2>
          <form onSubmit={handleSubmit}>
            <input style={input} placeholder="Name" value={form.name}
                   onChange={e=>setForm({ ...form, name:e.target.value })} required/>
            <input style={input} placeholder="Email" value={form.email}
                   onChange={e=>setForm({ ...form, email:e.target.value })} required/>
            <input style={input} placeholder="Username" value={form.username}
                   onChange={e=>setForm({ ...form, username:e.target.value })} required/>
            <input style={input} type="file"
                   onChange={e=>setForm({ ...form, photo:e.target.files[0] })}/>
            <div style={{ textAlign:'center' }}>
              <button type="submit" className={editingId ? 'btn btn-save' : 'btn btn-add'}>
                {editingId ? 'Save Changes' : 'Add User'}
              </button>
            </div>
          </form>

          <h3 style={{ marginTop:'30px' }}>User List</h3>
          <ul style={{ padding:0, listStyle:'none' }}>
            {users.map(u=>(
              <li key={u._id} className="card">
                <img src={`http://localhost:5000/uploads/${u.photo}`} alt={u.username} className="avatar"/>
                <div style={{ flexGrow:1 }}>
                  <strong>{u.name}</strong> ({u.username}) – {u.email}
                </div>
                <button className="btn btn-edit"   onClick={()=>startEdit(u)}>Edit</button>
                <button className="btn btn-del"    onClick={()=>handleDelete(u._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default UserManager;
