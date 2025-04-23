
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// DUMMY DATA
const user = { name: 'John Doe' };

const healthMetrics = [
  { label: 'Heart Rate', value: '72 bpm', trend: 'stable' },
  { label: 'Blood Pressure', value: '120/80', trend: 'stable' },
  { label: 'Last Check-up', value: '2 weeks ago', trend: 'n/a' },
];

const quickActions = [
  { title: 'Find a Doctor', icon: '👨‍⚕️', link: '/find-doctor', description: 'Search for specialists' },
  { title: 'Book Appointment', icon: '📅', link: '/appointments/new', description: 'Schedule your next visit' },
  { title: 'Video Consult', icon: '📹', link: '/consultations/start', description: 'Talk to a doctor now' },
  { title: 'Medical Records', icon: '📄', link: '/medical-records', description: 'View your history' },
];

const dummyUpcoming = [
  { id: 'a1', date: '2025-04-30', time: '10:00 AM', doctor: 'Dr. Alice Rider', type: 'Video', status: 'Scheduled' },
  { id: 'a2', date: '2025-05-04', time: '3:30 PM', doctor: 'Dr. Bob Smith', type: 'In-Person', status: 'Scheduled' },
];

const PatientDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-6">
          <Card className="animate-fade-in dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="dark:text-gray-100">Welcome back, {user.name}</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Here's a summary of your health and upcoming appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {healthMetrics.map((metric, index) => (
                  <div 
                    key={index} 
                    className="p-4 border rounded-lg bg-telehealth-light shadow-sm hover:shadow-md transition-all duration-200 animate-scale-in dark:bg-gray-700 dark:border-gray-600"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <p className="text-sm text-telehealth-gray dark:text-gray-300">{metric.label}</p>
                    <p className="text-2xl font-semibold text-telehealth-primary dark:text-telehealth-accent">{metric.value}</p>
                    <p className="text-xs text-telehealth-secondary mt-1 dark:text-gray-300">
                      {metric.trend === 'stable' ? 'Stable' : metric.trend === 'up' ? 'Increased' : metric.trend === 'down' ? 'Decreased' : 'No data'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-in-left dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="dark:text-gray-100">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link 
                    key={index} 
                    to={action.link} 
                    className="no-underline"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-telehealth-light hover:border-telehealth-primary transition-all duration-200 text-center h-full animate-scale-in dark:border-gray-600 dark:hover:bg-gray-700">
                      <span className="text-3xl mb-2">{action.icon}</span>
                      <h3 className="text-sm font-medium text-telehealth-dark dark:text-gray-200">{action.title}</h3>
                      <p className="text-xs text-telehealth-gray dark:text-gray-400 mt-1">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-80 animate-slide-in-right">
          <Card className="dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg dark:text-gray-100">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {dummyUpcoming.map((item) => (
                  <div key={item.id} className="mb-4 p-4 border rounded-lg flex flex-col dark:border-gray-700 dark:bg-gray-900">
                    <span className="font-semibold dark:text-telehealth-accent">{item.doctor}</span>
                    <div className="flex justify-between items-center text-xs mt-1">
                      <span className="text-gray-400">{item.date} {item.time}</span>
                      <span className={`rounded-md px-2 py-1 ${item.status === "Scheduled" ? "bg-blue-800 text-white" : "bg-gray-300"}`}>{item.status}</span>
                    </div>
                    <span className="text-xs mt-1 text-gray-400">{item.type} appointment</span>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full mt-4 border-telehealth-primary text-telehealth-primary hover:bg-telehealth-light dark:text-telehealth-accent dark:border-telehealth-accent dark:hover:bg-gray-700">
                  <Link to="/appointments/new">Book New Appointment</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
