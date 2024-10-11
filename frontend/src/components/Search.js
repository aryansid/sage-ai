import React from 'react';

export default function JoinUsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-white">Join us.</span>{' '}
          <span className="text-gray-400">And help us bring</span>{' '}
          <span className="text-gray-400">software magic back.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400">
          If you believe in our mission of building exceptional software for the next-generation of companies, we'd love to talk to you.
        </p>
      </div>
    </div>
  )
}
