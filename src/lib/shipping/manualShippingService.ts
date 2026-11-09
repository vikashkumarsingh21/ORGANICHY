import { CourierPartner, ShipmentStatus, ShipmentTrackingInfo, ShipmentTrackingEvent } from "./types";

export const ManualShippingService = {
  /**
   * Get direct tracking URL for the assigned courier
   */
  getTrackingUrl(courier: CourierPartner, trackingNumber: string): string {
    const cleanNo = encodeURIComponent(trackingNumber.trim());
    switch (courier) {
      case "Delhivery":
        return `https://www.delhivery.com/track/package/${cleanNo}`;
      case "Blue Dart":
        return `https://www.bluedart.com/tracking?trackNumber=${cleanNo}`;
      case "DTDC":
        return `https://www.dtdc.in/tracking.asp?strCnno=${cleanNo}`;
      case "India Post":
        return `https://www.indiapost.gov.in/_layouts/15/dpt.cpt.ui/trackconsignments.aspx?trackingNumber=${cleanNo}`;
      case "Shiprocket":
        return `https://shiprocket.co/tracking/${cleanNo}`;
      default:
        return `https://www.delhivery.com/track/package/${cleanNo}`;
    }
  },

  /**
   * Generate standard AWB tracking number for a courier
   */
  generateAwbNumber(courier: CourierPartner): string {
    const randomSuffix = Math.floor(10000000 + Math.random() * 90000000).toString();
    switch (courier) {
      case "Delhivery":
        return `DEL-${randomSuffix}`;
      case "Blue Dart":
        return `BLU-${randomSuffix}`;
      case "DTDC":
        return `DTD-${randomSuffix}`;
      case "India Post":
        return `IND-${randomSuffix}`;
      case "Shiprocket":
        return `SR-${randomSuffix}`;
      default:
        return `ORG-${randomSuffix}`;
    }
  },

  /**
   * Build realistic tracking timeline based on current status and timestamps
   */
  buildTrackingTimeline(
    courier: CourierPartner,
    trackingNumber: string,
    status: ShipmentStatus,
    originCity: string = "Moradabad, UP",
    destCity: string = "Customer Address",
    createdAt: Date = new Date(),
    shippedAt?: Date | null,
    deliveredAt?: Date | null
  ): ShipmentTrackingEvent[] {
    const events: ShipmentTrackingEvent[] = [];

    // Stage 1: Manifested
    events.push({
      status: "MANIFESTED",
      activity: "Shipping label created & parcel manifested at Moradabad Central Hub",
      location: originCity,
      timestamp: new Date(createdAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // Stage 2: In Transit
    if (status === "IN_TRANSIT" || status === "OUT_FOR_DELIVERY" || status === "DELIVERED") {
      const shipTime = shippedAt || new Date(createdAt.getTime() + 86400000);
      events.push({
        status: "IN_TRANSIT",
        activity: `Handed over to ${courier} Express Logistics`,
        location: originCity,
        timestamp: new Date(shipTime).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      events.push({
        status: "IN_TRANSIT",
        activity: "Dispatched from regional sorting facility",
        location: "NCR Logistics Gateway",
        timestamp: new Date(shipTime.getTime() + 43200000).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    // Stage 3: Out for Delivery
    if (status === "OUT_FOR_DELIVERY" || status === "DELIVERED") {
      const outTime = deliveredAt
        ? new Date(deliveredAt.getTime() - 28800000)
        : new Date(Date.now() - 7200000);

      events.push({
        status: "OUT_FOR_DELIVERY",
        activity: `Arrived at local hub and out for delivery with ${courier} agent`,
        location: destCity,
        timestamp: outTime.toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    // Stage 4: Delivered
    if (status === "DELIVERED") {
      const delTime = deliveredAt || new Date();
      events.push({
        status: "DELIVERED",
        activity: "Package safely delivered & handed over to customer",
        location: destCity,
        timestamp: delTime.toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    // Stage 5: Returned
    if (status === "RETURNED") {
      events.push({
        status: "RETURNED",
        activity: "Package returned to sender / origin facility",
        location: originCity,
        timestamp: new Date().toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    return events.reverse(); // Most recent first
  },
};

