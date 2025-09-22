import { v4 as uuidv4 } from 'uuid';

export interface Order {
  id: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

export interface UPIAttempt {
  id: string;
  orderId: string;
  amount: number;
  payerVPA: string;
  status: 'offline' | 'pending' | 'success' | 'failed';
  provisionalTxnId: string;
  createdAt: string;
  reconciledAt?: string;
}

class OfflineEngine {
  private orders: Order[] = [];
  private upiAttempts: UPIAttempt[] = [];
  private offlineQueue: UPIAttempt[] = [];
  private isOnline = true;

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('smartupi_orders', JSON.stringify(this.orders));
      localStorage.setItem('smartupi_attempts', JSON.stringify(this.upiAttempts));
      localStorage.setItem('smartupi_offline_queue', JSON.stringify(this.offlineQueue));
      localStorage.setItem('smartupi_online_status', JSON.stringify(this.isOnline));
      console.log('Data saved to localStorage');
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const savedOrders = localStorage.getItem('smartupi_orders');
      const savedAttempts = localStorage.getItem('smartupi_attempts');
      const savedQueue = localStorage.getItem('smartupi_offline_queue');
      const savedOnlineStatus = localStorage.getItem('smartupi_online_status');

      if (savedOrders) {
        this.orders = JSON.parse(savedOrders);
      }
      if (savedAttempts) {
        this.upiAttempts = JSON.parse(savedAttempts);
      }
      if (savedQueue) {
        this.offlineQueue = JSON.parse(savedQueue);
      }
      if (savedOnlineStatus) {
        this.isOnline = JSON.parse(savedOnlineStatus);
      }
      
      console.log('Data loaded from localStorage:', {
        orders: this.orders.length,
        attempts: this.upiAttempts.length,
        offlineQueue: this.offlineQueue.length,
        isOnline: this.isOnline
      });
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }

  // Order management
  createOrder(customerName: string, amount: number): Order {
    const order: Order = {
      id: uuidv4(),
      customerName,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.orders.push(order);
    this.saveToStorage();
    return order;
  }

  getOrders(): Order[] {
    return [...this.orders];
  }

  getOrder(id: string): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  // UPI payment simulation
  createOfflineAttempt(orderId: string, amount: number, payerVPA: string): UPIAttempt {
    const attempt: UPIAttempt = {
      id: uuidv4(),
      orderId,
      amount,
      payerVPA,
      status: this.isOnline ? 'pending' : 'offline',
      provisionalTxnId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };

    if (this.isOnline) {
      this.upiAttempts.push(attempt);
      this.saveToStorage();
      // Simulate processing delay
      setTimeout(() => {
        this.processPayment(attempt.id);
      }, 2000);
    } else {
      this.offlineQueue.push(attempt);
      this.upiAttempts.push(attempt);
      this.saveToStorage();
    }

    return attempt;
  }

  private processPayment(attemptId: string): void {
    const attempt = this.upiAttempts.find(a => a.id === attemptId);
    if (!attempt) return;

    // Simulate success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    attempt.status = isSuccess ? 'success' : 'failed';
    
    if (isSuccess) {
      const order = this.orders.find(o => o.id === attempt.orderId);
      if (order) {
        order.status = 'paid';
      }
    }
    
    this.saveToStorage();
  }

  // Merchant reconciliation
  reconcilePayment(attemptId: string): boolean {
    const attempt = this.upiAttempts.find(a => a.id === attemptId);
    if (!attempt || attempt.status !== 'offline') return false;

    attempt.status = 'success';
    attempt.reconciledAt = new Date().toISOString();

    const order = this.orders.find(o => o.id === attempt.orderId);
    if (order) {
      order.status = 'paid';
    }

    this.saveToStorage();
    return true;
  }

  // Network simulation
  setOnlineStatus(online: boolean): void {
    this.isOnline = online;
    this.saveToStorage();
    if (online) {
      this.syncWithServer();
    }
  }

  syncWithServer(): void {
    if (!this.isOnline) return;

    // Process offline queue
    this.offlineQueue.forEach(attempt => {
      attempt.status = 'pending';
      setTimeout(() => {
        this.processPayment(attempt.id);
      }, 1000);
    });

    this.offlineQueue = [];
    this.saveToStorage();
  }

  // Clear all data (for testing purposes)
  clearAllData(): void {
    this.orders = [];
    this.upiAttempts = [];
    this.offlineQueue = [];
    this.isOnline = true;
    localStorage.removeItem('smartupi_orders');
    localStorage.removeItem('smartupi_attempts');
    localStorage.removeItem('smartupi_offline_queue');
    localStorage.removeItem('smartupi_online_status');
    console.log('All data cleared');
  }

  getUPIAttempts(): UPIAttempt[] {
    return [...this.upiAttempts];
  }

  getAttemptsByOrder(orderId: string): UPIAttempt[] {
    return this.upiAttempts.filter(attempt => attempt.orderId === orderId);
  }

  isNetworkOnline(): boolean {
    return this.isOnline;
  }
}

export const offlineEngine = new OfflineEngine();