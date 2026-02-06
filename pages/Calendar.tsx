import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Plus, Clock, User, Video,
  ChevronLeft, ChevronRight, Loader2, X, Trash2
} from 'lucide-react';
import { supabase, Meeting, API_URL } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      checkGoogleConnection();
      fetchMeetings();
    }
  }, [user]);

  const checkGoogleConnection = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google/status?user_id=${user?.id}`);
      const data = await res.json();
      setGoogleConnected(data.connected);
      if (data.connected) {
        fetchGoogleEvents();
      }
    } catch (error) {
      console.error('Error checking Google connection:', error);
    }
  };

  const fetchMeetings = async () => {
    try {
      const { data } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user?.id)
        .order('start_time', { ascending: true });
      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoogleEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/calendar/events?user_id=${user?.id}`);
      const data = await res.json();
      setGoogleEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching Google events:', error);
    }
  };

  const connectGoogle = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google/login?user_id=${user?.id}`);
      const data = await res.json();
      window.location.href = data.authorization_url;
    } catch (error) {
      toast.error('Failed to connect Google Calendar');
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add padding days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getMeetingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return meetings.filter(m => m.start_time.startsWith(dateStr));
  };

  const getGoogleEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return googleEvents.filter(e => {
      const eventDate = e.start?.dateTime || e.start?.date;
      return eventDate?.startsWith(dateStr);
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="calendar-page" className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-[Manrope]">Calendar</h1>
          <p className="text-gray-500 mt-1">Manage meetings booked by your AI</p>
        </div>
        <div className="flex items-center gap-3">
          {!googleConnected ? (
            <button
              onClick={connectGoogle}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              <CalendarIcon className="w-5 h-5" />
              Connect Google Calendar
            </button>
          ) : (
            <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-sm">
              <CalendarIcon className="w-4 h-4" />
              Google Connected
            </span>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C5A059] text-black rounded-xl font-medium hover:bg-[#C5A059]/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Meeting
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-white">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-white/5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {getDaysInMonth(currentDate).map((date, idx) => (
            <div
              key={idx}
              onClick={() => date && setSelectedDate(date)}
              className={`min-h-[100px] p-2 border-b border-r border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                date && isToday(date) ? 'bg-[#C5A059]/5' : ''
              }`}
            >
              {date && (
                <>
                  <span className={`text-sm font-medium ${
                    isToday(date) ? 'text-[#C5A059]' : 'text-gray-400'
                  }`}>
                    {date.getDate()}
                  </span>
                  <div className="mt-1 space-y-1">
                    {getMeetingsForDate(date).slice(0, 2).map(meeting => (
                      <div
                        key={meeting.id}
                        className="px-2 py-1 rounded bg-[#C5A059]/10 text-[#C5A059] text-[10px] truncate"
                      >
                        {meeting.title}
                      </div>
                    ))}
                    {getGoogleEventsForDate(date).slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] truncate"
                      >
                        {event.summary}
                      </div>
                    ))}
                    {(getMeetingsForDate(date).length + getGoogleEventsForDate(date).length) > 2 && (
                      <div className="text-[10px] text-gray-500">
                        +{getMeetingsForDate(date).length + getGoogleEventsForDate(date).length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Agenda */}
      <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Today's Agenda</h3>
        {getMeetingsForDate(new Date()).length === 0 && getGoogleEventsForDate(new Date()).length === 0 ? (
          <p className="text-gray-500 text-sm">No meetings scheduled for today</p>
        ) : (
          <div className="space-y-3">
            {[...getMeetingsForDate(new Date()), ...getGoogleEventsForDate(new Date())].map((event, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 flex items-center justify-center">
                  <Video className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">{event.title || event.summary}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(event.start_time || event.start?.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {event.attendee_name && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {event.attendee_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <CreateMeetingModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            fetchMeetings();
            if (googleConnected) fetchGoogleEvents();
            setShowCreateModal(false);
          }}
          userId={user?.id || ''}
          googleConnected={googleConnected}
        />
      )}
    </div>
  );
};

// Create Meeting Modal Component
const CreateMeetingModal: React.FC<{
  onClose: () => void;
  onCreated: () => void;
  userId: string;
  googleConnected: boolean;
}> = ({ onClose, onCreated, userId, googleConnected }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeeName, setAttendeeName] = useState('');
  const [syncToGoogle, setSyncToGoogle] = useState(googleConnected);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title || !date || !startTime || !endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const startDateTime = new Date(`${date}T${startTime}:00`).toISOString();
      const endDateTime = new Date(`${date}T${endTime}:00`).toISOString();

      // Save to Supabase
      const { error } = await supabase.from('meetings').insert({
        user_id: userId,
        title,
        start_time: startDateTime,
        end_time: endDateTime,
        attendee_email: attendeeEmail || null,
        attendee_name: attendeeName || null,
        status: 'scheduled'
      });

      if (error) throw error;

      // Sync to Google Calendar if connected
      if (syncToGoogle && googleConnected) {
        await fetch(`${API_URL}/api/calendar/events?user_id=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            start: startDateTime,
            end: endDateTime,
            attendee_email: attendeeEmail || null,
            attendee_name: attendeeName || null
          })
        });
      }

      toast.success('Meeting created');
      onCreated();
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">New Meeting</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C5A059]/50"
              placeholder="Meeting with..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C5A059]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Start Time *</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C5A059]/50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">End Time *</label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C5A059]/50"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Attendee Name</label>
            <input
              type="text"
              value={attendeeName}
              onChange={e => setAttendeeName(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C5A059]/50"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Attendee Email</label>
            <input
              type="email"
              value={attendeeEmail}
              onChange={e => setAttendeeEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C5A059]/50"
              placeholder="john@example.com"
            />
          </div>
          
          {googleConnected && (
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={syncToGoogle}
                onChange={e => setSyncToGoogle(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-black/40"
              />
              <span className="text-sm text-gray-400">Sync to Google Calendar</span>
            </label>
          )}
        </div>
        
        <div className="px-6 py-4 border-t border-white/5">
          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full py-3 bg-[#C5A059] text-black rounded-xl font-medium hover:bg-[#C5A059]/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Create Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
