import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, Lock, Mail, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="py-5" style={{ minHeight: '80vh', backgroundColor: '#f8fafc' }}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div
                className="p-4 text-center text-white"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
              >
                <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning mb-2">
                  <Hotel size={36} />
                </div>
                <h3 className="fw-bold mb-1 font-serif">Welcome Back</h3>
                <p className="text-secondary small mb-0">Sign in to your HotelPro portal</p>
              </div>

              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                    <ShieldAlert size={18} />
                    <span className="small">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        className="form-control bg-light border-start-0 ps-0"
                        placeholder="name@hotelpro.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label small fw-semibold text-muted mb-0">Password</label>
                      <a href="#forgot" className="small text-decoration-none text-muted">
                        Forgot?
                      </a>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <Lock size={18} />
                      </span>
                      <input
                        type="password"
                        className="form-control bg-light border-start-0 ps-0"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gold w-100 py-2 fw-semibold d-flex align-items-center justify-center justify-content-center gap-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <>
                        Sign In <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Demo Login Credentials */}
                <div className="mt-4 pt-3 border-top">
                  <p className="small text-muted fw-semibold mb-2 text-center">Demo Quick Sign-In:</p>
                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-warning text-dark btn-sm d-flex align-items-center justify-content-center gap-2"
                      onClick={() => handleQuickLogin('admin@hotelpro.com', 'admin123')}
                    >
                      <UserCheck size={16} /> Admin Demo (Eleanor Vance)
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-2"
                      onClick={() => handleQuickLogin('guest@hotelpro.com', 'guest123')}
                    >
                      <UserCheck size={16} /> Guest Demo (James Harrison)
                    </button>
                  </div>
                </div>

                <div className="text-center mt-4 pt-2">
                  <p className="small text-muted mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: '#c59b27' }}>
                      Register as Guest
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

