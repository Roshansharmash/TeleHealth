import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-telehealth-primary to-telehealth-secondary bg-clip-text text-transparent">
                TeleHealth
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Connecting patients and doctors seamlessly through secure telemedicine.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/appointments" className="text-sm text-gray-600 hover:text-gray-900">Appointments</Link></li>
              <li><Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900">Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-sm text-gray-600 hover:text-gray-900">Help Center</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            © {currentYear} TeleHealth. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
