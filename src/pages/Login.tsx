import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      toast.success('تم الدخول بنجاح');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'خطأ في الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-10 rounded-2xl geometric-shadow space-y-8 border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-gray-400 mt-2 text-sm">Log in to manage your listings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-gray-400">Email Address</label>
            <input 
              type="email" required
              className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white transition-geometric outline-none focus:ring-1 focus:ring-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-gray-400">Password</label>
            <input 
              type="password" required
              className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white transition-geometric outline-none focus:ring-1 focus:ring-accent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-accent text-white py-4 rounded-xl font-bold hover:bg-accent-hover transition-geometric blue-glow shadow-xl">
            Log In
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm">
          ليس لديك حساب؟ <Link to="/register" className="text-accent font-bold hover:underline">تسجيل جديد</Link>
        </p>
      </div>
    </div>
  );
}
