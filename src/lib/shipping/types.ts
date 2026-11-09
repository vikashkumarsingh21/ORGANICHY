export type CourierPartner =
  | "Delhivery"
  | "Blue Dart"
  | "DTDC"
  | "India Post"
  | "Shiprocket"
  | "Manual Courier";

export type ShipmentStatus =
  | "MANIFESTED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";

export interface PincodeServiceabilityResult {
  pincode: string;
  isServiceable: boolean;
  city: string;
  state: string;
  tier: "METRO" | "TIER_1" | "TIER_2" | "TIER_3";
  courierPartner: CourierPartner;
  estimatedDays: string;
  codAvailable: boolean;
  standardFee: number;
  message: string;
}

export interface CreateShipmentPayload {
  orderId: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  weightGrams: number;
  lengthCm?: number;
  breadthCm?: number;
  heightCm?: number;
  isCod: boolean;
  codAmount?: number;
  items: Array<{
    title: string;
    sku: string;
    quantity: number;
    price: number;
  }>;
}

export interface CreateShipmentResult {
  success: boolean;
  trackingNumber: string;
  courierPartner: CourierPartner;
  status: ShipmentStatus;
  trackingUrl?: string;
  labelUrl?: string;
  manifestId?: string;
  estimatedDelivery?: Date;
  message?: string;
}

export interface ShipmentTrackingEvent {
  status: ShipmentStatus;
  activity: string;
  location: string;
  timestamp: string;
}

export interface ShipmentTrackingInfo {
  trackingNumber: string;
  courierPartner: CourierPartner;
  currentStatus: ShipmentStatus;
  origin: string;
  destination: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  estimatedDelivery?: Date;
  trackingUrl?: string;
  events: ShipmentTrackingEvent[];
}

/**
 * Standard Provider Adapter Interface
 * Allows plug-and-play integration for Shiprocket, Delhivery, or custom carriers
 */
export interface ShippingProviderAdapter {
  name: CourierPartner;
  isConfigured: () => boolean;
  checkPincode: (pincode: string) => Promise<PincodeServiceabilityResult>;
  createShipment: (payload: CreateShipmentPayload) => Promise<CreateShipmentResult>;
  trackShipment: (trackingNumber: string) => Promise<ShipmentTrackingInfo>;
  cancelShipment?: (trackingNumber: string) => Promise<boolean>;
}

