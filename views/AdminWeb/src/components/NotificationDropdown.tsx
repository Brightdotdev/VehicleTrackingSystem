import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon, Car, User, Clock, CheckIcon, XIcon } from 'lucide-react';
import { mockApiService } from '../lib/mockData';
import type { PendingDispatchRequest } from '../lib/mockData';

interface NotificationDropdownProps {
  className?: string;
  style?: React.CSSProperties;
}

// Dummy notifications for placeholder
const dummyNotifications = [
  {
    id: 'dummy-1',
    vehicleName: 'Toyota Camry',
    requesterName: 'User123',
    time: '3 minutes ago',
    priority: 'medium' as const,
    reason: 'Transport to client meeting'
  }
];

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  className = '',
  style = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PendingDispatchRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      // TODO: Replace with real-time notifications from backend when available
      const requests = await mockApiService.getPendingDispatchRequests();
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchPendingRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle accept/reject dispatch request
  const handleDispatchAction = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      setProcessingRequest(requestId);
      
      // TODO: Add logic to remove notifications once accepted/rejected
      const success = await mockApiService.updateDispatchRequestStatus(requestId, action);
      
      if (success) {
        setPendingRequests(prev => prev.filter(req => req.id !== requestId));
        showToast(action === 'approved' ? 'Dispatch accepted' : 'Dispatch rejected');
      }
    } catch (error) {
      console.error(`Error ${action} dispatch:`, error);
      showToast(`Failed to ${action} dispatch`);
    } finally {
      setProcessingRequest(null);
    }
  };

  // Simple toast notification
  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const notificationCount = pendingRequests.length;

  return (
    <div ref={dropdownRef} className={className} style={{ position: 'relative', ...style }}>
      {/* Notification Bell Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "#484848",
          border: "none",
          borderRadius: "50%",
          width: 62,
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={notificationCount > 0 ? {
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 5 }
        } : {}}
      >
        <BellIcon size={32} color="#fff" />
        
        {/* Notification Badge */}
        {notificationCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              background: "#ef4444",
              color: "white",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: "bold",
              border: "2px solid #fff",
            }}
          >
            {notificationCount > 99 ? '99+' : notificationCount}
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: 8,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              border: "1px solid #e5e7eb",
              width: 420,
              maxHeight: 500,
              overflow: "hidden",
              zIndex: 1000,
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#111827",
                }}>
                  Notifications
                </h3>
                {notificationCount > 0 && (
                  <span style={{
                    background: "#ef4444",
                    color: "white",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {notificationCount}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {loading ? (
                <div style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#6b7280",
                }}>
                  Loading notifications...
                </div>
              ) : pendingRequests.length === 0 ? (
                <div style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#6b7280",
                }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>You're all caught up!</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, opacity: 0.7 }}>No new notifications</p>
                </div>
              ) : (
                pendingRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid #f3f4f6",
                      background: "white",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                  >
                    {/* Request Header */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 12,
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: 12,
                      }}>
                        <span style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: getPriorityColor(request.priority),
                          textTransform: "uppercase",
                          background: `${getPriorityColor(request.priority)}20`,
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}>
                          {request.priority}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 12,
                        color: "#6b7280",
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                      }}>
                        <Clock size={12} style={{ marginRight: 4 }} />
                        {formatTimeAgo(request.requestTime)}
                      </span>
                    </div>

                    {/* Vehicle Info */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 8,
                    }}>
                      {request.vehicleImageUrl && (
                        <img
                          src={request.vehicleImageUrl}
                          alt={request.vehicleName}
                          style={{
                            width: 40,
                            height: 24,
                            borderRadius: 4,
                            objectFit: "cover",
                            marginRight: 12,
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 4,
                        }}>
                          <Car size={16} color="#6b7280" style={{ marginRight: 6 }} />
                          <span style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#111827",
                          }}>
                            {request.vehicleName}
                          </span>
                        </div>
                        {request.reason && (
                          <p style={{
                            margin: 0,
                            fontSize: 13,
                            color: "#6b7280",
                            lineHeight: 1.4,
                          }}>
                            {request.reason}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Requester Info */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 16,
                    }}>
                      {request.requesterImage && (
                        <img
                          src={request.requesterImage}
                          alt={request.requesterName}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            marginRight: 8,
                          }}
                        />
                      )}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                      }}>
                        <User size={14} color="#6b7280" style={{ marginRight: 4 }} />
                        <span style={{
                          fontSize: 13,
                          color: "#374151",
                          fontWeight: 500,
                        }}>
                          {request.requesterName}
                        </span>
                      </div>
                      {request.estimatedDuration && (
                        <span style={{
                          fontSize: 12,
                          color: "#6b7280",
                          background: "#f3f4f6",
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}>
                          {request.estimatedDuration}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: "flex",
                      gap: 8,
                    }}>
                      <motion.button
                        onClick={() => handleDispatchAction(request.id, 'approved')}
                        disabled={processingRequest === request.id}
                        style={{
                          flex: 1,
                          background: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          padding: "8px 12px",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: processingRequest === request.id ? "not-allowed" : "pointer",
                          opacity: processingRequest === request.id ? 0.6 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                        whileHover={processingRequest === request.id ? {} : { scale: 1.02 }}
                        whileTap={processingRequest === request.id ? {} : { scale: 0.98 }}
                      >
                        <CheckIcon size={14} />
                        {processingRequest === request.id ? "Processing..." : "Accept"}
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleDispatchAction(request.id, 'rejected')}
                        disabled={processingRequest === request.id}
                        style={{
                          flex: 1,
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          padding: "8px 12px",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: processingRequest === request.id ? "not-allowed" : "pointer",
                          opacity: processingRequest === request.id ? 0.6 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                        whileHover={processingRequest === request.id ? {} : { scale: 1.02 }}
                        whileTap={processingRequest === request.id ? {} : { scale: 0.98 }}
                      >
                        <XIcon size={14} />
                        {processingRequest === request.id ? "Processing..." : "Reject"}
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Utility function to format time ago
const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

export default NotificationDropdown;
