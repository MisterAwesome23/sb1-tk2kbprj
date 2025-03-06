import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { getUserNotifications } from '../services/jobService';
import { useAuth } from '../contexts/AuthContext';

export function NotificationBadge() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return;
      
      try {
        const notifications = await getUserNotifications();
        const unread = notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchNotifications();
      
      // Set up polling for new notifications
      const interval = setInterval(fetchNotifications, 60000); // Check every minute
      
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading || !user) return null;

  return (
    <Link to="/notifications" className="relative p-1 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-gray-100">
      <Bell className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}