import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Building2 size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Financial Statements</h1>
          <p className="text-gray-600 mt-2">Multi-Company System</p>
        </div>
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && login(email, password)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && login(email, password)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Password"
          />
          <button
            onClick={() => login(email, password)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">Demo: Any email/password works</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
