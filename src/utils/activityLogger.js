/**
 * Activity Logger Utility
 * Manages tracking of dashboard events and persists them in localStorage.
 */

export const getRecentActivities = () => {
  try {
    const stored = localStorage.getItem('crm_recent_activities');
    if (!stored) {
      // Seed with some high-fidelity starting data
      const defaultActivities = [
        {
          id: 'mock-1',
          avatarText: 'JS',
          fullName: 'John Smith',
          action: ' added a new lead',
          timestamp: Date.now() - 15 * 60 * 1000 // 15m ago
        },
        {
          id: 'mock-2',
          avatarText: 'BK',
          fullName: 'Beth Knight',
          action: ' updated project status',
          timestamp: Date.now() - 30 * 60 * 1000 // 30m ago
        },
        {
          id: 'mock-3',
          avatarText: 'ML',
          fullName: 'Mike Lord',
          action: ' completed task',
          timestamp: Date.now() - 45 * 60 * 1000 // 45m ago
        },
        {
          id: 'mock-4',
          avatarText: 'AD',
          fullName: 'Amy Doe',
          action: ' signed in',
          timestamp: Date.now() - 60 * 60 * 1000 // 60m ago
        }
      ];
      localStorage.setItem('crm_recent_activities', JSON.stringify(defaultActivities));
      return defaultActivities;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse recent activities', e);
    return [];
  }
};

export const logActivity = (fullName, action, avatarText) => {
  try {
    const activities = getRecentActivities();
    
    // Generate avatar initials if not provided
    const initials = avatarText || fullName
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

    const newActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      avatarText: initials,
      fullName,
      action,
      timestamp: Date.now()
    };

    // Prepend and limit to 10 activities
    const updated = [newActivity, ...activities].slice(0, 10);
    localStorage.setItem('crm_recent_activities', JSON.stringify(updated));
    return newActivity;
  } catch (e) {
    console.error('Failed to log activity', e);
    return null;
  }
};

export const formatRelativeTime = (timestamp) => {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};
