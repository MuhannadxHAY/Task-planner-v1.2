import React, { useState, useEffect } from 'react';
import './App.css';

// Simple Button Component
const Button = ({ children, onClick, className = "", variant = "default", ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
    {children}
  </div>
);

// Simple Input Component
const Input = ({ className = "", ...props }) => (
  <input 
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

// Simple Select Component
const Select = ({ children, className = "", ...props }) => (
  <select 
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  >
    {children}
  </select>
);

// Simple Textarea Component
const Textarea = ({ className = "", ...props }) => (
  <textarea 
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Google Calendar-style Calendar Component
const GoogleCalendarView = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState('week'); // 'day', 'week', 'month'
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sample events data
  const events = [
    { id: 1, title: 'Team Standup', start: '09:00', end: '09:30', date: '2025-07-12', color: 'bg-blue-500' },
    { id: 2, title: 'JET Task List Session', start: '14:00', end: '15:00', date: '2025-07-12', color: 'bg-green-500' },
    { id: 3, title: 'August Campaign Brief', start: '15:00', end: '16:00', date: '2025-07-12', color: 'bg-yellow-500' },
    { id: 4, title: 'Client Review Meeting', start: '16:30', end: '17:30', date: '2025-07-12', color: 'bg-purple-500' },
    { id: 5, title: 'Marketing Strategy Review', start: '10:00', end: '11:00', date: '2025-07-13', color: 'bg-red-500' },
    { id: 6, title: 'Sales Office Planning', start: '14:00', end: '15:30', date: '2025-07-13', color: 'bg-indigo-500' },
    { id: 7, title: 'Community Outreach Call', start: '16:00', end: '17:00', date: '2025-07-13', color: 'bg-pink-500' },
    { id: 8, title: 'August Campaign Launch', start: '09:30', end: '10:30', date: '2025-07-14', color: 'bg-orange-500' },
    { id: 9, title: 'Content Creation Session', start: '11:00', end: '12:00', date: '2025-07-14', color: 'bg-teal-500' },
    { id: 10, title: 'Stakeholder Update', start: '15:00', end: '16:00', date: '2025-07-14', color: 'bg-cyan-500' }
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getMonthDates = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Adjust to start from Sunday
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const dates = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (currentView === 'day') {
      newDate.setDate(currentDate.getDate() + direction);
    } else if (currentView === 'week') {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else if (currentView === 'month') {
      newDate.setMonth(currentDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const renderDayView = () => (
    <div className="flex flex-col h-96 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b p-2">
        <h3 className="font-semibold text-lg">{formatDate(currentDate)}</h3>
      </div>
      <div className="flex-1">
        {timeSlots.map((time, index) => {
          const dayEvents = getEventsForDate(currentDate);
          const timeEvents = dayEvents.filter(event => event.start.startsWith(time.split(':')[0]));
          
          return (
            <div key={time} className="border-b border-gray-100 min-h-12 flex">
              <div className="w-16 text-xs text-gray-500 p-2 border-r">{time}</div>
              <div className="flex-1 p-1 relative">
                {timeEvents.map(event => (
                  <div key={event.id} className={`${event.color} text-white text-xs p-1 rounded mb-1 shadow`}>
                    <div className="font-medium">{event.title}</div>
                    <div className="opacity-90">{event.start} - {event.end}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    
    return (
      <div className="h-96 overflow-y-auto">
        <div className="grid grid-cols-8 border-b sticky top-0 bg-white">
          <div className="p-2 border-r text-xs text-gray-500">Time</div>
          {weekDates.map((date, index) => (
            <div key={index} className="p-2 border-r text-center">
              <div className="text-xs text-gray-500">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className={`text-sm font-medium ${date.toDateString() === new Date().toDateString() ? 'text-blue-600' : ''}`}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>
        
        {timeSlots.slice(8, 19).map((time, timeIndex) => (
          <div key={time} className="grid grid-cols-8 border-b min-h-12">
            <div className="p-2 border-r text-xs text-gray-500">{time}</div>
            {weekDates.map((date, dateIndex) => {
              const dayEvents = getEventsForDate(date);
              const timeEvents = dayEvents.filter(event => event.start.startsWith(time.split(':')[0]));
              
              return (
                <div key={dateIndex} className="border-r p-1 relative">
                  {timeEvents.map(event => (
                    <div key={event.id} className={`${event.color} text-white text-xs p-1 rounded mb-1 shadow`}>
                      <div className="font-medium truncate">{event.title}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const monthDates = getMonthDates(currentDate);
    const weeks = [];
    
    for (let i = 0; i < monthDates.length; i += 7) {
      weeks.push(monthDates.slice(i, i + 7));
    }
    
    return (
      <div className="h-96">
        <div className="grid grid-cols-7 border-b bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 border-r">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-rows-6 h-80">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 border-b">
              {week.map((date, dateIndex) => {
                const dayEvents = getEventsForDate(date);
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div key={dateIndex} className="border-r p-1 min-h-16 overflow-hidden">
                    <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1 mt-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div key={event.id} className={`${event.color} text-white text-xs p-1 rounded truncate`}>
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="HAY Calendar" size="xl">
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigateDate(-1)} className="px-2 py-1">
                ←
              </Button>
              <Button variant="outline" onClick={() => navigateDate(1)} className="px-2 py-1">
                →
              </Button>
              <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="text-sm">
                Today
              </Button>
            </div>
            
            <h2 className="text-xl font-semibold">
              {currentView === 'month' ? formatMonth(currentDate) : formatDate(currentDate)}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant={currentView === 'day' ? 'default' : 'outline'} 
              onClick={() => setCurrentView('day')}
              className="text-sm"
            >
              Day
            </Button>
            <Button 
              variant={currentView === 'week' ? 'default' : 'outline'} 
              onClick={() => setCurrentView('week')}
              className="text-sm"
            >
              Week
            </Button>
            <Button 
              variant={currentView === 'month' ? 'default' : 'outline'} 
              onClick={() => setCurrentView('month')}
              className="text-sm"
            >
              Month
            </Button>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="border rounded-lg">
          {currentView === 'day' && renderDayView()}
          {currentView === 'week' && renderWeekView()}
          {currentView === 'month' && renderMonthView()}
        </div>

        {/* Google Calendar Integration Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">🔗 Google Calendar Integration</h3>
          <p className="text-sm text-blue-800 mb-3">
            To connect your real Google Calendar events, you'll need to set up Google Calendar API credentials.
          </p>
          <div className="space-y-2 text-sm text-blue-700">
            <p><strong>Step 1:</strong> Go to Google Cloud Console and create a new project</p>
            <p><strong>Step 2:</strong> Enable the Google Calendar API</p>
            <p><strong>Step 3:</strong> Create credentials (API key or OAuth 2.0)</p>
            <p><strong>Step 4:</strong> Add the credentials to your environment variables</p>
          </div>
          <Button variant="outline" className="mt-3 text-sm">
            <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
              Open Google Cloud Console
            </a>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Add Task Modal Component
const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'important',
    deadline: '',
    estimatedHours: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskData.title.trim()) {
      onAddTask(taskData);
      setTaskData({
        title: '',
        description: '',
        priority: 'important',
        deadline: '',
        estimatedHours: ''
      });
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setTaskData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Priority Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <Input
            value={taskData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Finalize August campaign assets"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            value={taskData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the task details and objectives..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority Level
          </label>
          <Select
            value={taskData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option value="critical">Critical</option>
            <option value="important">Important</option>
            <option value="normal">Normal</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deadline
          </label>
          <Input
            type="date"
            value={taskData.deadline}
            onChange={(e) => handleChange('deadline', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Hours
          </label>
          <Input
            type="number"
            value={taskData.estimatedHours}
            onChange={(e) => handleChange('estimatedHours', e.target.value)}
            placeholder="e.g., 8"
            min="1"
            max="100"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1">
            Add Task
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Fixed Gemini AI Integration with correct model name
const useGeminiAI = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('API Key check:', apiKey ? 'Present' : 'Missing');
    setIsConnected(!!apiKey);
    setDebugInfo(apiKey ? `API Key: ${apiKey.substring(0, 10)}...` : 'No API Key');
  }, []);

  const sendMessage = async (message) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return "❌ API Key not found. Please check your environment variables.";
    }

    setIsLoading(true);
    
    try {
      console.log('Sending request to Gemini API...');
      
      const requestBody = {
        contents: [{
          parts: [{
            text: `You are an AI productivity coach for HAY's Marketing Director. HAY is a neighborhood development company focused on human-centric, community-oriented projects. Current projects include:

1. August digital campaign (critical deadline Aug 1-2) - comprehensive digital marketing for neighborhood showcase
2. Sales office customer journey (critical, 2 weeks) - design complete customer experience  
3. November event planning (important, Oct 15) - community engagement event

Context: You understand HAY's "soft developer" positioning, focusing on community building rather than just construction. Provide strategic, actionable advice for marketing and productivity.

User message: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };

      console.log('Request body:', requestBody);

      // Fixed: Use correct model name for Gemini 1.5 Flash
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        return `❌ API Error (${response.status}): ${errorText.substring(0, 200)}...`;
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        return `❌ API Error: ${data.error.message}`;
      } else {
        return "❌ Unexpected response format from API. Please try again.";
      }
    } catch (error) {
      console.error('Network/Fetch Error:', error);
      return `❌ Network Error: ${error.message}. Please check your internet connection.`;
    } finally {
      setIsLoading(false);
    }
  };

  return { isConnected, isLoading, sendMessage, debugInfo };
};

// Main App Component
function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Sales office customer journey",
      description: "Design and map the complete customer journey for the sales office experience",
      priority: "critical",
      deadline: "2 weeks",
      estimatedHours: "8h"
    },
    {
      id: 2,
      title: "August digital campaign",
      description: "Launch comprehensive digital marketing campaign for August neighborhood showcase",
      priority: "critical",
      deadline: "Aug 1-2",
      estimatedHours: "12h"
    },
    {
      id: 3,
      title: "November event planning",
      description: "Plan and coordinate the November community engagement event",
      priority: "important",
      deadline: "Oct 15",
      estimatedHours: "15h"
    }
  ]);

  const { isConnected, isLoading, sendMessage, debugInfo } = useGeminiAI();

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = currentMessage;
    setCurrentMessage('');
    
    // Add user message
    setChatMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleTimeString()
    }]);

    // Get AI response
    const aiResponse = await sendMessage(userMessage);
    
    // Add AI response
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: aiResponse,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: tasks.length + 1,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      deadline: taskData.deadline || 'TBD',
      estimatedHours: taskData.estimatedHours ? `${taskData.estimatedHours}h` : 'TBD'
    };
    
    setTasks(prev => [...prev, newTask]);
    
    // Send AI feedback about the new task
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: `Great! I see you've added "${taskData.title}" as a ${taskData.priority} priority task. This aligns well with HAY's strategic objectives. I recommend time-blocking dedicated focus periods for this task and considering how it supports your "soft developer" brand positioning. Would you like me to help you break this down into smaller, actionable steps?`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testAPI = async () => {
    const testResponse = await sendMessage("Test connection - provide a brief productivity tip for HAY's marketing director");
    setChatMessages([{
      type: 'ai',
      content: testResponse,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'border-red-500';
      case 'important': return 'border-yellow-500';
      default: return 'border-blue-500';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'important': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">HAY</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Productivity Dashboard</h1>
                <p className="text-sm text-gray-500">Enhanced with AI Coaching & Google Calendar</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm cursor-pointer ${
                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`} onClick={() => setShowDebug(!showDebug)}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{isConnected ? 'Gemini AI Connected' : 'AI Offline'}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
          {showDebug && (
            <div className="pb-4">
              <div className="bg-gray-100 p-3 rounded text-sm">
                <strong>Debug Info:</strong> {debugInfo}
                <br />
                <Button onClick={testAPI} className="mt-2 text-xs" variant="outline">Test API Connection</Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Items</p>
                <p className="text-3xl font-bold text-red-600">{tasks.filter(t => t.priority === 'critical').length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Calendar Events</p>
                <p className="text-3xl font-bold text-purple-600">10</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Est. Hours</p>
                <p className="text-3xl font-bold text-green-600">51h</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Priority Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Priority Tasks</h2>
              <Button variant="outline" className="text-sm" onClick={() => setShowAddTask(true)}>
                Add Task
              </Button>
            </div>
            
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)} pl-4 py-2`}>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadgeColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500">{task.deadline}</span>
                    <span className="text-xs text-gray-500">{task.estimatedHours}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Coach */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900">AI Productivity Coach</h2>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Gemini AI</span>
              </div>
              <Button onClick={() => setShowChat(!showChat)}>
                {showChat ? 'Close Chat' : 'Open Chat'}
              </Button>
            </div>

            {!showChat ? (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Focus Reminder:</strong> You have {tasks.filter(t => t.priority === 'critical').length} critical deadlines this week. Consider time-blocking your calendar for deep work sessions.
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Progress Update:</strong> Great job completing the Lemonade agency meeting! Next up: JET task list preparation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Chat Messages */}
                <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>👋 Hello! I'm your AI productivity coach.</p>
                      <p className="text-sm mt-2">I understand your role as Marketing Director at HAY and your current projects. How can I help you optimize your productivity today?</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p className="text-xs opacity-75 mt-1">{msg.timestamp}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                        <p className="text-sm">Thinking...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about priorities, scheduling, task breakdown..."
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !currentMessage.trim()}
                  >
                    Send
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
            <Button variant="outline" onClick={() => setShowCalendar(true)}>
              📅 Open Google Calendar View
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Team Standup</h3>
                <p className="text-sm text-gray-600">09:00 - 09:30</p>
              </div>
              <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">completed</span>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">JET Task List Session</h3>
                <p className="text-sm text-gray-600">14:00 - 15:00</p>
              </div>
              <span className="px-2 py-1 bg-blue-200 text-blue-700 text-xs rounded-full">current</span>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">August Campaign Brief</h3>
                <p className="text-sm text-gray-600">15:00 - 16:00</p>
              </div>
              <span className="px-2 py-1 bg-yellow-200 text-yellow-700 text-xs rounded-full">upcoming</span>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Client Review Meeting</h3>
                <p className="text-sm text-gray-600">16:30 - 17:30</p>
              </div>
              <span className="px-2 py-1 bg-yellow-200 text-yellow-700 text-xs rounded-full">upcoming</span>
            </div>
          </div>
        </Card>
      </main>

      {/* Modals */}
      <GoogleCalendarView isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
      <AddTaskModal 
        isOpen={showAddTask} 
        onClose={() => setShowAddTask(false)} 
        onAddTask={handleAddTask}
      />
    </div>
  );
}

export default App;

