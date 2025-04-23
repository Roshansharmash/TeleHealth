
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';

interface VideoConsultationProps {
  appointmentId?: string;
  appointment?: any; // Using any temporarily - ideally would define a proper type
}

const VideoConsultation = ({ appointmentId, appointment }: VideoConsultationProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // Use appointment data if available, otherwise use dummy data
  const consultationData = appointment ? {
    id: appointment.id || 'default-consultation',
    patientName: appointment.patient?.profiles?.[0]?.first_name + ' ' + appointment.patient?.profiles?.[0]?.last_name || 'John Smith',
    doctorName: 'Dr. ' + (appointment.doctor?.profiles?.[0]?.first_name || '') + ' ' + (appointment.doctor?.profiles?.[0]?.last_name || '') || 'Dr. Sarah Johnson',
    startTime: appointment.appointment_date ? new Date(appointment.appointment_date) : new Date(),
    duration: '30 minutes',
  } : {
    id: appointmentId || 'default-consultation',
    patientName: 'John Smith',
    doctorName: 'Dr. Sarah Johnson',
    startTime: new Date(),
    duration: '30 minutes',
  };
  
  // Simulate connection process
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false);
      toast({
        title: "Connected successfully",
        description: "You are now connected to your telehealth appointment",
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [toast]);
  
  const handleEndCall = () => {
    toast({
      title: "Call ended",
      description: "Your telehealth consultation has ended",
    });
    navigate('/dashboard');
  };
  
  const toggleMic = () => {
    setIsMicMuted(!isMicMuted);
  };
  
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden">
        {/* Main video container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isConnecting ? (
            <div className="text-white flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
              <p>Connecting to your appointment...</p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1612531386530-97286d97c2d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Doctor video"
                className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center">
                    <span className="text-3xl text-white">DR</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Self view (small overlay) */}
        <div className="absolute bottom-5 right-5 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-white">
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
              alt="Self view"
              className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-lg text-white">ME</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Call controls */}
      <Card className="mt-4 bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h3 className="font-bold text-white">{consultationData.doctorName}</h3>
              <p className="text-sm text-gray-300">Consultation in progress</p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant={isMicMuted ? "secondary" : "outline"} 
                size="sm" 
                onClick={toggleMic}
                className="w-12 h-12 rounded-full"
              >
                {isMicMuted ? <MicOff className="text-red-500" /> : <Mic className="text-green-500" />}
              </Button>
              <Button 
                variant={isVideoOff ? "secondary" : "outline"} 
                size="sm" 
                onClick={toggleVideo}
                className="w-12 h-12 rounded-full"
              >
                {isVideoOff ? <VideoOff className="text-red-500" /> : <Video className="text-green-500" />}
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleEndCall}
                className="w-12 h-12 rounded-full"
              >
                <Phone className="transform rotate-135" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoConsultation;
