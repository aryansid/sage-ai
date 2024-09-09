import { Link, useNavigate } from 'react-router-dom'
import { Button } from "./@/components/ui/button"
import { Input } from "./@/components/ui/input"
import React, { useState } from 'react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the sign-up logic
    // For now, we'll just navigate to the search page
    navigate('/search');
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
          <blockquote className="text-2xl font-medium mb-4">
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
            <Button className="w-full" type="submit">
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