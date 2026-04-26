import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authData.user.id, 
              name: formData.name, 
              phone: formData.phone 
            },
          ]);

        if (profileError) throw profileError;
      }

      toast.success('تم إنشاء الحساب بنجاح');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'خطأ في التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-10 rounded-2xl geometric-shadow space-y-8 border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-gray-400 mt-2 text-sm">Join the Wajdi Immo community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-gray-400">Full Name</label>
            <input 
              type="text" required
              className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white transition-geometric outline-none focus:ring-1 focus:ring-accent"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-gray-400">Email Address</label>
            <input 
              type="email" required
              className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white transition-geometric outline-none focus:ring-1 focus:ring-accent"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-gray-400">Phone Number</label>
            <input 
              type="tel" required
              className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white transition-geometric outline-none focus:ring-1 focus:ring-accent"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-gray-400">Password</label>
            <input 
              type="password" required
              className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white transition-geometric outline-none focus:ring-1 focus:ring-accent"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-accent text-white py-4 rounded-xl font-bold hover:bg-accent-hover transition-geometric blue-glow shadow-xl">
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm">
          لديك حساب بالفعل؟ <Link to="/login" className="text-accent font-bold hover:underline">دخول</Link>
        </p>
      </div>
    </div>
  );
}
