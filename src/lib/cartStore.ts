import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItemType } from "@/types";
import { BRAND } from "@/lib/constants";

export interface AppliedCoupon {
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  discountValue: number;
  amountSaved: number;
  minOrderValue?: number;
  maxDiscountValue?: number | null;
}

interface CartState {
  items: CartItemType[];
  isOpen: boolean;
  appliedCoupon: AppliedCoupon | null;
  orderNotes: string;

  // Actions
  addItem: (item: CartItemType) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  setOrderNotes: (notes: string) => void;

  // Computed Helpers
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountTotal: () => number;
  getShippingFee: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,
      orderNotes: "",

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.variantId === newItem.variantId
          );

          let updatedItems: CartItemType[];
          if (existingIndex > -1) {
            updatedItems = [...state.items];
            const newQty = Math.min(50, updatedItems[existingIndex].quantity + newItem.quantity);
            updatedItems[existingIndex].quantity = newQty;
          } else {
            updatedItems = [...state.items, { ...newItem, quantity: Math.min(50, newItem.quantity) }];
          }

          return { items: updatedItems, isOpen: true };
        });
      },

      removeItem: (variantId) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.variantId !== variantId);
          // If cart becomes empty, remove coupon
          const shouldClearCoupon = updatedItems.length === 0;
          return {
            items: updatedItems,
            appliedCoupon: shouldClearCoupon ? null : state.appliedCoupon,
          };
        });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        const clampedQty = Math.min(50, Math.max(1, quantity));

        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity: clampedQty } : item
          ),
        }));
      },

      clearCart: () =>
        set({
          items: [],
          appliedCoupon: null,
          orderNotes: "",
          isOpen: false,
        }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
      removeCoupon: () => set({ appliedCoupon: null }),
      setOrderNotes: (notes) => set({ orderNotes: notes }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getDiscountTotal: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().appliedCoupon;
        if (!coupon || subtotal <= 0) return 0;

        if (coupon.discountType === "PERCENTAGE") {
          const raw = (subtotal * coupon.discountValue) / 100;
          return Math.round(
            coupon.maxDiscountValue ? Math.min(raw, coupon.maxDiscountValue) : raw
          );
        } else if (coupon.discountType === "FIXED") {
          return Math.round(Math.min(coupon.discountValue, subtotal));
        } else if (coupon.discountType === "FREE_SHIPPING") {
          return 0; // Handled in shipping calculation
        }
        return 0;
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().appliedCoupon;
        const discount = get().getDiscountTotal();
        const discountedSubtotal = Math.max(0, subtotal - discount);

        if (
          coupon?.discountType === "FREE_SHIPPING" ||
          discountedSubtotal >= BRAND.policies.freeShippingThreshold
        ) {
          return 0;
        }
        return BRAND.policies.standardShippingFee;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal <= 0) return 0;
        const discount = get().getDiscountTotal();
        const shipping = get().getShippingFee();
        return Math.max(0, Math.round(subtotal - discount + shipping));
      },
    }),
    {
      name: "organichy_cart_storage",
      // Only persist items, coupon, and notes - not modal open states
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
        orderNotes: state.orderNotes,
      }),
    }
  )
);
