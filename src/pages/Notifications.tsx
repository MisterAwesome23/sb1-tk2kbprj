import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { useAuth } from '../contexts/AuthContext';
import { getUserNotifications, markNotificationAsRead } from '../services/jobService';
import { Notification } from '../types';
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Check, Calendar } from 'lucide-react';
import { formatTimeAgo } from '../utils/dateUtils';
import { toast } from 'react-toastify';

export function Notifications() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return;
      
      try {
        const data = await getUserNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setLoadingData(false);
      }
    }

    if (!loading) {
      fetchNotifications();
    }
  }, [user, loading]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      if (unreadNotifications.length === 0) return;
      
      const promises = unreadNotifications.map(n => markNotificationAsRead(n.id));
      await Promise.all(promises);
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading || loadingData) {
    return (
      <Container>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Container>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bell className="w-8 h-8 mr-3 text-indigo-600" />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Check className="w-4 h-4 mr-1" />
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">You don't have any notifications yet.</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li 
                  key={notification.id} 
                  className={`px-6 py-5 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-indigo-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {notification.title.includes('Interview') ? 
                          <Calendar className="w-5 h-5 text-blue-500" /> : 
                          getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        <div className="mt-2 flex items-center">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(new Date(notification.created_at))}
                          </span>
                          {notification.link && (
                            <Link 
                              to={notification.link} 
                              className="ml-4 text-xs text-indigo-600 hover:text-indigo-500"
                            >
                              View details
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="ml-4 flex-shrink-0 bg-white rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Container>
  );
}