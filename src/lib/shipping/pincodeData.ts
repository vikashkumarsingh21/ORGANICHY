import { PincodeServiceabilityResult } from "./types";
import { BRAND } from "@/lib/constants";

// Major Indian PIN code ranges mapped to regions and delivery SLAs from Moradabad, UP
const PIN_PREFIX_MAP: Record<
  string,
  { city: string; state: string; tier: "METRO" | "TIER_1" | "TIER_2" | "TIER_3"; days: string; cod: boolean }
> = {
  // Moradabad & Western UP (Local Hub)
  "244": { city: "Moradabad", state: "Uttar Pradesh", tier: "TIER_2", days: "1 to 2 days", cod: true },
  "250": { city: "Meerut", state: "Uttar Pradesh", tier: "TIER_2", days: "1 to 2 days", cod: true },
  "201": { city: "Noida / Ghaziabad", state: "Uttar Pradesh", tier: "METRO", days: "1 to 2 days", cod: true },
  "226": { city: "Lucknow", state: "Uttar Pradesh", tier: "TIER_1", days: "2 to 3 days", cod: true },
  "208": { city: "Kanpur", state: "Uttar Pradesh", tier: "TIER_1", days: "2 to 3 days", cod: true },
  "282": { city: "Agra", state: "Uttar Pradesh", tier: "TIER_2", days: "2 to 3 days", cod: true },

  // Delhi NCR
  "110": { city: "New Delhi", state: "Delhi", tier: "METRO", days: "1 to 2 days", cod: true },
  "122": { city: "Gurugram", state: "Haryana", tier: "METRO", days: "1 to 2 days", cod: true },
  "121": { city: "Faridabad", state: "Haryana", tier: "TIER_2", days: "1 to 2 days", cod: true },

  // Maharashtra & Mumbai
  "400": { city: "Mumbai", state: "Maharashtra", tier: "METRO", days: "2 to 3 days", cod: true },
  "411": { city: "Pune", state: "Maharashtra", tier: "TIER_1", days: "2 to 3 days", cod: true },
  "440": { city: "Nagpur", state: "Maharashtra", tier: "TIER_2", days: "3 to 4 days", cod: true },

  // Karnataka & Bengaluru
  "560": { city: "Bengaluru", state: "Karnataka", tier: "METRO", days: "2 to 4 days", cod: true },
  "570": { city: "Mysuru", state: "Karnataka", tier: "TIER_2", days: "3 to 4 days", cod: true },

  // Telangana & Hyderabad
  "500": { city: "Hyderabad", state: "Telangana", tier: "METRO", days: "2 to 4 days", cod: true },

  // Tamil Nadu & Chennai
  "600": { city: "Chennai", state: "Tamil Nadu", tier: "METRO", days: "3 to 4 days", cod: true },
  "641": { city: "Coimbatore", state: "Tamil Nadu", tier: "TIER_2", days: "3 to 5 days", cod: true },

  // West Bengal & Kolkata
  "700": { city: "Kolkata", state: "West Bengal", tier: "METRO", days: "3 to 4 days", cod: true },

  // Gujarat
  "380": { city: "Ahmedabad", state: "Gujarat", tier: "TIER_1", days: "2 to 3 days", cod: true },
  "395": { city: "Surat", state: "Gujarat", tier: "TIER_1", days: "2 to 3 days", cod: true },

  // Rajasthan
  "302": { city: "Jaipur", state: "Rajasthan", tier: "TIER_1", days: "2 to 3 days", cod: true },

  // Punjab & Chandigarh
  "160": { city: "Chandigarh", state: "Punjab", tier: "TIER_1", days: "2 to 3 days", cod: true },
  "141": { city: "Ludhiana", state: "Punjab", tier: "TIER_2", days: "2 to 3 days", cod: true },
};

/**
 * Check Indian PIN Code Serviceability from Moradabad Central Hub
 */
export function checkIndianPincodeServiceability(pincode: string): PincodeServiceabilityResult {
  const cleanPin = (pincode || "").trim().replace(/\D/g, "");

  if (!cleanPin || cleanPin.length !== 6 || cleanPin.startsWith("0")) {
    return {
      pincode: cleanPin,
      isServiceable: false,
      city: "",
      state: "",
      tier: "TIER_3",
      courierPartner: "Delhivery",
      estimatedDays: "Unavailable",
      codAvailable: false,
      standardFee: BRAND.policies.standardShippingFee,
      message: "Please enter a valid 6-digit Indian PIN code.",
    };
  }

  const prefix3 = cleanPin.substring(0, 3);
  const matched = PIN_PREFIX_MAP[prefix3];

  if (matched) {
    return {
      pincode: cleanPin,
      isServiceable: true,
      city: matched.city,
      state: matched.state,
      tier: matched.tier,
      courierPartner: "Delhivery",
      estimatedDays: matched.days,
      codAvailable: matched.cod,
      standardFee: BRAND.policies.standardShippingFee,
      message: `Delivering to ${matched.city}, ${matched.state} in ${matched.days} directly from Moradabad, UP.`,
    };
  }

  // Fallback for all other valid 6-digit Indian PIN codes (Serviceable via Delhivery All-India Network)
  const zoneFirstDigit = cleanPin[0];
  let state = "India";
  let estimatedDays = "3 to 5 business days";

  if (zoneFirstDigit === "1" || zoneFirstDigit === "2") {
    state = "North India";
    estimatedDays = "2 to 3 business days";
  } else if (zoneFirstDigit === "3" || zoneFirstDigit === "4") {
    state = "West India";
    estimatedDays = "3 to 4 business days";
  } else if (zoneFirstDigit === "5" || zoneFirstDigit === "6") {
    state = "South India";
    estimatedDays = "3 to 5 business days";
  } else if (zoneFirstDigit === "7" || zoneFirstDigit === "8") {
    state = "East / North-East India";
    estimatedDays = "4 to 6 business days";
  }

  return {
    pincode: cleanPin,
    isServiceable: true,
    city: "Standard Zone",
    state,
    tier: "TIER_2",
    courierPartner: "Delhivery",
    estimatedDays,
    codAvailable: true,
    standardFee: BRAND.policies.standardShippingFee,
    message: `All-India delivery available to PIN ${cleanPin} in ${estimatedDays}.`,
  };
}

