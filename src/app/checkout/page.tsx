"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { formatINR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  CheckCircle,
  Lock,
  MapPin,
  Sparkles,
  User,
  AlertCircle,
  Tag,
  Check,
  FileText,
  Building,
  Smartphone,
  Landmark,
  Wallet,
  X,
  AlertTriangle,
} from "lucide-react";

interface SavedAddress {
  id: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    getSubtotal,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    orderNotes: cartOrderNotes,
  } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccessNumber, setOrderSuccessNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Session & Saved Address State
  const [sessionUser, setSessionUser] = useState<any | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "NEW">("NEW");

  // Shipping Form State
  const [shippingForm, setShippingForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    apartment: "",
    city: "Moradabad",
    state: "Uttar Pradesh",
    pincode: "",
  });

  // Billing Address Toggle & State
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingForm, setBillingForm] = useState({
    name: "",
    phone: "",
    street: "",
    apartment: "",
    city: "Moradabad",
    state: "Uttar Pradesh",
    pincode: "",
  });

  // Customer Order Notes
  const [orderNotes, setOrderNotes] = useState(cartOrderNotes || "");

  // In-Checkout Coupon State
  const [checkoutCouponCode, setCheckoutCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Server Calculated Totals State
  const [serverCalculation, setServerCalculation] = useState<{
    subtotal: number;
    discountTotal: number;
    shippingFee: number;
    codFee: number;
    grandTotal: number;
  } | null>(null);

  // Razorpay Sandbox Simulation Dialog State (for dev without active live keys)
  const [sandboxModalData, setSandboxModalData] = useState<{
    orderId: string;
    orderNumber: string;
    razorpayOrderId: string;
    amount: number;
  } | null>(null);
  const [selectedSandboxMethod, setSelectedSandboxMethod] = useState<"UPI" | "CARD" | "NETBANKING" | "WALLET">("UPI");

  // Load Razorpay Checkout Script dynamically
  useEffect(() => {
    const scriptId = "razorpay-checkout-js";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Check auth and saved addresses on mount
  useEffect(() => {
    async function loadAuthAndAddresses() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (meData.authenticated && meData.user) {
          setSessionUser(meData.user);
          setShippingForm((prev) => ({
            ...prev,
            name: meData.user.name || prev.name,
            email: meData.user.email || prev.email,
            phone: meData.user.phone || prev.phone,
          }));

          // Fetch saved addresses
          const addrRes = await fetch("/api/customer/addresses");
          const addrData = await addrRes.json();
          if (addrData.success && addrData.data?.length > 0) {
            setSavedAddresses(addrData.data);
            const defaultAddr =
              addrData.data.find((a: SavedAddress) => a.isDefault) || addrData.data[0];
            setSelectedAddressId(defaultAddr.id);
            setShippingForm((prev) => ({
              ...prev,
              name: defaultAddr.fullName,
              phone: defaultAddr.phoneNumber,
              street: defaultAddr.street,
              apartment: defaultAddr.landmark || "",
              city: defaultAddr.city,
              state: defaultAddr.state,
              pincode: defaultAddr.postalCode,
            }));
          }
        }
      } catch (e) {}
    }

    loadAuthAndAddresses();
  }, []);

  // Sync Server-side Calculation whenever items, coupon or paymentMethod changes
  useEffect(() => {
    if (items.length === 0) return;

    let isMounted = true;
    async function recalculate() {
      try {
        const res = await fetch("/api/checkout/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((it) => ({ variantId: it.variantId, quantity: it.quantity })),
            couponCode: appliedCoupon?.code,
            paymentMethod,
          }),
        });
        const data = await res.json();
        if (isMounted && data.success && data.data) {
          setServerCalculation({
            subtotal: data.data.subtotal,
            discountTotal: data.data.discountTotal,
            shippingFee: data.data.shippingFee,
            codFee: data.data.codFee,
            grandTotal: data.data.grandTotal,
          });
        }
      } catch (e) {
        // Fallback to local computation
      }
    }

    recalculate();
    return () => {
      isMounted = false;
    };
  }, [items, appliedCoupon, paymentMethod]);

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setShippingForm((prev) => ({
      ...prev,
      name: addr.fullName,
      phone: addr.phoneNumber,
      street: addr.street,
      apartment: addr.landmark || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.postalCode,
    }));
  };

  // Local fallback calculation if server calculation is loading
  const rawSubtotal = getSubtotal();
  const subtotal = serverCalculation ? serverCalculation.subtotal : rawSubtotal;
  const discountTotal = serverCalculation
    ? serverCalculation.discountTotal
    : appliedCoupon
    ? appliedCoupon.discountType === "PERCENTAGE"
      ? Math.round((subtotal * appliedCoupon.discountValue) / 100)
      : appliedCoupon.discountType === "FIXED"
      ? appliedCoupon.discountValue
      : 0
    : 0;

  const isFreeShipping =
    serverCalculation !== null
      ? serverCalculation.shippingFee === 0
      : subtotal - discountTotal >= BRAND.policies.freeShippingThreshold ||
        appliedCoupon?.discountType === "FREE_SHIPPING";

  const shippingFee = serverCalculation !== null
    ? serverCalculation.shippingFee
    : isFreeShipping
    ? 0
    : BRAND.policies.standardShippingFee;

  const codFee = paymentMethod === "COD" ? BRAND.policies.codFee : 0;
  const grandTotal = serverCalculation !== null
    ? serverCalculation.grandTotal
    : Math.max(0, subtotal - discountTotal + shippingFee + codFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutCouponCode.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: checkoutCouponCode.trim(),
          subtotal,
          items: items.map((it) => ({ variantId: it.variantId, quantity: it.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to validate coupon.");
      }

      applyCoupon(data.coupon);
      setCheckoutCouponCode("");
    } catch (err: any) {
      setCouponError(err.message || "Invalid coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // 1. Prepare payload for backend order creation
      const checkoutPayload: any = {
        items: items.map((it) => ({
          variantId: it.variantId,
          quantity: it.quantity,
        })),
        shippingAddress: {
          fullName: shippingForm.name,
          phoneNumber: shippingForm.phone,
          street: shippingForm.street,
          landmark: shippingForm.apartment || undefined,
          city: shippingForm.city,
          state: shippingForm.state,
          postalCode: shippingForm.pincode,
          country: "India",
        },
        billingAddress: !sameAsShipping
          ? {
              fullName: billingForm.name,
              phoneNumber: billingForm.phone,
              street: billingForm.street,
              landmark: billingForm.apartment || undefined,
              city: billingForm.city,
              state: billingForm.state,
              postalCode: billingForm.pincode,
              country: "India",
            }
          : undefined,
        paymentMethod,
        customerNotes: orderNotes.trim() || undefined,
        couponCode: appliedCoupon?.code || undefined,
        guestEmail: !sessionUser ? shippingForm.email : undefined,
        guestPhone: !sessionUser ? shippingForm.phone : undefined,
        guestName: !sessionUser ? shippingForm.name : undefined,
      };

      const res = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create order. Please verify your address.");
      }

      // Case A: Cash on Delivery (COD)
      if (paymentMethod === "COD") {
        setOrderSuccessNumber(data.order.orderNumber);
        clearCart();
        setIsProcessing(false);
        return;
      }

      // Case B: Online Payment with Razorpay
      const keyId = data.order.razorpayKeyId;
      const isPlaceholder = !keyId || keyId === "rzp_test_placeholder" || keyId.includes("placeholder");

      // Check if real window.Razorpay checkout is available and key is configured
      if (typeof window !== "undefined" && (window as any).Razorpay && !isPlaceholder) {
        const options = {
          key: keyId,
          amount: Math.round(data.order.grandTotal * 100),
          currency: "INR",
          name: "ORGANICHY",
          description: `Pure Nutrition Order #${data.order.orderNumber}`,
          image: "/logo.png",
          order_id: data.order.razorpayOrderId,
          prefill: {
            name: shippingForm.name,
            email: shippingForm.email,
            contact: shippingForm.phone,
          },
          theme: {
            color: "#143E2B", // ORGANICHY brand dark green
          },
          handler: async function (response: any) {
            try {
              // 8. Cryptographically verify signature on backend
              const verifyRes = await fetch("/api/payments/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.order.id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                setOrderSuccessNumber(data.order.orderNumber);
                clearCart();
              } else {
                setErrorMessage(verifyData.error || "Payment verification failed. Please contact support.");
              }
            } catch (err: any) {
              setErrorMessage("Network error during payment verification. Please check your order status.");
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setErrorMessage("Payment was cancelled or closed. You can retry whenever ready.");
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);

        rzp.on("payment.failed", async function (failureResp: any) {
          try {
            await fetch("/api/payments/razorpay/failed", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.order.id,
                razorpayOrderId: data.order.razorpayOrderId,
                errorCode: failureResp.error?.code,
                errorDescription: failureResp.error?.description,
              }),
            });
          } catch (e) {}

          setErrorMessage(`Payment Failed: ${failureResp.error?.description || "Transaction declined."}`);
          setIsProcessing(false);
        });

        rzp.open();
      } else {
        // Fallback Sandbox Simulation modal (for development or sandbox testing)
        setSandboxModalData({
          orderId: data.order.id,
          orderNumber: data.order.orderNumber,
          razorpayOrderId: data.order.razorpayOrderId || `order_dev_${Date.now()}`,
          amount: data.order.grandTotal,
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  // Sandbox Test Simulator Handlers
  const handleSandboxSimulateSuccess = async () => {
    if (!sandboxModalData) return;
    setIsProcessing(true);

    try {
      const mockPaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const verifyRes = await fetch("/api/payments/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: sandboxModalData.orderId,
          razorpayOrderId: sandboxModalData.razorpayOrderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: "dev_mock_signature",
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success) {
        setOrderSuccessNumber(sandboxModalData.orderNumber);
        setSandboxModalData(null);
        clearCart();
      } else {
        setErrorMessage(verifyData.error || "Simulated payment verification failed.");
      }
    } catch (err: any) {
      setErrorMessage("Error verifying simulated payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSandboxSimulateFailure = async () => {
    if (!sandboxModalData) return;
    setIsProcessing(true);

    try {
      await fetch("/api/payments/razorpay/failed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: sandboxModalData.orderId,
          razorpayOrderId: sandboxModalData.razorpayOrderId,
          errorCode: "SIMULATED_TEST_DECLINE",
          errorDescription: "Customer card / UPI authorization declined in sandbox test",
        }),
      });
      setErrorMessage("Simulated Payment Declined: Issuing bank declined transaction.");
      setSandboxModalData(null);
    } catch (e) {
    } finally {
      setIsProcessing(false);
    }
  };

  // Order Confirmed Success Screen
  if (orderSuccessNumber) {
    return (
      <div className="py-16 bg-brand-cream-50 min-h-screen flex items-center justify-center font-sans">
        <div className="max-w-md w-full mx-4 p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-brand-mint-100 text-brand-green-900 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-brand-green-800" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
              ORDER CONFIRMED
            </span>
            <h1 className="text-2xl font-heading font-black text-brand-green-950">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-brand-charcoal-500">
              We have received your order and our roastery in Moradabad, Uttar Pradesh is preparing your fresh nutrition batch.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 text-left space-y-1">
            <span className="text-[10px] text-brand-charcoal-500 uppercase tracking-widest font-bold block">
              Order Reference Number:
            </span>
            <span className="font-mono font-black text-base text-brand-green-900 block">
              {orderSuccessNumber}
            </span>
            <p className="text-[11px] text-brand-charcoal-500 pt-1">
              Payment Method: {paymentMethod === "RAZORPAY" ? "Online Prepaid (Razorpay / UPI)" : "Cash on Delivery (COD)"}
            </p>
            {orderNotes && (
              <p className="text-[11px] text-brand-charcoal-600 pt-1 italic">
                Notes: &ldquo;{orderNotes}&rdquo;
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href={`/order-tracking?orderId=${orderSuccessNumber}`}
              className="w-full py-3.5 px-6 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide transition flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Track Your Order</span>
              <Truck className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              className="w-full py-3 px-6 rounded-full border border-brand-cream-300 hover:border-brand-green-800 text-brand-charcoal-700 hover:text-brand-green-900 font-heading font-bold text-xs tracking-wide transition block"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="py-20 text-center bg-brand-cream-50 min-h-screen flex flex-col items-center justify-center space-y-4 font-sans">
        <h2 className="font-heading font-black text-2xl text-brand-charcoal-900">
          Your cart is empty
        </h2>
        <p className="text-xs text-brand-charcoal-500 max-w-sm">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-full bg-brand-green-900 text-brand-cream-100 font-bold text-xs"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-brand-cream-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-brand-cream-300 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Fast &amp; Secure Checkout
              </span>
              <span className="text-xs text-brand-charcoal-400">•</span>
              <span className="text-xs text-brand-charcoal-500 font-semibold">
                Moradabad Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 tracking-tight mt-1">
              Complete Your Order
            </h1>
            <p className="text-xs text-brand-charcoal-500">
              Dispatched with Delhivery, Blue Dart &amp; DTDC directly from Moradabad, UP.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-green-800 font-semibold bg-brand-mint-100 px-3.5 py-1.5 rounded-full border border-brand-mint-200 self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Razorpay Checkout</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Account vs Guest Status Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          {sessionUser ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-mint-100 text-brand-green-900 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brand-green-800 uppercase tracking-wider block">
                  Logged In Customer
                </span>
                <span className="text-xs font-heading font-black text-brand-green-950">
                  {sessionUser.name} ({sessionUser.email})
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-cream-200 text-brand-charcoal-600 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase tracking-wider block">
                  Guest Checkout
                </span>
                <span className="text-xs text-brand-charcoal-700">
                  Checking out as guest. Have an account?
                </span>
              </div>
            </div>
          )}

          {!sessionUser && (
            <Link
              href="/login?redirect=/checkout"
              className="text-xs font-heading font-bold text-brand-green-800 hover:text-brand-green-900 underline whitespace-nowrap"
            >
              Log In to access saved addresses &rarr;
            </Link>
          )}
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Form: Details, Shipping & Billing */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Customer Contact */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4">
              <h2 className="font-heading font-black text-base text-brand-charcoal-900 border-b border-brand-cream-200 pb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-green-900 text-brand-cream-100 text-xs flex items-center justify-center font-bold">1</span>
                <span>Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Email Address (for order tracking) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={shippingForm.email}
                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Mobile Phone (10-digit India) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4">
              <h2 className="font-heading font-black text-base text-brand-charcoal-900 border-b border-brand-cream-200 pb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-green-900 text-brand-cream-100 text-xs flex items-center justify-center font-bold">2</span>
                <span>Shipping Address</span>
              </h2>

              {/* Saved Address Quick Selector (For Logged In Users) */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3 pb-3 border-b border-brand-cream-200">
                  <span className="text-[11px] font-heading font-bold text-brand-charcoal-700 uppercase tracking-wider block">
                    Select a Saved Address:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition space-y-1 ${
                          selectedAddressId === addr.id
                            ? "border-brand-green-900 bg-brand-mint-50/50 shadow-xs"
                            : "border-brand-cream-300 bg-white hover:border-brand-cream-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-charcoal-900">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-mint-100 text-brand-green-900">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-brand-charcoal-600 line-clamp-2">
                          {addr.street}, {addr.city} - {addr.postalCode}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAddressId("NEW");
                      setShippingForm((prev) => ({
                        ...prev,
                        street: "",
                        apartment: "",
                        pincode: "",
                      }));
                    }}
                    className="text-xs font-bold text-brand-green-800 hover:text-brand-green-900 underline block"
                  >
                    + Or enter a different shipping address
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sourav Sharma"
                    value={shippingForm.name}
                    onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Street Address &amp; House / Flat No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House / Flat No., Society, Street Name"
                    value={shippingForm.street}
                    onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                    className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Landmark / Apartment / Area (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Near City Gym / Main Market"
                    value={shippingForm.apartment}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, apartment: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-charcoal-800">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Moradabad"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-charcoal-800">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-charcoal-800">
                      PIN Code (6 digits) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="244001"
                      value={shippingForm.pincode}
                      onChange={(e) => setShippingForm({ ...shippingForm, pincode: e.target.value })}
                      className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Billing Address Selection & Toggle */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4">
              <h2 className="font-heading font-black text-base text-brand-charcoal-900 border-b border-brand-cream-200 pb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-green-900 text-brand-cream-100 text-xs flex items-center justify-center font-bold">3</span>
                <span>Billing Address</span>
              </h2>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl border border-brand-cream-300 bg-brand-cream-50/60 hover:bg-brand-cream-50 transition">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="rounded border-brand-cream-400 text-brand-green-900 focus:ring-brand-mint-400 w-4 h-4"
                />
                <span className="text-xs font-bold text-brand-charcoal-900">
                  Billing address is the same as my shipping address
                </span>
              </label>

              {/* Expanded Billing Address Form */}
              {!sameAsShipping && (
                <div className="space-y-4 pt-3 border-t border-brand-cream-200 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-charcoal-800">
                        Billing Name / Company *
                      </label>
                      <input
                        type="text"
                        required={!sameAsShipping}
                        placeholder="Full Legal Name / Company"
                        value={billingForm.name}
                        onChange={(e) => setBillingForm({ ...billingForm, name: e.target.value })}
                        className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-charcoal-800">
                        Billing Phone Number *
                      </label>
                      <input
                        type="tel"
                        required={!sameAsShipping}
                        placeholder="Phone Number"
                        value={billingForm.phone}
                        onChange={(e) => setBillingForm({ ...billingForm, phone: e.target.value })}
                        className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-charcoal-800">
                      Billing Street Address *
                    </label>
                    <input
                      type="text"
                      required={!sameAsShipping}
                      placeholder="Street / Office / Flat Address"
                      value={billingForm.street}
                      onChange={(e) => setBillingForm({ ...billingForm, street: e.target.value })}
                      className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-charcoal-800">
                        City *
                      </label>
                      <input
                        type="text"
                        required={!sameAsShipping}
                        value={billingForm.city}
                        onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                        className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-charcoal-800">
                        State *
                      </label>
                      <input
                        type="text"
                        required={!sameAsShipping}
                        value={billingForm.state}
                        onChange={(e) => setBillingForm({ ...billingForm, state: e.target.value })}
                        className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-charcoal-800">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required={!sameAsShipping}
                        maxLength={6}
                        value={billingForm.pincode}
                        onChange={(e) => setBillingForm({ ...billingForm, pincode: e.target.value })}
                        className="w-full p-3 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Payment Method Selection */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4">
              <h2 className="font-heading font-black text-base text-brand-charcoal-900 border-b border-brand-cream-200 pb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-green-900 text-brand-cream-100 text-xs flex items-center justify-center font-bold">4</span>
                <span>Select Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Razorpay Online Option */}
                <label
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`p-4 rounded-2xl border transition flex items-start gap-4 cursor-pointer ${
                    paymentMethod === "RAZORPAY"
                      ? "border-brand-green-900 bg-brand-mint-50/40 shadow-xs"
                      : "border-brand-cream-300 bg-white hover:bg-brand-cream-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                    className="mt-1 text-brand-green-900 focus:ring-brand-mint-400"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-sm text-brand-charcoal-900">
                        Razorpay Secure Online Payment
                      </span>
                      <span className="text-[10px] font-bold text-brand-green-800 bg-brand-mint-100 px-2.5 py-0.5 rounded-full">
                        Instant &amp; Zero Fee
                      </span>
                    </div>

                    <p className="text-xs text-brand-charcoal-500">
                      Pay securely with your preferred Indian payment method:
                    </p>

                    {/* Method Badges */}
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 font-semibold border border-blue-200">
                        <Smartphone className="w-3 h-3" />
                        <span>UPI (GPay / PhonePe / Paytm / BHIM)</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200">
                        <CreditCard className="w-3 h-3" />
                        <span>Debit / Credit Cards (RuPay, Visa, MC)</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200">
                        <Landmark className="w-3 h-3" />
                        <span>Net Banking (50+ Banks)</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 font-semibold border border-purple-200">
                        <Wallet className="w-3 h-3" />
                        <span>Wallets</span>
                      </span>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 rounded-2xl border transition flex items-start gap-4 cursor-pointer ${
                    paymentMethod === "COD"
                      ? "border-brand-green-900 bg-brand-mint-50/40 shadow-xs"
                      : "border-brand-cream-300 bg-white hover:bg-brand-cream-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="mt-1 text-brand-green-900 focus:ring-brand-mint-400"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-sm text-brand-charcoal-900">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] font-semibold text-brand-charcoal-500">
                        +₹{BRAND.policies.codFee} courier fee
                      </span>
                    </div>
                    <p className="text-xs text-brand-charcoal-500">
                      Pay cash to Delhivery / Blue Dart courier upon parcel delivery.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Optional Customer Order Notes */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-green-800" />
                <label htmlFor="checkoutNotes" className="text-xs font-heading font-bold text-brand-charcoal-900">
                  Delivery Instructions / Order Notes (Optional)
                </label>
              </div>
              <textarea
                id="checkoutNotes"
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Leave package with apartment security guard, call before delivery."
                className="w-full p-3 rounded-2xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-white"
              />
            </div>

          </div>

          {/* Right Column: Order Summary & Real-Time Calculation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6 sticky top-28">
              <h3 className="font-heading font-black text-lg text-brand-charcoal-900 border-b border-brand-cream-200 pb-3">
                Order Review ({items.length} items)
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-brand-cream-200">
                {items.map((item) => (
                  <div key={item.variantId} className="pt-2 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-cream-100 border border-brand-cream-300 shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-brand-charcoal-900 block line-clamp-1">{item.title}</span>
                        <span className="text-brand-charcoal-500">{item.weight} &times; {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-brand-green-900">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Section in Checkout */}
              <div className="border-t border-brand-cream-200 pt-3 space-y-2">
                <span className="text-[11px] font-heading font-bold text-brand-charcoal-700 block uppercase tracking-wider">
                  Discount Coupon
                </span>

                {appliedCoupon ? (
                  <div className="p-3 rounded-2xl bg-brand-mint-100/70 border border-brand-mint-300 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-brand-green-800" />
                        <span className="font-mono font-black text-xs text-brand-green-950">
                          {appliedCoupon.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-green-800">
                        {appliedCoupon.discountType === "FREE_SHIPPING"
                          ? "Free express shipping unlocked"
                          : `Saved ${formatINR(discountTotal)}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 px-2 py-1 rounded-md hover:bg-rose-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Coupon (e.g. ORGANICHY10)"
                        value={checkoutCouponCode}
                        onChange={(e) => setCheckoutCouponCode(e.target.value.toUpperCase())}
                        className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !checkoutCouponCode.trim()}
                        className="px-4 py-2.5 rounded-xl bg-brand-cream-200 hover:bg-brand-cream-300 text-brand-green-950 font-heading font-bold text-xs transition disabled:opacity-50"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{couponError}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Calculations */}
              <div className="border-t border-brand-cream-200 pt-3 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-brand-charcoal-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-brand-charcoal-900">{formatINR(subtotal)}</span>
                </div>

                {discountTotal > 0 && (
                  <div className="flex justify-between text-brand-green-800 font-bold">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span>-{formatINR(discountTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-brand-charcoal-600">
                  <span>Shipping</span>
                  <span>{isFreeShipping ? <strong className="text-brand-green-700">FREE</strong> : formatINR(shippingFee)}</span>
                </div>

                {paymentMethod === "COD" && (
                  <div className="flex justify-between text-brand-charcoal-600">
                    <span>COD Convenience Fee</span>
                    <span>{formatINR(codFee)}</span>
                  </div>
                )}

                <div className="border-t border-brand-cream-200 pt-3 flex justify-between text-base font-heading font-black text-brand-green-950">
                  <span>Grand Total</span>
                  <span>{formatINR(grandTotal)}</span>
                </div>
              </div>

              {/* Complete Order CTA (With Duplicate Prevention) */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-sm tracking-wide shadow-card hover:shadow-hover transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-brand-cream-100 border-t-transparent rounded-full animate-spin" />
                      <span>Opening Razorpay Secure Gateway...</span>
                    </span>
                  ) : (
                    <>
                      <span>
                        {paymentMethod === "RAZORPAY"
                          ? `Pay ${formatINR(grandTotal)} with Razorpay`
                          : `Confirm COD Order (${formatINR(grandTotal)})`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-brand-charcoal-500 text-center">
                  By clicking Place Order, you agree to ORGANICHY&apos;s Terms of Service and Shipping Policy.
                </p>
              </div>

            </div>
          </div>

        </form>

      </div>

      {/* Razorpay Interactive Sandbox Simulator Modal (For Dev & Testing) */}
      {sandboxModalData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-brand-cream-300 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-green-950 text-white flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-brand-green-950">
                    Razorpay Sandbox Gateway
                  </h3>
                  <span className="text-[10px] font-mono text-brand-charcoal-500">
                    Order: {sandboxModalData.orderNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSandboxModalData(null)}
                className="p-1.5 rounded-full hover:bg-brand-cream-100 text-brand-charcoal-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-brand-cream-100 text-center space-y-1">
              <span className="text-[11px] font-bold text-brand-charcoal-500 uppercase tracking-wider">
                Total Payable Amount
              </span>
              <div className="text-3xl font-heading font-black text-brand-green-950">
                {formatINR(sandboxModalData.amount)}
              </div>
            </div>

            {/* Test Payment Methods */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-charcoal-800 block">
                Select Test Instrument:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSandboxMethod("UPI")}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                    selectedSandboxMethod === "UPI"
                      ? "border-brand-green-900 bg-brand-mint-50/60 text-brand-green-950"
                      : "border-brand-cream-300 bg-white text-brand-charcoal-700"
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-blue-700" />
                  <span>UPI (success@razorpay)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSandboxMethod("CARD")}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                    selectedSandboxMethod === "CARD"
                      ? "border-brand-green-900 bg-brand-mint-50/60 text-brand-green-950"
                      : "border-brand-cream-300 bg-white text-brand-charcoal-700"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>Card (4111...)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSandboxMethod("NETBANKING")}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                    selectedSandboxMethod === "NETBANKING"
                      ? "border-brand-green-900 bg-brand-mint-50/60 text-brand-green-950"
                      : "border-brand-cream-300 bg-white text-brand-charcoal-700"
                  }`}
                >
                  <Landmark className="w-4 h-4 text-indigo-700" />
                  <span>HDFC / SBI NetBanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSandboxMethod("WALLET")}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                    selectedSandboxMethod === "WALLET"
                      ? "border-brand-green-900 bg-brand-mint-50/60 text-brand-green-950"
                      : "border-brand-cream-300 bg-white text-brand-charcoal-700"
                  }`}
                >
                  <Wallet className="w-4 h-4 text-purple-700" />
                  <span>Paytm / Mobikwik</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                Razorpay signature will be verified on the backend before order status is upgraded to PAID.
              </span>
            </div>

            {/* Simulation Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSandboxSimulateSuccess}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Simulate Successful Payment ({formatINR(sandboxModalData.amount)})</span>
                <CheckCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSandboxSimulateFailure}
                disabled={isProcessing}
                className="w-full py-2.5 px-6 rounded-full border border-rose-300 hover:bg-rose-50 text-rose-700 font-bold text-xs transition block text-center"
              >
                Simulate Payment Failure / Bank Timeout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
