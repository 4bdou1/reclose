
export type UserRole = 'Shadow' | 'Operator' | 'Architect' | 'Admin';

// Added 'AIAnalysis' to TransactionStatus to match mock data usage
export type TransactionStatus = 'Queued' | 'Scanning' | 'Verifying' | 'IntentMatched' | 'Exported' | 'AIAnalysis';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  credits: number;
  phone?: string;
  password?: string;
}

// Added missing TransactionDocument interface
export interface TransactionDocument {
  id: string;
  filename: string;
  uploadDate: string;
  uploadedBy: string;
  type: string;
  url: string;
}

// Added missing Transaction interface
export interface Transaction {
  id: string;
  address: string;
  type: string;
  status: TransactionStatus;
  parties: string[];
  documents: TransactionDocument[];
  createdAt: string;
  updatedAt: string;
}

// Added missing ContactSubmission interface
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export interface ShadowAuditResult {
  id: string;
  domain: string;
  intentScore: number;
  growthSignals: string[];
  decisionMaker: {
    name: string;
    email: string;
    linkedin: string;
  };
  timestamp: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: TransactionStatus;
  leadCount: number;
  creditsConsumed: number;
  createdAt: string;
}