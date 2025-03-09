export type StatusType = 'operational' | 'degraded' | 'outage';

export interface SystemComponent {
  id: string;
  name: string;
  status: StatusType;
  updatedAt: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  createdAt: string;
  updatedAt: string;
  affectedComponents: string[];
  componentStatuses?: Record<string, StatusType>;
  methodsAffected?: {
    payin?: string[];
    payout?: string[];
  };
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  message: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  createdAt: string;
}

// Mock system components
export const initialComponents: SystemComponent[] = [
  {
    id: '1',
    name: 'API',
    status: 'operational',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Agent Panel',
    status: 'operational',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Database',
    status: 'operational',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Methods',
    status: 'operational',
    updatedAt: new Date().toISOString(),
  }
];

// Mock incidents
export const initialIncidents: Incident[] = [
  {
    id: '1',
    title: 'API Performance Degradation',
    description: 'We are experiencing slow response times in our API.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    affectedComponents: ['1'],
    updates: [
      {
        id: '1-1',
        message: 'We are investigating reports of API slowness.',
        status: 'investigating',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '1-2',
        message: 'We identified the root cause as a database query optimization issue.',
        status: 'identified',
        createdAt: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '1-3',
        message: 'The issue has been resolved and we are monitoring performance.',
        status: 'resolved',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '2',
    title: 'Scheduled Maintenance',
    description: 'We will be performing scheduled maintenance on our systems.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), // 13 days ago
    affectedComponents: ['1', '2', '3', '4', '5'],
    updates: [
      {
        id: '2-1',
        message: 'Scheduled maintenance will begin in 1 hour.',
        status: 'investigating',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2-2',
        message: 'Maintenance is now complete. All systems are operational.',
        status: 'resolved',
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

// Mock user for authentication
export const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password123', // In a real app, this would be hashed
    name: 'Admin User',
    role: 'admin',
  },
];

// Helper functions for status
export const getOverallStatus = (components: SystemComponent[]): StatusType => {
  if (components.some(component => component.status === 'outage')) {
    return 'outage';
  }
  if (components.some(component => component.status === 'degraded')) {
    return 'degraded';
  }
  return 'operational';
};

export const getStatusText = (status: StatusType): string => {
  switch (status) {
    case 'operational':
      return 'All Systems Operational';
    case 'degraded':
      return 'Partial System Outage';
    case 'outage':
      return 'Major System Outage';
    default:
      return 'Unknown Status';
  }
};

export const getStatusColor = (status: StatusType): string => {
  switch (status) {
    case 'operational':
      return 'bg-status-operational';
    case 'degraded':
      return 'bg-status-degraded';
    case 'outage':
      return 'bg-status-outage';
    default:
      return 'bg-gray-400';
  }
};
