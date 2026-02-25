
import React, { useState } from 'react';
import { useAppStore } from '../store/store';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import Spinner from '../components/Spinner';

const SignUp: React.FC = () => {
  const { signUp, loading, error, setView } = useAppStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(fullName, email, password);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-brand-border rounded-lg shadow-xl">
        <h2 className="text-3xl font-serif font-bold text-center">Become a Collector</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Full Name"
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />
          <Input 
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input 
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
           {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Sign Up'}
            </Button>
          </div>
        </form>
        <p className="text-center text-sm text-brand-text opacity-70">
          Already a collector?{' '}
          <button onClick={() => setView('signin')} className="font-medium text-brand-primary hover:text-brand-accent">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
