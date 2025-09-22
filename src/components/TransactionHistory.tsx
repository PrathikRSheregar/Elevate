import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, AlertCircle, WifiOff, Search, History } from 'lucide-react';
import { offlineEngine, Order, UPIAttempt } from '@/lib/offline-engine';

export const TransactionHistory = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allAttempts, setAllAttempts] = useState<UPIAttempt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const refreshData = () => {
    const orders = offlineEngine.getOrders();
    const attempts = offlineEngine.getUPIAttempts();
    setAllOrders(orders);
    setAllAttempts(attempts);
    console.log('Transaction History - Orders:', orders);
    console.log('Transaction History - Attempts:', attempts);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Success</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'offline':
        return <Badge className="bg-warning text-warning-foreground"><WifiOff className="w-3 h-3 mr-1" />Offline</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredAttempts = allAttempts.filter(attempt => {
    const order = allOrders.find(o => o.id === attempt.orderId);
    return (
      attempt.provisionalTxnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.payerVPA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Complete Transaction History
          </CardTitle>
          <CardDescription>
            View all orders and payment attempts across the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by transaction ID, UPI ID, or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={refreshData} variant="outline">
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{allOrders.length}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{allAttempts.filter(a => a.status === 'success').length}</p>
              <p className="text-sm text-muted-foreground">Successful Payments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{allAttempts.filter(a => a.status === 'offline').length}</p>
              <p className="text-sm text-muted-foreground">Offline Attempts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions ({filteredAttempts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAttempts.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {allAttempts.length === 0 ? 'No transactions found. Create an order and make a payment to see transactions here.' : 'No transactions match your search.'}
                </p>
              </div>
            ) : (
              filteredAttempts.slice().reverse().map((attempt) => {
                const order = allOrders.find(o => o.id === attempt.orderId);
                return (
                  <div key={attempt.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm font-medium">{attempt.provisionalTxnId}</span>
                          {getStatusBadge(attempt.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">UPI ID: {attempt.payerVPA}</p>
                        <p className="text-sm">Amount: ₹{attempt.amount}</p>
                        {order && <p className="text-sm">Customer: {order.customerName}</p>}
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(attempt.createdAt).toLocaleString()}
                        </p>
                        {attempt.reconciledAt && (
                          <p className="text-xs text-success">
                            Reconciled: {new Date(attempt.reconciledAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{attempt.amount}</p>
                        <p className="text-xs text-muted-foreground">Order #{order?.id.slice(-6)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};