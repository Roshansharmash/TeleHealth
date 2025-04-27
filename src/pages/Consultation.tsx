import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, MicOff, Video, VideoOff, Phone, MessageSquare, 
  Users, Clock, Settings, Share, MoreVertical
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
  SheetTitle
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const VideoConsultation = ({ appointmentId = 'default-consultation' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State variables
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);
  const [hasMediaAccess, setHasMediaAccess] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {sender: "Doctor", message: "Hello! I'll be with you shortly.", time: "10:01 AM"},
    {sender: "You", message: "Thanks, doctor. I'm ready whenever you are.", time: "10:02 AM"}
  ]);
  
  // Refs
  const timerRef = useRef(null);
  const userVideoRef = useRef(null);
  const doctorVideoRef = useRef(null);
  const userStreamRef = useRef(null);
  const doctorStreamRef = useRef(null);
  
  // Consultation metadata
  const consultationData = {
    id: appointmentId,
    patientName: 'John Smith',
    doctorName: 'Dr. Sarah Johnson',
    startTime: new Date(),
    duration: '30 minutes',
    specialty: 'General Practitioner',
    reason: 'Regular check-up'
  };
  
  // Helper for time formatting
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Create a doctor video stream using canvas
  const createDoctorVideoStream = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    const drawFrame = () => {
      if (!ctx) return;
      
      // Background
      ctx.fillStyle = '#1a365d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Doctor avatar
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2 - 60, 90, 0, Math.PI * 2);
      ctx.fill();
      
      // Doctor body
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(canvas.width/2 - 70, canvas.height/2 + 30);
      ctx.lineTo(canvas.width/2 + 70, canvas.height/2 + 30);
      ctx.lineTo(canvas.width/2 + 90, canvas.height);
      ctx.lineTo(canvas.width/2 - 90, canvas.height);
      ctx.closePath();
      ctx.fill();
      
      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Doctor Video', canvas.width/2, canvas.height - 40);
      
      // Time indicator (for animation)
      const time = new Date().toLocaleTimeString();
      ctx.font = '16px sans-serif';
      ctx.fillText(time, canvas.width/2, canvas.height - 15);
      
      requestAnimationFrame(drawFrame);
    };
    
    drawFrame();
    
    try {
      return canvas.captureStream(30);
    } catch (error) {
      console.error("Failed to create doctor stream:", error);
      return null;
    }
  };

  // Request camera and microphone access
  const requestMediaAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      
      userStreamRef.current = stream;
      
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
      
      setHasMediaAccess(true);
      setShowPermissionDialog(false);
      startConnectionProcess();
      
      toast({
        title: "Connected",
        description: "Camera and microphone are now active",
      });
    } catch (error) {
      console.error("Media access error:", error);
      toast({
        title: "Access Denied",
        description: "Please grant camera and microphone permissions",
        variant: "destructive"
      });
    }
  };

  // Start the mock connection process
  const startConnectionProcess = () => {
    setIsConnecting(true);
    
    setTimeout(() => {
      setIsConnecting(false);
      setupDoctorVideo();
      
      // Start the timer
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }, 2000);
  };

  // Set up the doctor's video stream
  const setupDoctorVideo = () => {
    const mockStream = createDoctorVideoStream();
    if (!mockStream) return;
    
    doctorStreamRef.current = mockStream;
    
    if (doctorVideoRef.current) {
      doctorVideoRef.current.srcObject = mockStream;
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (userStreamRef.current) {
      userStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(!isMicMuted);
    }
  };

  // Toggle camera
  const toggleVideo = () => {
    if (userStreamRef.current) {
      userStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // End the consultation
  const endConsultation = () => {
    // Clean up streams
    if (userStreamRef.current) {
      userStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (doctorStreamRef.current) {
      doctorStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  // Send a chat message
  const sendMessage = (e) => {
    e.preventDefault();
    
    if (messageInput.trim()) {
      const newMessage = {
        sender: "You",
        message: messageInput,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setChatMessages([...chatMessages, newMessage]);
      setMessageInput("");
      
      // Simulate doctor response after a brief delay
      if (chatMessages.length % 3 === 0) {
        setTimeout(() => {
          const responses = [
            "How are you feeling today?",
            "Could you tell me more about your symptoms?",
            "I'm reviewing your records now.",
            "Have you been taking the prescribed medication?",
            "That's good to know. Let's discuss next steps."
          ];
          
          const doctorResponse = {
            sender: "Doctor",
            message: responses[Math.floor(Math.random() * responses.length)],
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          };
          
          setChatMessages(prev => [...prev, doctorResponse]);
        }, 2000);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (doctorStreamRef.current) {
        doctorStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Permissions dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Camera and Microphone Access</DialogTitle>
            <DialogDescription className="text-gray-300">
              To join your video consultation, please allow access to your camera and microphone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <div className="flex items-center space-x-2">
              <Video className="text-green-500 w-5 h-5" />
              <span>Camera access is required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mic className="text-green-500 w-5 h-5" />
              <span>Microphone access is required</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button onClick={requestMediaAccess}>
              Allow Access
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header bar */}
      <div className="bg-gray-800 border-b border-gray-700 p-3 flex justify-between items-center">
        <div className="flex items-center">
          <Badge variant="outline" className="bg-green-700/20 text-green-400 border-green-700 mr-3">
            Live
          </Badge>
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
            className="text-gray-400 hover:text-white"
            onClick={() => setIsInfoOpen(true)}
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

      {/* Main video area */}
      <div className="flex-1 relative">
        {/* Doctor's video */}
        <video
          ref={doctorVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover bg-gray-900"
        />
        
        {/* Connection overlay */}
        {isConnecting && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4 mx-auto"></div>
              <p className="text-xl font-medium">Connecting to your appointment...</p>
              <p className="text-sm text-gray-400 mt-2">Please wait while we establish a secure connection</p>
            </div>
          </div>
        )}
        
        {/* Self video */}
        <div className="absolute bottom-5 right-5 w-48 h-36 rounded-lg overflow-hidden shadow-lg border-2 border-gray-700 z-10">
          {isVideoOff ? (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-gray-600 text-white">ME</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <video
              ref={userVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover bg-gray-700"
            />
          )}
          
          {isMicMuted && (
            <div className="absolute top-2 left-2 bg-red-500 rounded-full p-1">
              <MicOff className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Control bar */}
      <Card className="bg-gray-800 border-t border-gray-700 rounded-none">
        <div className="p-4 flex flex-wrap justify-between items-center">
          <div className="hidden md:block text-white">
            <p className="font-semibold">{consultationData.doctorName}</p>
            <p className="text-sm text-gray-400">{consultationData.specialty}</p>
          </div>
          
          <div className="flex justify-center flex-1 md:flex-none space-x-4">
            <Button 
              variant={isMicMuted ? "secondary" : "outline"} 
              size="icon" 
              className="rounded-full h-12 w-12"
              onClick={toggleMic}
              disabled={!hasMediaAccess}
            >
              {isMicMuted ? 
                <MicOff className="h-5 w-5 text-red-500" /> : 
                <Mic className="h-5 w-5 text-green-500" />}
            </Button>
            
            <Button 
              variant={isVideoOff ? "secondary" : "outline"} 
              size="icon" 
              className="rounded-full h-12 w-12"
              onClick={toggleVideo}
              disabled={!hasMediaAccess}
            >
              {isVideoOff ? 
                <VideoOff className="h-5 w-5 text-red-500" /> : 
                <Video className="h-5 w-5 text-green-500" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className={`rounded-full h-12 w-12 ${isChatOpen ? 'bg-indigo-900/30 border-indigo-600 text-indigo-400' : ''}`}
              onClick={() => setIsChatOpen(true)}
            >
              <MessageSquare className={`h-5 w-5 ${isChatOpen ? 'text-indigo-400' : 'text-gray-400'}`} />
            </Button>
            
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full h-12 w-12"
              onClick={endConsultation}
            >
              <Phone className="h-5 w-5 transform rotate-135" />
            </Button>
          </div>
          
          <div className="hidden md:flex items-center text-sm text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        </div>
      </Card>

      {/* Chat sidebar */}
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent side="right" className="w-full sm:w-96 bg-gray-800 border-l border-gray-700 p-0">
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

      {/* Info sidebar */}
      <Sheet open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <SheetContent side="right" className="w-full sm:w-96 bg-gray-800 border-l border-gray-700 p-0">
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
                  <h3 className="text-sm font-medium text-gray-400">Duration</h3>
                  <p className="text-white">{consultationData.duration}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="participants" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                    <Avatar className="mr-3">
                      <AvatarFallback className="bg-blue-700 text-white">DR</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-white">{consultationData.doctorName}</h4>
                      <p className="text-sm text-gray-400">{consultationData.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                    <Avatar className="mr-3">
                      <AvatarFallback className="bg-green-700 text-white">JS</AvatarFallback>
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
                onClick={endConsultation}
              >
                End Consultation
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default VideoConsultation;
