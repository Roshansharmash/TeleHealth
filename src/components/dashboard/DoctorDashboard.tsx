import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileText, Calendar, MessageSquare, Video, User } from 'lucide-react';

// DUMMY DATA
const user = { name: 'Bob Taylor' };

const todayStats = [
  { label: 'Appointments Today', value: '8' },
  { label: 'New Patients', value: '3' },
  { label: 'Pending Reports', value: '5' },
];

const patientList = [
  { id: '1', name: 'Alice Johnson', time: '10:00 AM', status: 'Confirmed', type: 'Follow-up' },
  { id: '2', name: 'Bob Smith', time: '11:30 AM', status: 'Checked In', type: 'New Patient' },
  { id: '3', name: 'Carol White', time: '1:15 PM', status: 'Confirmed', type: 'Consultation' },
  { id: '4', name: 'David Brown', time: '3:00 PM', status: 'Confirmed', type: 'Follow-up' },
];

const DoctorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Welcome back, Dr. {user.name.split(' ')[1]}</CardTitle>
              <CardDescription>
                Here's your schedule and patient information for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {todayStats.map((stat, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientList.map((patient) => (
                  <div 
                    key={patient.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="h-10 w-10 rounded-full bg-telehealth-accent flex items-center justify-center">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <p className="text-xs text-gray-500">{patient.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{patient.time}</p>
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          patient.status === 'Checked In' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {patient.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/doctor/schedule">View Full Schedule</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="w-full lg:w-80 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild className="w-full bg-telehealth-primary hover:bg-telehealth-secondary">
                  <Link to="/consultations/start">
                    <Video className="mr-2 h-4 w-4" /> Start Consultation
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/doctor/prescriptions">
                    <FileText className="mr-2 h-4 w-4" /> Write Prescription
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/doctor/patient-records">
                    <FileText className="mr-2 h-4 w-4" /> Access Records
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Doctor Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard">
                    <User className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/doctor/schedule">
                    <Calendar className="mr-2 h-4 w-4" /> Schedule
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/doctor/messages">
                    <MessageSquare className="mr-2 h-4 w-4" /> Messages
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">You have 3 unread messages</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/doctor/messages">View Messages</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
