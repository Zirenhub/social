import React from 'react';
import { Bell, MessageCircle, Heart, Users, Award } from 'lucide-react';

export default function Notifications() {
  // Notification data with different types
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: 'Alex Chen',
      content: 'liked your post',
      time: '2 min ago',
      read: false,
    },
    {
      id: 2,
      type: 'comment',
      user: 'Jamie Smith',
      content: 'commented on your photo',
      time: '15 min ago',
      read: false,
    },
    {
      id: 3,
      type: 'follow',
      user: 'Taylor Wong',
      content: 'started following you',
      time: '1 hour ago',
      read: true,
    },
    {
      id: 4,
      type: 'mention',
      user: 'Jordan Lee',
      content: 'mentioned you in a comment',
      time: '3 hours ago',
      read: true,
    },
    {
      id: 5,
      type: 'achievement',
      user: 'System',
      content: 'You reached 100 followers!',
      time: '1 day ago',
      read: true,
    },
  ];

  // Function to render the appropriate icon based on notification type
  const renderIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="text-[var(--color-magenta-500)]" size={16} />;
      case 'comment':
        return (
          <MessageCircle className="text-[var(--color-cyan-500)]" size={16} />
        );
      case 'follow':
        return <Users className="text-[var(--color-blue-500)]" size={16} />;
      case 'achievement':
        return <Award className="text-[var(--color-orange-500)]" size={16} />;
      default:
        return <Bell className="text-[var(--color-purple-500)]" size={16} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col flex-grow min-h-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="container-title">Notifications</h2>
        <span className="bg-[var(--color-cyan-500)] text-white text-xs font-medium px-2 py-1 rounded-full">
          {notifications.filter((n) => !n.read).length}
        </span>
      </div>

      <div className="space-y-2 h-full overflow-y-auto pr-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start p-3 rounded-lg transition-all duration-200 ${
              notification.read
                ? 'bg-gray-50 dark:bg-gray-800'
                : 'bg-[var(--color-cyan-500)/10] dark:bg-[var(--color-cyan-500)/20]'
            } hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}
          >
            <div className="flex-shrink-0 p-2 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
              {renderIcon(notification.type)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-lg font-['bold'] text-gray-900 dark:text-white truncate">
                {notification.user}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {notification.content}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {notification.time}
              </p>
            </div>

            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-[var(--color-cyan-500)] flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-medium text-center text-[var(--color-cyan-500)] hover:text-[var(--color-blue-500)] transition-colors duration-200">
        See all notifications
      </button>
    </div>
  );
}
