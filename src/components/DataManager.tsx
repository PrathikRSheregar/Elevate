import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RotateCcw, Download, Upload } from 'lucide-react';
import { offlineEngine } from '@/lib/offline-engine';
import { useToast } from '@/hooks/use-toast';

export const DataManager = () => {
  const { toast } = useToast();

  const clearAllData = () => {
    offlineEngine.clearAllData();
    toast({
      title: "Data Cleared",
      description: "All orders and transactions have been cleared",
    });
    // Force page refresh to reset all component states
    window.location.reload();
  };

  const exportData = () => {
    const data = {
      orders: offlineEngine.getOrders(),
      attempts: offlineEngine.getUPIAttempts(),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartupi-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your transaction data has been downloaded",
    });
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-primary" />
            Data Management
          </CardTitle>
          <CardDescription>
            Manage your transaction data and troubleshoot issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={refreshPage} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Refresh Page
            </Button>
            <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button onClick={clearAllData} variant="destructive" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Clear All Data
            </Button>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Data Persistence Info:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your data is now automatically saved to browser storage</li>
              <li>• Data will persist even if you refresh the page</li>
              <li>• Data is stored locally on your device</li>
              <li>• Use "Clear All Data" if you want to start fresh</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};