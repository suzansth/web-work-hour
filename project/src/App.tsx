import React, { useState, useEffect } from 'react';
import { Clock, Building, JapaneseYen, Calendar as CalendarIcon, BarChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

interface TimeEntry {
  id: string;
  date: string;
  companyName: string;
  hours: number;
  hourlyWage: number;
  totalIncome: number;
}

function App() {
  const [entries, setEntries] = useState<TimeEntry[]>(() => {
    const saved = localStorage.getItem('timeEntries');
    return saved ? JSON.parse(saved) : [];
  });
  const [companyName, setCompanyName] = useState('');
  const [hours, setHours] = useState('');
  const [hourlyWage, setHourlyWage] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'graph' | 'calendar'>('list');

  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalIncome = parseFloat(hours) * parseFloat(hourlyWage);
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      companyName,
      hours: parseFloat(hours),
      hourlyWage: parseFloat(hourlyWage),
      totalIncome
    };
    setEntries([...entries, newEntry]);
    setCompanyName('');
    setHours('');
    setHourlyWage('');
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const totalIncome = entries.reduce((acc, entry) => acc + entry.totalIncome, 0);
  const totalHours = entries.reduce((acc, entry) => acc + entry.hours, 0);

  const calendarEvents = entries.map(entry => ({
    title: `${entry.companyName} - ${entry.hours}hrs`,
    date: entry.date,
    extendedProps: {
      income: entry.totalIncome
    }
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
            <Clock className="mr-2" /> Work Hour & Income Tracker
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  step="0.5"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Wage (¥)</label>
              <div className="relative">
                <JapaneseYen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  step="1"
                  min="0"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Add Entry
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Total Hours Worked</h2>
              <p className="text-3xl font-bold text-blue-900">{totalHours.toFixed(2)} hours</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Total Income</h2>
              <p className="text-3xl font-bold text-green-900">¥{totalIncome.toFixed(0)}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveView('list')}
              className={`px-4 py-2 rounded-md ${
                activeView === 'list' ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveView('graph')}
              className={`px-4 py-2 rounded-md ${
                activeView === 'graph' ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Graph View
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`px-4 py-2 rounded-md ${
                activeView === 'calendar' ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Calendar View
            </button>
          </div>

          {activeView === 'list' && (
            <div className="space-y-4">
              {entries.map(entry => (
                <div key={entry.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{entry.companyName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString()} - {entry.hours} hours @ ¥{entry.hourlyWage}/hr
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-green-600">¥{entry.totalIncome.toFixed(0)}</span>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeView === 'graph' && (
            <div className="h-96">
              <LineChart
                width={800}
                height={400}
                data={entries}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="hours"
                  stroke="#3B82F6"
                  name="Hours"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalIncome"
                  stroke="#10B981"
                  name="Income (¥)"
                />
              </LineChart>
            </div>
          )}

          {activeView === 'calendar' && (
            <div className="h-[600px]">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                eventContent={(eventInfo) => (
                  <div className="p-1">
                    <div className="text-xs font-semibold">{eventInfo.event.title}</div>
                    <div className="text-xs">¥{eventInfo.event.extendedProps.income.toFixed(0)}</div>
                  </div>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;