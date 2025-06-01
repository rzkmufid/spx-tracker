import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import TrackingForm from './tracking-form';
import TrackingResult from './tracking-result';
import { PackageSearch, PackageX } from 'lucide-react';
import type { TrackingData } from '@/lib/types';
import { Card } from '@/components/ui/card';

export default function TrackingPage() {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  const fetchTrackingData = async (trackingNumber: string) => {
    setIsLoading(true);
    setTrackingData(null);
    setNotFound(false);
    
    try {
      const params = new URLSearchParams({
        spx_tn: trackingNumber,
        language_code: 'id'
      });
      
      const response = await fetch(
        `/api/shipment/order/open/order/get_order_info?${params}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch tracking data');
      }
      
      const data = await response.json();
      
      // Check for the specific error response that indicates "not found"
      if (data.retcode === -2023002 || data.message?.includes('ref record not unique')) {
        setNotFound(true);
        return;
      }
      
      // Check for other error responses
      if (data.retcode !== 0 || data.message?.includes('error')) {
        throw new Error(data.message || 'Failed to fetch tracking data');
      }
      
      setTrackingData(data);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch tracking data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-8">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Track Your Package
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-[85%] mx-auto">
            Enter your tracking number to get real-time updates on your shipment
          </p>
        </div>
        
        <TrackingForm onSubmit={fetchTrackingData} isLoading={isLoading} />
        
        {!trackingData && !isLoading && !notFound && (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground text-center">
            <PackageSearch className="h-24 w-24 mb-6 opacity-20" />
            <p className="text-lg">Enter a tracking number to see shipment details</p>
            <p className="text-sm mt-2">Make sure to include the SPXID prefix</p>
          </div>
        )}

        {notFound && (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <PackageX className="h-24 w-24 mb-6 opacity-20" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Package Not Found</h2>
              <p className="text-lg max-w-[500px] mx-auto">
                We couldn't find any shipment with this tracking number. Please check the number and try again.
              </p>
              <p className="text-sm mt-4">
                Make sure your tracking number starts with SPXID and contains all the correct digits.
              </p>
            </div>
          </Card>
        )}
        
        {trackingData && <TrackingResult data={trackingData} />}
      </div>
    </div>
  );
}