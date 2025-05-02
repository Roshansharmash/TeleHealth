import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Dummy data for messages - should match the IDs used in MessagesList
const DUMMY_MESSAGES = [
  {
    id: 'msg-1',
    patientName: 'Alice Johnson',
    patientId: 'patient-1',
    subject: 'Question about medication',
    message: "Hello doctor, I wanted to ask about possible side effects of the medication you prescribed. I've been experiencing some dizziness in the mornings.",
    timestamp: new Date(2023, 3, 27, 9, 23),
    isRead: true,
  },
  {
    id: 'msg-2',
    patientName: 'Bob Smith',
    patientId: 'patient-2',
    subject: 'Follow-up appointment',
    message: "Dr. Taylor, I need to reschedule my follow-up appointment next week. Is there availability on Thursday afternoon instead?",
    timestamp: new Date(2023, 3, 26, 15, 47),
    isRead: false,
  },
  {
    id: 'msg-3',
    patientName: 'Carol White',
    patientId: 'patient-3',
    subject: 'Test results',
    message: "Hi doctor, I received notification that my test results are in. Could you please let me know if there's anything concerning?",
    timestamp: new Date(2023, 3, 25, 11, 5),
    isRead: false,
  },
  {
    id: 'msg-4',
    patientName: 'David Brown',
    patientId: 'patient-4',
    subject: 'Prescription refill',
    message: "Hello, I need a refill for my blood pressure medication. Could you please send it to the same pharmacy as last time?",
    timestamp: new Date(2023, 3, 24, 16, 32),
    isRead: true,
  },
];

interface MessageDetailProps {
  messageId: string;
}

const MessageDetail = ({ messageId }: MessageDetailProps) => {
  const { toast } = useToast();
  const [reply, setReply] = React.useState('');
  
  const message = DUMMY_MESSAGES.find(m => m.id === messageId);
  
  if (!message) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Message not found
      </div>
    );
  }
  
  const handleSendReply = () => {
    if (!reply.trim()) {
      toast({
        title: "Cannot send",
        description: "Please write a reply first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Reply sent",
      description: `Your reply to ${message.patientName} has been sent`,
    });
    
    setReply('');
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Message header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">{message.subject}</h2>
          <span className="text-sm text-gray-500">
            {format(message.timestamp, 'PPP')}
          </span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          From: {message.patientName}
        </div>
      </div>
      
      {/* Message content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-gray-800 whitespace-pre-line">{message.message}</p>
        </div>
      </div>
      
      {/* Reply area */}
      <div className="p-4 border-t border-gray-200">
        <Textarea
          placeholder="Type your reply here..."
          className="bg-white border-gray-300 text-gray-800 mb-4"
          rows={4}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to messages
          </Button>
          <Button 
            type="button" 
            onClick={handleSendReply}
            className="bg-telehealth-primary hover:bg-telehealth-secondary text-white"
          >
            <Send className="h-4 w-4 mr-1" /> Send Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageDetail;