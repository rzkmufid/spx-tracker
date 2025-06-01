export interface TrackingData {
  retcode: number;
  data: {
    fulfillment_info: {
      deliver_type: number;
    };
    sls_tracking_info: TrackingInfo;
    is_instant_order: boolean;
    is_shopee_market_order: boolean;
  };
  message: string;
  detail: string;
  debug: string;
}

export interface TrackingInfo {
  sls_tn: string;
  client_order_id: string;
  receiver_name: string;
  receiver_type_name: string;
  records: TrackingRecord[];
}

export interface TrackingRecord {
  tracking_code: string;
  tracking_name: string;
  description: string;
  display_flag: number;
  actual_time: number;
  reason_code: string;
  reason_desc: string;
  epod: string;
  pin_code: string;
  current_location: Location;
  next_location: Location;
  display_flag_v2: number;
  buyer_description: string;
  seller_description: string;
  milestone_code: number;
  milestone_name: string;
}

export interface Location {
  location_name: string;
  location_type_name: string;
  lng: string;
  lat: string;
  full_address: string;
}