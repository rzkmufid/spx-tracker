import { formatDate } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, PackageCheck, MapPin, Calendar, BarChart4, Package } from 'lucide-react';
import type { TrackingInfo } from '@/lib/types';

interface ShipmentDetailsProps {
  trackingInfo: TrackingInfo;
}

export function ShipmentDetails({ trackingInfo }: ShipmentDetailsProps) {
  // Get the first and last records
  const sortedRecords = [...trackingInfo.records]
    .filter(record => record.display_flag === 1)
    .sort((a, b) => a.actual_time - b.actual_time);
  
  const firstRecord = sortedRecords[0];
  const latestRecord = sortedRecords[sortedRecords.length - 1];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tracking Information */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium flex items-center mb-4">
              <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
              Tracking Information
            </h3>
            
            <div className="space-y-4">
              <DetailItem 
                label="Tracking Number" 
                value={trackingInfo.sls_tn} 
                valueClassName="font-mono text-primary"
              />
              
              <DetailItem 
                label="Order ID" 
                value={trackingInfo.client_order_id} 
                valueClassName="font-mono"
              />
              
              {trackingInfo.receiver_name && (
                <DetailItem 
                  label="Recipient" 
                  value={trackingInfo.receiver_name} 
                />
              )}
              
              <DetailItem 
                label="Order Type" 
                value={trackingInfo.receiver_type_name || "Standard Delivery"} 
              />
              
              <DetailItem 
                label="Shopee Market Order" 
                value={latestRecord?.milestone_name === "Delivered" ? "Completed" : "Yes"} 
                valueElement={
                  <Badge variant={latestRecord?.milestone_name === "Delivered" ? "success" : "default"}>
                    {latestRecord?.milestone_name === "Delivered" ? "Completed" : "Yes"}
                  </Badge>
                }
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Shipping Information */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium flex items-center mb-4">
              <PackageCheck className="h-5 w-5 mr-2 text-primary" />
              Shipping Information
            </h3>
            
            <div className="space-y-4">
              <DetailItem 
                label="Current Status" 
                value={latestRecord?.milestone_name || "In Progress"} 
                valueElement={
                  <Badge variant={getStatusVariant(latestRecord?.milestone_name)}>
                    {latestRecord?.milestone_name || "In Progress"}
                  </Badge>
                }
              />
              
              <DetailItem 
                label="Shipped Date" 
                value={formatDate(firstRecord?.actual_time)} 
                icon={Calendar}
              />
              
              <DetailItem 
                label="Last Updated" 
                value={formatDate(latestRecord?.actual_time)} 
                icon={Calendar}
              />
              
              {latestRecord?.current_location?.location_name && (
                <DetailItem 
                  label="Current Location" 
                  value={latestRecord.current_location.location_name} 
                  icon={MapPin}
                />
              )}
              
              {latestRecord?.next_location?.location_name && (
                <DetailItem 
                  label="Next Destination" 
                  value={latestRecord.next_location.location_name} 
                  icon={MapPin}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Separator />
      
      {/* Latest Status Update */}
      {latestRecord && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium flex items-center mb-4">
              <BarChart4 className="h-5 w-5 mr-2 text-primary" />
              Latest Status Update
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                
                <div className="space-y-2 ">
                  <h4 className="font-medium text-start">{latestRecord.tracking_name}</h4>
                  <p className="text-muted-foreground">{latestRecord.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mt-3">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(latestRecord.actual_time)}
                    </Badge>
                    
                    {latestRecord.current_location?.location_name && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {latestRecord.current_location.location_name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
  valueClassName?: string;
  valueElement?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

function DetailItem({ label, value, valueClassName = "", valueElement, icon: Icon }: DetailItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between text-sm pb-2">
      <span className="text-muted-foreground flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </span>
      {valueElement || <span className={valueClassName}>{value}</span>}
    </div>
  );
}

function getStatusVariant(status?: string): "default" | "success" | "warning" | "destructive" {
  if (!status) return "default";
  
  switch (status.toLowerCase()) {
    case "delivered":
      return "success";
    case "in transit":
      return "default";
    case "preparing to ship":
      return "warning";
    case "exception":
      return "destructive";
    default:
      return "default";
  }
}