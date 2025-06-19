import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function UserManager() {
  const [token, setToken] = useState('');
  const [auth, setAuth] = useState({ username: '', password: '' });

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    photo: null
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error('Error fetching users:', err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/login`, auth);
      if (res.data.token) {
        setToken(res.data.token);
        setAuth({ username: '', password: '' });
      } else {
        alert('Login failed: Token not received');
      }
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE}/register`, auth);
      alert('Registered successfully. Now you can log in.');
      setAuth({ ...auth, password: '' });
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('username', form.username);
    formData.append('photo', form.photo);

    try {
      await axios.post(`${API_BASE}/users`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setForm({ name: '', email: '', username: '', photo: null });
      fetchUsers();
    } catch (err) {
      alert('Error creating user: ' + (err.response?.data?.error || err.message));
    }
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '700px',
    margin: '30px auto',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '10px'
  };

  return (
    <div style={containerStyle}>
      {!token ? (
        <>
          <h2 style={{ textAlign: 'center' }}>Admin Login/Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={auth.username}
            onChange={(e) => setAuth({ ...auth, username: e.target.value })}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={auth.password}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
            style={inputStyle}
            required
          />
          <div style={{ textAlign: 'center' }}>
            <button onClick={handleLogin} style={buttonStyle}>Login</button>
            <button onClick={handleRegister} style={{ ...buttonStyle, backgroundColor: '#28a745' }}>Register</button>
          </div>
        </>
      ) : (
        <>
          <h2 style={{ textAlign: 'center' }}>Create New User</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={inputStyle}
              required
            />
            <input
              type="file"
              onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
              style={inputStyle}
              required
            />
            <div style={{ textAlign: 'center' }}>
              <button type="submit" style={buttonStyle}>Add User</button>
            </div>
          </form>

          <h3 style={{ marginTop: '30px' }}>User List</h3>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {users.map((user) => (
              <li
                key={user._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '10px',
                  marginBottom: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                }}
              >
                <img
                  src={`http://localhost:5000/uploads/${user.photo}`}
                  alt={user.username}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    marginRight: '15px'
                  }}
                />
                <div style={{ lineHeight: 1.4 }}>
                  <strong style={{ fontSize: '17px', color: '#333' }}>{user.name}</strong>
                  <div style={{ color: '#555' }}>
                    ({user.username}) – {user.email}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default UserManager;
