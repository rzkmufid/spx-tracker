import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrackingTimeline } from './tracking-timeline';
import { ShipmentDetails } from './shipment-details';
import type { TrackingData } from '@/lib/types';

interface TrackingResultProps {
  data: TrackingData;
}

export default function TrackingResult({ data }: TrackingResultProps) {
  const { sls_tracking_info } = data.data;
  
  return (
    <div className="fade-in space-y-6 mt-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center justify-between">
            <div className="text-xl font-semibold">
              Tracking Number: <span className="font-mono">{sls_tracking_info.sls_tn}</span>
            </div>
            <div className="flex items-center">
              <StatusBadge status={getLatestStatus(sls_tracking_info)} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="details">Shipment Details</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="mt-4">
              <TrackingTimeline records={sls_tracking_info.records} />
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <ShipmentDetails trackingInfo={sls_tracking_info} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get the latest status
function getLatestStatus(trackingInfo: any): string {
  if (!trackingInfo.records || trackingInfo.records.length === 0) {
    return 'Unknown';
  }
  
  // Filter displayed records and sort by time (descending)
  const displayedRecords = trackingInfo.records
    .filter((record: any) => record.display_flag === 1)
    .sort((a: any, b: any) => b.actual_time - a.actual_time);
  
  if (displayedRecords.length === 0) {
    return 'Unknown';
  }
  
  return displayedRecords[0].milestone_name || 'In Progress';
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  let bgColor = 'bg-muted';
  let textColor = 'text-muted-foreground';
  
  switch (status.toLowerCase()) {
    case 'delivered':
      bgColor = 'bg-green-100 dark:bg-green-900';
      textColor = 'text-green-800 dark:text-green-300';
      break;
    case 'in transit':
      bgColor = 'bg-blue-100 dark:bg-blue-900';
      textColor = 'text-blue-800 dark:text-blue-300';
      break;
    case 'preparing to ship':
      bgColor = 'bg-orange-100 dark:bg-orange-900';
      textColor = 'text-orange-800 dark:text-orange-300';
      break;
    case 'exception':
      bgColor = 'bg-red-100 dark:bg-red-900';
      textColor = 'text-red-800 dark:text-red-300';
      break;
  }
  
  return (
    <div className={`${bgColor} ${textColor} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
      {status}
    </div>
  );
}