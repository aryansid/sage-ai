import { Link, useNavigate } from 'react-router-dom'
import { Button } from "./@/components/ui/button"
import { Input } from "./@/components/ui/input"
import React, { useState } from 'react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, company_name: companyName }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.detail === "User already exists") {
          setError("An account with this email already exists. Please log in instead.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
        return;
      }

      console.log('Signup successful:', data);
      
      // Here you might want to store the user data in your app's state
      // For example, using a context or state management library

      // Navigate to the search page or dashboard
      navigate('/search');
    } catch (error) {
      console.error('Error during signup:', error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-black text-white p-12 flex-col justify-between lg:flex">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">Sage</span>
          </div>
        </div>
        <div className="text-left">
          <blockquote className="text-2xl mb-4">
            "This prior art search tool has revolutionized my patent law practice. It's incredibly efficient and thorough, saving me countless hours on each case."
          </blockquote>
          <p className="font-medium">- Sarah Johnson, Patent Attorney</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between">
        <div className="flex justify-end">
          <Link to="/signin" className="text-sm font-medium hover:underline">
            Login
          </Link>
        </div>
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-3xl font-bold mb-4 text-center">Create an account</h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Enter your details below to create your account
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
            <Input 
              type="text" 
              placeholder="Company Name" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
                {error.includes("Please log in") && (
                  <Link to="/signin" className="underline ml-2">
                    Go to login
                  </Link>
                )}
              </div>
            )}
            <Button className="w-full bg-black text-white hover:bg-gray-800" type="submit">
              Sign Up
            </Button>
          </form>
          <p className="text-xs text-gray-600 mt-8 text-center">
            By clicking continue, you agree to our{' '}
            <Link to="/terms" className="underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div></div>
      </div>
    </div>
  )
}