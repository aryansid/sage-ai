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
    <div className="flex min-h-screen">
      <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">Sage</span>
          </div>
        </div>
        <div className="flex-grow flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-3xl font-bold mb-4 text-left">Welcome Back</h1>
            <p className="text-sm text-gray-600 mb-6 text-left">
              Enter your credentials below to access your account
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input 
                type="email" 
                placeholder="Company Email" 
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
              <Button className="w-full bg-black text-white" type="submit">
                Sign In
              </Button>
            </form>
            <p className="text-sm text-gray-600 mt-4 text-left">
              Forgot your password?
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-center">
            Don't have an account? <Link to="/signup" className="text-gray-600 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-black text-white p-12 flex flex-col justify-between">
        <div className="flex-grow flex items-center">
          <div className="max-w-xl mx-auto">
            <blockquote className="text-2xl mb-4 text-left font-normal leading-relaxed">
              "Their AI search tool has transformed our patent research process. It's uncannily accurate, saving us weeks of manual searching and dramatically improving our filing strategy."
            </blockquote>
            <p className="text-left font-bold">- Dr. Emily Chen, Chief IP Officer at TechInnovate Inc.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
