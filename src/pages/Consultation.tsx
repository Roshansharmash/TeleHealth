import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, MicOff, Video, VideoOff, Phone, MessageSquare, 
  MoreVertical, Share, Settings, Users, Clock, ChevronRight 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{sender: string, message: string, time: string}[]>([
    {sender: "Doctor", message: "Hello! I'll be with you shortly.", time: "10:01 AM"},
    {sender: "You", message: "Thanks, doctor. I'm ready whenever you are.", time: "10:02 AM"}
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use appointment data if available, otherwise use dummy data
  const consultationData = appointment ? {
    id: appointment.id || 'default-consultation',
    patientName: appointment.patient?.profiles?.[0]?.first_name + ' ' + appointment.patient?.profiles?.[0]?.last_name || 'John Smith',
    doctorName: 'Dr. ' + (appointment.doctor?.profiles?.[0]?.first_name || '') + ' ' + (appointment.doctor?.profiles?.[0]?.last_name || '') || 'Dr. Sarah Johnson',
    startTime: appointment.appointment_date ? new Date(appointment.appointment_date) : new Date(),
    duration: '30 minutes',
    specialty: appointment.doctor?.profiles?.[0]?.specialty || 'General Practitioner',
    reason: appointment.reason || 'Regular check-up'
  } : {
    id: appointmentId || 'default-consultation',
    patientName: 'John Smith',
    doctorName: 'Dr. Sarah Johnson',
    startTime: new Date(),
    duration: '30 minutes',
    specialty: 'General Practitioner',
    reason: 'Regular check-up'
  };
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start timer when connection is established
  useEffect(() => {
    if (!isConnecting && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isConnecting]);
  
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
      variant: "destructive"
    });
    navigate('/dashboard');
  };
  
  const toggleMic = () => {
    setIsMicMuted(!isMicMuted);
    toast({
      description: isMicMuted ? "Microphone unmuted" : "Microphone muted",
      duration: 2000,
    });
  };
  
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast({
      description: isVideoOff ? "Video turned on" : "Video turned off",
      duration: 2000,
    });
  };
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const newMessage = {
        sender: "You",
        message: messageInput,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessageInput("");
      
      // Simulate doctor's response
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          sender: "Doctor",
          message: "I see. Thank you for sharing that information.",
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }]);
      }, 3000);
    }
  };
  
  return (
    <div className="h-full flex flex-col relative">
      {/* Top bar with consultation info */}
      <div className="bg-gray-800 border-b border-gray-700 p-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-3">
            <Badge variant="outline" className="bg-green-700/20 text-green-400 border-green-700">
              Live
            </Badge>
          </div>
          <div>
            <h2 className="font-semibold text-white">{consultationData.doctorName}</h2>
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="text-gray-400 hover:text-white"
          >
            <Users className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Details</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="w-4 h-4 mr-2" />
                Share screen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        {/* Main video container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isConnecting ? (
            <div className="text-white flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
              <p className="font-medium">Connecting to your appointment...</p>
              <p className="text-sm text-gray-400 mt-2">Please wait while we establish a secure connection</p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src="/api/placeholder/1280/720"
                alt="Doctor video"
                className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Avatar className="w-32 h-32 border-4 border-gray-700">
                    <AvatarFallback className="bg-gray-700 text-3xl">SJ</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Self view (small overlay) */}
        <div className="absolute bottom-5 right-5 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-gray-700">
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="/api/placeholder/200/150"
              alt="Self view"
              className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gray-700">JS</AvatarFallback>
                </Avatar>
              </div>
            )}
            {isMicMuted && (
              <div className="absolute top-2 left-2 bg-red-500 rounded-full p-1">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
        
        {/* Chat sidebar */}
        <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
          <SheetContent side="right" className="w-80 sm:w-96 bg-gray-800 border-l border-gray-700 p-0">
            <SheetHeader className="px-4 py-3 border-b border-gray-700">
              <SheetTitle className="text-white">Chat</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                    <div className={`rounded-lg px-4 py-2 max-w-3/4 ${
                      msg.sender === "You" 
                        ? "bg-indigo-600 text-white" 
                        : "bg-gray-700 text-gray-100"
                    }`}>
                      <div className="text-sm">{msg.message}</div>
                      <div className="text-xs mt-1 opacity-70">{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="border-t border-gray-700 p-4">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 py-2 px-3 bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-100"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <Button type="submit" className="rounded-l-none">Send</Button>
                </div>
              </form>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Appointment info sidebar */}
        <Sheet open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <SheetContent side="right" className="w-80 sm:w-96 bg-gray-800 border-l border-gray-700 p-0">
            <SheetHeader className="px-4 py-3 border-b border-gray-700">
              <SheetTitle className="text-white">Consultation Details</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <Tabs defaultValue="details">
                <TabsList className="w-full bg-gray-700">
                  <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                  <TabsTrigger value="participants" className="flex-1">Participants</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-400">Consultation Type</h3>
                    <p className="text-white">Telehealth Video Appointment</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-400">Specialty</h3>
                    <p className="text-white">{consultationData.specialty}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-400">Reason for Visit</h3>
                    <p className="text-white">{consultationData.reason}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-400">Appointment ID</h3>
                    <p className="text-white">{consultationData.id}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-400">Duration</h3>
                    <p className="text-white">{consultationData.duration}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="participants" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                      <Avatar className="mr-3">
                        <AvatarImage src="/api/placeholder/50/50" alt="Doctor" />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-white">{consultationData.doctorName}</h4>
                        <p className="text-sm text-gray-400">{consultationData.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                      <Avatar className="mr-3">
                        <AvatarImage src="/api/placeholder/50/50" alt="Patient" />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-white">{consultationData.patientName}</h4>
                        <p className="text-sm text-gray-400">Patient</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full border-red-700 text-red-500 hover:bg-red-900/20" 
                  onClick={handleEndCall}
                >
                  End Consultation
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Call controls */}
      <Card className="bg-gray-800 border-gray-700 rounded-none sm:rounded-b-lg">
        <CardContent className="p-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="hidden md:block text-left mb-4 md:mb-0">
              <h3 className="font-bold text-white">{consultationData.doctorName}</h3>
              <p className="text-sm text-gray-300">{consultationData.specialty}</p>
            </div>
            
            <div className="flex justify-center flex-1 md:flex-none space-x-3">
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
                variant="outline"
                size="sm"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`w-12 h-12 rounded-full ${isChatOpen ? 'bg-indigo-900/30 border-indigo-600 text-indigo-400' : ''}`}
              >
                <MessageSquare className={isChatOpen ? "text-indigo-400" : "text-gray-400"} />
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
            
            <div className="hidden md:flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoConsultation;