import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Wifi, WifiOff, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { offlineEngine, Order, UPIAttempt } from '@/lib/offline-engine';
import { useToast } from '@/hooks/use-toast';

export const CustomerInterface = () => {
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [payerVPA, setPayerVPA] = useState('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [attempts, setAttempts] = useState<UPIAttempt[]>([]);
  const [isOnline, setIsOnline] = useState(offlineEngine.isNetworkOnline());
  const { toast } = useToast();

  const createOrder = () => {
    if (!customerName || !amount) {
      toast({
        title: "Missing Information",
        description: "Please enter customer name and amount",
        variant: "destructive",
      });
      return;
    }

    const order = offlineEngine.createOrder(customerName, parseFloat(amount));
    setCurrentOrder(order);
    setAttempts([]);
    
    console.log('Order created:', order);
    console.log('All orders:', offlineEngine.getOrders());
    
    toast({
      title: "Order Created",
      description: `Order #${order.id.slice(-6)} created for ₹${amount}`,
    });
  };

  const makePayment = () => {
    if (!currentOrder || !payerVPA) {
      toast({
        title: "Missing Information",
        description: "Please create an order and enter UPI ID",
        variant: "destructive",
      });
      return;
    }

    const attempt = offlineEngine.createOfflineAttempt(
      currentOrder.id,
      currentOrder.amount,
      payerVPA
    );

    const updatedAttempts = offlineEngine.getAttemptsByOrder(currentOrder.id);
    setAttempts(updatedAttempts);
    
    console.log('Payment attempt created:', attempt);
    console.log('All attempts for order:', updatedAttempts);
    console.log('All UPI attempts:', offlineEngine.getUPIAttempts());
    
    toast({
      title: isOnline ? "Payment Initiated" : "Offline Payment Attempted",
      description: `Transaction ID: ${attempt.provisionalTxnId}`,
    });
  };

  const toggleNetwork = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    offlineEngine.setOnlineStatus(newStatus);
    
    if (newStatus) {
      toast({
        title: "Network Connected",
        description: "Syncing offline transactions...",
      });
      
      // Refresh attempts after sync
      setTimeout(() => {
        if (currentOrder) {
          setAttempts(offlineEngine.getAttemptsByOrder(currentOrder.id));
        }
      }, 2500);
    } else {
      toast({
        title: "Network Disconnected",
        description: "Entering offline mode",
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Customer App - SmartUPI Offline
              </CardTitle>
              <CardDescription>Create orders and make UPI payments (even offline)</CardDescription>
            </div>
            <Button
              onClick={toggleNetwork}
              variant={isOnline ? "default" : "destructive"}
              className="flex items-center gap-2"
            >
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              {isOnline ? "Online" : "Offline"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>
          <Button onClick={createOrder} className="w-full">
            Create Order
          </Button>
        </CardContent>
      </Card>

      {currentOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Active Order</CardTitle>
            <CardDescription>Order #{currentOrder.id.slice(-6)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-medium">{currentOrder.customerName}</p>
                <p className="text-sm text-muted-foreground">₹{currentOrder.amount}</p>
              </div>
              <Badge
                className={
                  currentOrder.status === 'paid' 
                    ? 'bg-success text-success-foreground' 
                    : 'bg-warning text-warning-foreground'
                }
              >
                {currentOrder.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payerVPA">UPI ID</Label>
              <Input
                id="payerVPA"
                value={payerVPA}
                onChange={(e) => setPayerVPA(e.target.value)}
                placeholder="yourname@upi"
              />
            </div>
            
            <Button 
              onClick={makePayment} 
              className="w-full"
              disabled={currentOrder.status === 'paid'}
            >
              Pay with UPI
            </Button>

            {attempts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Payment Attempts</h4>
                {attempts.map((attempt) => (
                  <div key={attempt.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-mono text-sm">{attempt.provisionalTxnId}</p>
                      <p className="text-sm text-muted-foreground">{attempt.payerVPA}</p>
                    </div>
                    {getStatusBadge(attempt.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};