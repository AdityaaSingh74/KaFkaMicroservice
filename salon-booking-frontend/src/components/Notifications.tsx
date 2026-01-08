import { useState, useEffect } from 'react'
import { apiClient } from '../services/apiClient'
import { Notification } from '../types'

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem('userId') || '1'
      const data = await apiClient.getNotifications(userId)
      const notifList = Array.isArray(data) ? data : data.data || []
      setNotifications(notifList)
      setUnreadCount(notifList.filter((n) => !n.isRead).length)
    } catch (err) {
      console.error('Error fetching notifications:', err)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await apiClient.markNotificationAsRead(notificationId)
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      )
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const userId = localStorage.getItem('userId') || '1'
      await apiClient.markAllNotificationsAsRead(userId)
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING':
        return '🗓️'
      case 'PAYMENT':
        return '💳'
      case 'PROMOTION':
        return '🎉'
      case 'SYSTEM':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'BOOKING':
        return 'bg-blue-50 border-blue-200'
      case 'PAYMENT':
        return 'bg-green-50 border-green-200'
      case 'PROMOTION':
        return 'bg-purple-50 border-purple-200'
      case 'SYSTEM':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-slate-100 rounded-lg transition"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-slate-200 z-50">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer ${
                    notification.isRead ? '' : getNotificationColor(notification.type)
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-1">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{notification.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-600">No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
