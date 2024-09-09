import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "./@/components/ui/button"
import { Input } from "./@/components/ui/input"

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-in logic here
    navigate('/search');
  };

  return (
    <div className="flex min-h-screen flex-row-reverse">
      <div className="w-full lg:w-1/2 bg-black text-white p-8 sm:p-12 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
          <p className="text-gray-400">Sign in to access your account and continue your journey.</p>
        </div>
        <div className="mt-auto">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between">
        <div>
          <Link to="/" className="text-2xl font-bold">Your Logo</Link>
        </div>
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-3xl font-bold mb-4 text-center">Sign in to your account</h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Enter your credentials below to access your account
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>
          <p className="text-sm text-center mt-4">
            Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
          </p>
        </div>
        <div></div>
      </div>
    </div>
  )
}
