
import { User, Transaction, TransactionDocument, ContactSubmission, UserRole, TransactionStatus } from './types';

// --- MOCK DATABASE ---
const STORAGE_KEYS = {
  USERS: 'reclose_users',
  TRANSACTIONS: 'reclose_transactions',
  CONTACTS: 'reclose_contacts'
};

// Seed Data
// Fixed missing 'credits' and updated invalid roles to match UserRole type
const SEED_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@reclose.com', role: 'Admin', password: 'password', credits: 1000000 },
  { id: '2', name: 'John Shadow', email: 'buyer@test.com', role: 'Shadow', password: 'password', credits: 500 },
  { id: '3', name: 'Jane Operator', email: 'agent@test.com', role: 'Operator', password: 'password', credits: 2500 }
];

const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    address: '123 Innovation Dr, Tech City, CA',
    type: 'Purchase',
    status: 'AIAnalysis',
    parties: ['2', '3'],
    documents: [
      { id: 'd1', filename: 'Purchase_Agreement.pdf', uploadDate: new Date().toISOString(), uploadedBy: '3', type: 'Contract', url: '#' }
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper to load/save
const db = {
  getUsers: (): User[] => {
    const s = localStorage.getItem(STORAGE_KEYS.USERS);
    return s ? JSON.parse(s) : SEED_USERS;
  },
  saveUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
  
  getTransactions: (): Transaction[] => {
    const s = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return s ? JSON.parse(s) : SEED_TRANSACTIONS;
  },
  saveTransactions: (txs: Transaction[]) => localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs)),
  
  getContacts: (): ContactSubmission[] => {
    const s = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return s ? JSON.parse(s) : [];
  },
  saveContacts: (contacts: ContactSubmission[]) => localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts))
};

// --- API SIMULATION ---

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
      await new Promise(r => setTimeout(r, 800)); // Network delay
      const users = db.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) throw new Error('Invalid credentials');
      
      // Simulate JWT
      const token = `mock-jwt-${user.id}-${Date.now()}`;
      return { user, token };
    },
    
    register: async (userData: Omit<User, 'id'>): Promise<{ user: User, token: string }> => {
      await new Promise(r => setTimeout(r, 800));
      const users = db.getUsers();
      
      if (users.find(u => u.email === userData.email)) throw new Error('Email already exists');
      
      const newUser: User = { ...userData, id: Math.random().toString(36).substr(2, 9) };
      users.push(newUser);
      db.saveUsers(users);
      
      // Send email simulation
      console.log(`[SMTP MOCK] Sending welcome email to ${userData.email} from contactus@reclosehpf.com`);
      
      return { user: newUser, token: `mock-jwt-${newUser.id}` };
    }
  },

  transactions: {
    list: async (userId: string, role: string): Promise<Transaction[]> => {
      await new Promise(r => setTimeout(r, 500));
      const all = db.getTransactions();
      if (role === 'Admin') return all;
      return all.filter(t => t.parties.includes(userId));
    },

    create: async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'documents'>): Promise<Transaction> => {
      await new Promise(r => setTimeout(r, 800));
      const txs = db.getTransactions();
      const newTx: Transaction = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      txs.push(newTx);
      db.saveTransactions(txs);
      return newTx;
    },

    uploadDocument: async (txId: string, file: File, userId: string): Promise<TransactionDocument> => {
      await new Promise(r => setTimeout(r, 1000)); // Upload delay
      const txs = db.getTransactions();
      const txIndex = txs.findIndex(t => t.id === txId);
      if (txIndex === -1) throw new Error('Transaction not found');

      const doc: TransactionDocument = {
        id: Math.random().toString(36).substr(2, 9),
        filename: file.name,
        uploadDate: new Date().toISOString(),
        uploadedBy: userId,
        type: 'Uploaded Document', // simplification
        url: URL.createObjectURL(file) // Local blob url
      };

      txs[txIndex].documents.push(doc);
      txs[txIndex].updatedAt = new Date().toISOString();
      db.saveTransactions(txs);
      return doc;
    },
    
    updateStatus: async (txId: string, status: TransactionStatus): Promise<void> => {
      await new Promise(r => setTimeout(r, 500));
      const txs = db.getTransactions();
      const tx = txs.find(t => t.id === txId);
      if (tx) {
        tx.status = status;
        tx.updatedAt = new Date().toISOString();
        db.saveTransactions(txs);
      }
    }
  },

  contact: {
    submit: async (data: Omit<ContactSubmission, 'id' | 'timestamp'>): Promise<void> => {
      await new Promise(r => setTimeout(r, 600));
      const contacts = db.getContacts();
      contacts.push({ ...data, id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString() });
      db.saveContacts(contacts);
      
      console.log(`[SMTP MOCK] Forwarding contact form to contactus@reclosehpf.com: `, data);
    }
  }
};