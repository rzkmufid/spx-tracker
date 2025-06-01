import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { MapPin, Truck, Package, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LocationMap } from '@/components/location-map';
import type { TrackingRecord } from '@/lib/types';

interface TrackingTimelineProps {
  records: TrackingRecord[];
}

export function TrackingTimeline({ records }: TrackingTimelineProps) {
  const [showAllRecords, setShowAllRecords] = useState(false);
  
  const displayedRecords = records
    .filter(record => record.display_flag === 1)
    .sort((a, b) => b.actual_time - a.actual_time);
  
  const initialRecords = displayedRecords.slice(0, 3);
  const hiddenRecordsCount = displayedRecords.length - initialRecords.length;
  const recordsToRender = showAllRecords ? displayedRecords : initialRecords;

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        {recordsToRender.map((record, index) => (
          <Card 
            key={`${record.tracking_code}-${index}`} 
            className={cn(
              "relative p-6 transition-all",
              "hover:bg-accent/50",
              "border-l-[6px]",
              record.milestone_name?.toLowerCase() === "delivered" ? "border-l-primary" : "border-l-border"
            )}
          >
            <TimelineItem record={record} isLast={index === recordsToRender.length - 1} />
          </Card>
        ))}
      </div>
      
      {hiddenRecordsCount > 0 && (
        <Button
          variant="outline"
          onClick={() => setShowAllRecords(!showAllRecords)}
          className="w-full text-muted-foreground hover:text-foreground mt-2"
        >
          {showAllRecords ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Show {hiddenRecordsCount} More Updates
            </>
          )}
        </Button>
      )}
    </div>
  );
}

interface TimelineItemProps {
  record: TrackingRecord;
  isLast: boolean;
}

function TimelineItem({ record, isLast }: TimelineItemProps) {
  const Icon = getTrackingIcon(record.tracking_code);
  const [showMap, setShowMap] = useState(false);
  const hasLocation = record.current_location?.lat && record.current_location?.lng;
  
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center",
          "bg-primary/10 text-primary"
        )}>
          <Icon className="h-6 w-6" />
        </div>
        {!isLast && <div className="w-px bg-border flex-1 my-2 ml-6" />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-col space-y-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-medium text-base">{record.tracking_name}</h3>
            <time className="text-sm text-muted-foreground whitespace-nowrap">
              {formatDate(record.actual_time)}
            </time>
          </div>
          
          <p className="text-sm text-muted-foreground text-start">
            {record.description}
          </p>
        </div>
        
        {record.current_location && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              {hasLocation ? (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-auto p-2"
                  onClick={() => setShowMap(!showMap)}
                >
                  <div className="flex items-center text-xs">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    <span className="font-medium">{record.current_location.location_name}</span>
                  </div>
                </Button>
              ) : (
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>{record.current_location.location_name}</span>
                </div>
              )}
            </div>
            
            {showMap && hasLocation && (
              <div className="mt-4">
                <LocationMap
                  lat={record.current_location.lat}
                  lng={record.current_location.lng}
                  locationName={record.current_location.location_name}
                  address={record.current_location.full_address}
                />
              </div>
            )}
            
            {record.current_location.full_address && (
              <div className="text-sm text-start text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {record.current_location.full_address}
              </div>
            )}
          </div>
        )}
        
        {record.next_location && record.next_location.location_name && (
          <div className="mt-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Truck className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>Next Stop: {record.next_location.location_name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getTrackingIcon(trackingCode: string) {
  if (trackingCode.startsWith('F1')) return Package;
  if (trackingCode.startsWith('F5')) return Truck;
  if (trackingCode.startsWith('F0')) return Clock;
  return MapPin;
}