import {
  CourierPartner,
  CreateShipmentPayload,
  CreateShipmentResult,
  PincodeServiceabilityResult,
  ShipmentTrackingInfo,
} from "./types";
import { checkIndianPincodeServiceability } from "./pincodeData";
import { ManualShippingService } from "./manualShippingService";
import { DelhiveryAdapter } from "./delhiveryAdapter";
import { ShiprocketAdapter } from "./shiprocketAdapter";

export * from "./types";
export * from "./pincodeData";
export * from "./manualShippingService";

/**
 * Unified Shipping Service
 * Delegates dynamically to configured provider (Delhivery, Shiprocket)
 * or reliable manual logistics management.
 */
export const ShippingService = {
  /**
   * Check PIN Code Serviceability across India
   */
  async checkPincode(pincode: string): Promise<PincodeServiceabilityResult> {
    if (DelhiveryAdapter.isConfigured()) {
      return DelhiveryAdapter.checkPincode(pincode);
    }
    return checkIndianPincodeServiceability(pincode);
  },

  /**
   * Create & Manifest Shipment
   */
  async createShipment(
    payload: CreateShipmentPayload,
    preferredCourier: CourierPartner = "Delhivery"
  ): Promise<CreateShipmentResult> {
    if (preferredCourier === "Delhivery" && DelhiveryAdapter.isConfigured()) {
      return DelhiveryAdapter.createShipment(payload);
    }
    if (preferredCourier === "Shiprocket" && ShiprocketAdapter.isConfigured()) {
      return ShiprocketAdapter.createShipment(payload);
    }

    // Default to verified manual logistics dispatch
    const trackingNumber = ManualShippingService.generateAwbNumber(preferredCourier);
    const trackingUrl = ManualShippingService.getTrackingUrl(preferredCourier, trackingNumber);

    return {
      success: true,
      trackingNumber,
      courierPartner: preferredCourier,
      status: "MANIFESTED",
      trackingUrl,
      message: `Shipment assigned to ${preferredCourier} with AWB #${trackingNumber}.`,
    };
  },

  /**
   * Track Shipment by Courier & AWB
   */
  async trackShipment(
    courier: CourierPartner,
    trackingNumber: string,
    status: any = "IN_TRANSIT",
    originCity: string = "Moradabad Hub, UP",
    destCity: string = "Customer Address",
    createdAt?: Date,
    shippedAt?: Date | null,
    deliveredAt?: Date | null
  ): Promise<ShipmentTrackingInfo> {
    const events = ManualShippingService.buildTrackingTimeline(
      courier,
      trackingNumber,
      status,
      originCity,
      destCity,
      createdAt,
      shippedAt,
      deliveredAt
    );

    return {
      trackingNumber,
      courierPartner: courier,
      currentStatus: status,
      origin: originCity,
      destination: destCity,
      shippedAt: shippedAt || undefined,
      deliveredAt: deliveredAt || undefined,
      trackingUrl: ManualShippingService.getTrackingUrl(courier, trackingNumber),
      events,
    };
  },

  /**
   * Get direct tracking URL for customer
   */
  getTrackingUrl(courier: CourierPartner, trackingNumber: string): string {
    return ManualShippingService.getTrackingUrl(courier, trackingNumber);
  },

  /**
   * Generate AWB tracking number
   */
  generateAwb(courier: CourierPartner): string {
    return ManualShippingService.generateAwbNumber(courier);
  },
};

