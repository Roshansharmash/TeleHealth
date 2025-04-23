import React, { useState } from 'react';
import { Search, MapPin, Star, Bookmark, GraduationCap, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dummyDoctors } from '@/utils/dummyDoctors';

// Define types for our data (used for prop types)
interface DoctorProfile {
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  location?: string;
}

interface DoctorData {
  id: string;
  specialty: string;
  qualification: string;
  experience_years?: number;
  consultation_fee?: number;
  rating?: number;
  profiles?: DoctorProfile;
  availability?: string[];
}

const FindDoctor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>(null);

  // Dummy data logic: filter/search locally
  const doctors = dummyDoctors;
  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));
  const filteredDoctors = doctors?.filter(doctor => {
    const nameMatch = `${doctor.profiles?.first_name || ''} ${doctor.profiles?.last_name || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const specialtyMatch = !selectedSpecialty || doctor.specialty === selectedSpecialty;

    return nameMatch && specialtyMatch;
  });
  
  const handleBookAppointment = (doctor: DoctorData) => {
    setSelectedDoctor(doctor);
    toast({ 
      title: "Appointment Request", 
      description: `Booking with Dr. ${doctor.profiles?.first_name} ${doctor.profiles?.last_name}` 
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">Find Your Doctor</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Connect with top specialists for virtual consultations and in-person appointments
            </p>
          </div>
          
          {/* Search and filter section */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-lg mb-8 border border-gray-700/50">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              <div className="lg:col-span-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="search"
                    placeholder="Search doctors by name..."
                    className="pl-10 bg-gray-800/80 border-gray-700 text-gray-100 focus:ring-telehealth-primary focus:border-telehealth-primary h-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="lg:col-span-2">
                <select
                  className="w-full h-12 px-3 py-2 rounded-md border border-gray-700 bg-gray-800/80 text-gray-100 focus:outline-none focus:ring-2 focus:ring-telehealth-primary"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="">All Specialties</option>
                  {specialties?.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          {filteredDoctors && (
            <div className="text-gray-300 mb-6">
              Found <span className="font-semibold text-white">{filteredDoctors.length}</span> doctors
              {selectedSpecialty && (
                <span> in <span className="text-telehealth-primary">{selectedSpecialty}</span></span>
              )}
            </div>
          )}
          
          {/* Doctors grid */}
          {filteredDoctors && filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor} 
                  onBookAppointment={() => handleBookAppointment(doctor)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-700">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-200 mb-2">No doctors found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find available healthcare professionals
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface DoctorCardProps {
  doctor: DoctorData;
  onBookAppointment: () => void;
}

const DoctorCard = ({ doctor, onBookAppointment }: DoctorCardProps) => {
  const name = `${doctor.profiles?.first_name || ''} ${doctor.profiles?.last_name || ''}`;
  const rating = doctor.rating || 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Function to generate a random availability status
  const getAvailabilityStatus = () => {
    const statuses = ["Available today", "Available tomorrow", "Limited slots"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-telehealth-primary/10 group bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 bg-gray-700">
          <img 
            src={doctor.profiles?.profile_image_url || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&h=300&q=80'}
            alt={`Dr. ${name}`}
            className="object-cover object-center w-full h-48 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-md border border-gray-700/30 hover:bg-telehealth-primary/30"
          >
            <Bookmark size={16} className="text-white" />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-telehealth-primary/90 hover:bg-telehealth-primary text-white">
            {getAvailabilityStatus()}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-lg text-white group-hover:text-telehealth-primary transition-colors">
              Dr. {name}
            </h3>
            <p className="text-telehealth-secondary font-medium">{doctor.specialty}</p>
          </div>
          <div className="flex items-center bg-gray-900/60 px-2 py-1 rounded">
            <Star size={14} className="text-yellow-500 mr-1" fill="currentColor" />
            <span className="text-sm font-medium text-white">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <GraduationCap size={16} className="mr-2 text-gray-500" />
          <span>{doctor.qualification}</span>
        </div>
        
        {doctor.profiles?.location && (
          <div className="flex items-center text-sm text-gray-400 mb-3">
            <MapPin size={16} className="mr-2 text-gray-500" />
            <span>{doctor.profiles.location || "New York, NY"}</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 mb-4 mt-4 text-sm">
          <div className="bg-gray-900/50 p-2 rounded">
            <div className="text-gray-400">Experience</div>
            <div className="text-white font-medium">{doctor.experience_years} years</div>
          </div>
          <div className="bg-gray-900/50 p-2 rounded">
            <div className="text-gray-400">Fee</div>
            <div className="text-white font-medium">${doctor.consultation_fee}</div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={onBookAppointment}
            className="flex-1 bg-telehealth-primary hover:bg-telehealth-secondary text-white"
          >
            <Calendar size={16} className="mr-2" />
            Book Now
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FindDoctor;