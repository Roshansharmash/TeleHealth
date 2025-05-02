import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mail } from 'lucide-react';
import { format } from 'date-fns';

// Dummy data for messages
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

interface MessagesListProps {
  selectedMessageId: string | null;
  onSelectMessage: (id: string) => void;
}

const MessagesList = ({ selectedMessageId, onSelectMessage }: MessagesListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMessages = DUMMY_MESSAGES.filter(message => 
    message.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const unreadCount = DUMMY_MESSAGES.filter(message => !message.isRead).length;
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="font-medium text-gray-800">Messages</div>
          {unreadCount > 0 && (
            <Badge className="bg-telehealth-primary">{unreadCount} Unread</Badge>
          )}
        </div>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-10 bg-white border-gray-300 text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 mb-4">
          <Button variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-100">
            All
          </Button>
          <Button variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-100">
            Unread
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {filteredMessages.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredMessages.map(message => (
              <div
                key={message.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedMessageId === message.id 
                    ? 'bg-telehealth-primary/20 border-l-4 border-telehealth-primary' 
                    : 'hover:bg-gray-100'
                } ${!message.isRead ? 'font-semibold' : ''}`}
                onClick={() => onSelectMessage(message.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {!message.isRead && (
                      <div className="h-2 w-2 rounded-full bg-telehealth-primary mr-2"></div>
                    )}
                    <h3 className={`text-sm ${!message.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                      {message.patientName}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(message.timestamp, 'MMM d')}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-gray-800 mt-1">{message.subject}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {message.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Mail className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">No messages found</p>
            <p className="text-sm text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search term'
                : 'Messages from patients will appear here'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Missing Badge component, let's define it
const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`px-2 py-1 text-xs rounded-full text-white ${className}`}>
    {children}
  </span>
);

export default MessagesList;