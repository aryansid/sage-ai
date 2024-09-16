import React from 'react';
import NavBar from './components/NavBar';

const ContactPage: React.FC = () => {
  return (
    <>
      <NavBar currentPage="Contact" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="mb-4">This is a sample contact page. You can add your contact form or information here.</p>
        <div className="bg-gray-100 p-4 rounded">
          <p>Email: contact@example.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Main St, Anytown, USA</p>
        </div>
      </div>
    </>
  );
};

export default ContactPage;

{/* 
// Original code commented out
import { Button } from "./@/components/ui/button";
import { Input } from "./@/components/ui/input";
import { Textarea } from "./@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./@/components/ui/select";

const ContactPage: React.FC = () => {
  return (
    <>
      <NavBar currentPage="Contact" />
      <div className="w-full min-h-screen bg-white text-black flex flex-col">
        <div className="flex-grow flex flex-col md:flex-row">
          ... (rest of the original code)
        </div>
      </div>
    </>
  );
};

export default ContactPage;
*/}
