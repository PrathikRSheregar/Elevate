import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, CheckCircle, Clock, AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import { offlineEngine, Order, UPIAttempt } from '@/lib/offline-engine';
import { useToast } from '@/hooks/use-toast';

export const MerchantInterface = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [attempts, setAttempts] = useState<UPIAttempt[]>([]);
  const { toast } = useToast();

  const refreshData = () => {
    setOrders(offlineEngine.getOrders());
    setAttempts(offlineEngine.getUPIAttempts());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, []);

  const reconcilePayment = (attemptId: string) => {
    const success = offlineEngine.reconcilePayment(attemptId);
    
    if (success) {
      toast({
        title: "Payment Reconciled",
        description: "Offline payment has been confirmed and reconciled",
      });
      refreshData();
    } else {
      toast({
        title: "Reconciliation Failed",
        description: "Unable to reconcile this payment",
        variant: "destructive",
      });
    }
  };

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

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-success text-success-foreground">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, order) => sum + order.amount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const offlineAttempts = attempts.filter(a => a.status === 'offline').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                Merchant Dashboard - SmartUPI Offline
              </CardTitle>
              <CardDescription>Monitor orders and reconcile offline payments</CardDescription>
            </div>
            <Button onClick={refreshData} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-success/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-success">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-warning/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-2xl font-bold text-warning">{pendingOrders}</p>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Offline Attempts</p>
              <p className="text-2xl font-bold text-destructive">{offlineAttempts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>All customer orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No orders yet</p>
              ) : (
                orders.slice().reverse().map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        Order #{order.id.slice(-6)} • ₹{order.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {getOrderStatusBadge(order.status)}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Attempts</CardTitle>
            <CardDescription>UPI payment attempts and reconciliation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attempts.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No payment attempts yet</p>
              ) : (
                attempts.slice().reverse().map((attempt) => {
                  const order = orders.find(o => o.id === attempt.orderId);
                  return (
                    <div key={attempt.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-mono text-sm">{attempt.provisionalTxnId}</p>
                          <p className="text-sm text-muted-foreground">{attempt.payerVPA}</p>
                          <p className="text-sm">₹{attempt.amount} • {order?.customerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(attempt.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {getStatusBadge(attempt.status)}
                      </div>
                      
                      {attempt.status === 'offline' && (
                        <Button 
                          onClick={() => reconcilePayment(attempt.id)}
                          size="sm"
                          className="w-full"
                        >
                          Reconcile Payment
                        </Button>
                      )}
                      
                      {attempt.reconciledAt && (
                        <p className="text-xs text-success">
                          Reconciled: {new Date(attempt.reconciledAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};