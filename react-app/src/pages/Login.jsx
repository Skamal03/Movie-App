import React, { useState, useEffect } from 'react'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import '../style/login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [loginMessage, setLoginMessage] = useState('');
  const [signupMessage, setSignupMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {}
    }
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setLoginMessage('');
    setSignupMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage('');
    const { email, password } = loginData;
    if (!email || !password) return setLoginMessage('Please fill in all fields.');

    try {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        alert(`Login successful! Welcome, ${data.user.username}!`);
      } else {
        setLoginMessage(data.message || 'Login failed');
      }
    } catch {
      setLoginMessage('Server error, try again later.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupMessage('');
    const { username, email, password } = signupData;
    if (!username || !email || !password)
      return setSignupMessage('Please fill in all fields.');

    try {
      const res = await fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (res.ok) {
        setSignupMessage('Signup successful! You can now login.');
        setTimeout(() => {
          handleTabClick('login');
          setLoginData({ email: '', password: '' });
          setSignupData({ username: '', email: '', password: '' });
        }, 2000);
      } else {
        setSignupMessage(data.message || 'Signup failed');
      }
    } catch {
      setSignupMessage('Server error, try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setLoginData({ email: '', password: '' });
    setSignupData({ username: '', email: '', password: '' });
  };

  return (
    <>
      <Header />
      <div style={{ display: 'flex', minHeight: '80vh' }}>
        <SideMenu />
        <main className="login-page auth-main-container" style={{ flex: 1, padding: '20px' }}>
          {!user ? (
            <div className="authorization">
              <div className="tabs">
                <div
                  className={`tab ${activeTab === 'login' ? 'active' : ''} text-white fw-bold`}
                  onClick={() => handleTabClick('login')}
                  style={{ cursor: 'pointer' }}
                >
                  Login
                </div>
                <div
                  className={`tab ${activeTab === 'signup' ? 'active' : ''} text-white fw-bold`}
                  onClick={() => handleTabClick('signup')}
                  style={{ cursor: 'pointer' }}
                >
                  Signup
                </div>
              </div>

              {activeTab === 'login' && (
                <form className="active" onSubmit={handleLogin}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                  <button className="login" type="submit">Login</button>
                  <div className="message">{loginMessage}</div>
                </form>
              )}

              {activeTab === 'signup' && (
                <form className="active" onSubmit={handleSignup}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={signupData.username}
                    onChange={(e) =>
                      setSignupData({ ...signupData, username: e.target.value })
                    }
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                  />
                  <button className="signup" type="submit">Signup</button>
                  <div className="message">{signupMessage}</div>
                </form>
              )}
            </div>
          ) : (
            <div id="logged-in-container">
              <div className="fw-bold fs-2 mb-3 text-white px-5 py-4">
                Welcome, {user.username}! You are logged in.
              </div>
              <button className="logout-btn mb-3 fw-bold" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Login;
