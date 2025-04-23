import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Index = () => {
  const features = [
    { icon: '👨‍⚕️', title: 'Expert Doctors', description: 'Connect with licensed and experienced healthcare professionals from various specialties.' },
    { icon: '⏰', title: '24/7 Availability', description: 'Access healthcare services any time of day or night, regardless of your location.' },
    { icon: '📱', title: 'Easy to Use', description: 'Simple, intuitive interface optimized for both mobile and desktop devices.' },
    { icon: '🔒', title: 'Secure & Private', description: 'HIPAA-compliant platform with end-to-end encryption for your data security.' },
  ];

  const steps = [
    { number: '01', title: 'Create an Account', description: 'Sign up with your email and basic information to get started.' },
    { number: '02', title: 'Find a Specialist', description: 'Browse through our network of qualified healthcare professionals.' },
    { number: '03', title: 'Book an Appointment', description: 'Schedule a convenient time for your virtual consultation.' },
    { number: '04', title: 'Receive Care', description: 'Connect via secure video call and get the care you need.' },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-telehealth-primary to-telehealth-secondary text-white">
        <div className="telehealth-container py-20 md:py-28 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Healthcare at Your Fingertips
            </h1>
            <p className="text-lg opacity-90 mb-8 max-w-md">
              Connect with licensed doctors through secure video consultations. 
              Get diagnosed, receive prescriptions, and manage your health from anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-telehealth-secondary hover:bg-gray-100 shadow-md">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=600&h=600&q=80"
              alt="Telemedicine consultation"
              className="rounded-2xl shadow-xl w-full max-w-md object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="telehealth-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TeleHealth Connect</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers a comprehensive approach to remote healthcare, enabling you to access medical services with ease and confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="telehealth-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started with TeleHealth Connect is simple and straightforward.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md relative">
                <div className="text-4xl font-bold text-telehealth-accent/50 mb-2">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-[-30px] w-[60px] h-[2px] bg-gray-300">
                    <div className="absolute right-0 top-[-4px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-telehealth-tertiary text-white">
        <div className="telehealth-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied users who have transformed how they access healthcare services.
            Sign up today and experience healthcare from the comfort of your home.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-telehealth-secondary hover:bg-gray-100 shadow-md">
              <Link to="/signup">Create Patient Account</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/signup">Register as Provider</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
