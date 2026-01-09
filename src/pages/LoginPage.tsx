import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/20 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <Building2 size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Statements</h1>
          <p className="text-gray-600 font-medium">Multi-Company Management System</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && login(email, password)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && login(email, password)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={() => login(email, password)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
          >
            Sign In
          </button>
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-800 text-center font-medium">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Demo Mode: Any email and password will work
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
