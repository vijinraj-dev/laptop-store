import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Alert, Spinner } from '../components/ui';

export default function LoginPage() {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-brand-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-brand-500 items-center justify-center mb-4 shadow-lg shadow-brand-500/30">
            <Monitor size={24} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">LaptopStore</h1>
          <p className="text-white/50 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} className="text-brand-500" />
            <h2 className="font-display font-bold text-white">Sign In</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert message={error} />}

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@laptopstore.com"
                required
                className="input bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-brand-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
              {loading ? <Spinner className="w-4 h-4" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/40 text-center mb-1">Demo credentials</p>
            <p className="text-xs text-white/60 text-center font-mono">admin@laptopstore.com</p>
            <p className="text-xs text-white/60 text-center font-mono">Admin@1234</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
