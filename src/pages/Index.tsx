import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerInterface } from '@/components/CustomerInterface';
import { MerchantInterface } from '@/components/MerchantInterface';
import { TransactionHistory } from '@/components/TransactionHistory';
import { DataManager } from '@/components/DataManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Store, Shield, Wifi, History } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              SmartUPI Offline
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience seamless UPI payments even when offline. Create orders, process payments, 
            and reconcile transactions with our intelligent offline-first payment system.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Smartphone className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Customer App</h3>
              <p className="text-sm text-muted-foreground">Create orders and pay with UPI</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Store className="w-8 h-8 mx-auto mb-2 text-success" />
              <h3 className="font-semibold">Merchant Dashboard</h3>
              <p className="text-sm text-muted-foreground">Monitor and reconcile payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Wifi className="w-8 h-8 mx-auto mb-2 text-warning" />
              <h3 className="font-semibold">Offline Mode</h3>
              <p className="text-sm text-muted-foreground">Works without internet connection</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4">
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Customer
            </TabsTrigger>
            <TabsTrigger value="merchant" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Merchant
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="customer" className="mt-6">
            <CustomerInterface />
          </TabsContent>
          
          <TabsContent value="merchant" className="mt-6">
            <MerchantInterface />
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-6">
            <TransactionHistory />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <DataManager />
          </TabsContent>
        </Tabs>

        {/* How it Works */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>How SmartUPI Offline Works</CardTitle>
            <CardDescription>Understanding the offline payment simulation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold">Create Order</h4>
                <p className="text-sm text-muted-foreground">Customer creates a payment order with name and amount</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-warning">2</span>
                </div>
                <h4 className="font-semibold">UPI Payment</h4>
                <p className="text-sm text-muted-foreground">Attempt payment with UPI ID (works online/offline)</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-success">3</span>
                </div>
                <h4 className="font-semibold">Offline Queue</h4>
                <p className="text-sm text-muted-foreground">Offline payments are queued with provisional IDs</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-destructive">4</span>
                </div>
                <h4 className="font-semibold">Reconciliation</h4>
                <p className="text-sm text-muted-foreground">Merchant reconciles offline payments when online</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payment Status Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-success text-success-foreground">
                  <Smartphone className="w-3 h-3 mr-1" />Success
                </Badge>
                <span className="text-sm text-muted-foreground">Payment completed successfully</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <Wifi className="w-3 h-3 mr-1" />Pending
                </Badge>
                <span className="text-sm text-muted-foreground">Payment being processed online</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-warning text-warning-foreground">
                  <Wifi className="w-3 h-3 mr-1" />Offline
                </Badge>
                <span className="text-sm text-muted-foreground">Payment attempted offline, needs reconciliation</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">
                  <Smartphone className="w-3 h-3 mr-1" />Failed
                </Badge>
                <span className="text-sm text-muted-foreground">Payment failed or rejected</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
