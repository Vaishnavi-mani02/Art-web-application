
import React, { useState } from 'react';
import { useAppStore } from '../store/store';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import Spinner from '../components/Spinner';

const SignIn: React.FC = () => {
  const { login, loading, error, setView } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-brand-border rounded-lg shadow-xl">
        <h2 className="text-3xl font-serif font-bold text-center">Collector Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            autoComplete="current-password"
          />
           {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Sign In'}
            </Button>
          </div>
        </form>
        <p className="text-center text-sm text-brand-text opacity-70">
          Not a collector yet?{' '}
          <button onClick={() => setView('signup')} className="font-medium text-brand-primary hover:text-brand-accent">
            Sign up
          </button>
        </p>
         <div className="text-center text-xs text-brand-text opacity-60 p-4 border border-brand-border rounded-md bg-brand-background">
            <p className="mb-2"><strong>Test users:</strong></p>
            <p>vaishnavi@gmail.com (special admin)</p>
            <p>admin@nebula.art (db admin)</p>
            <p>collector@email.com (collector)</p>
            <p>any other email (user)</p>
            <p className="mt-2">Password for all is: `password` (except special admin)</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;