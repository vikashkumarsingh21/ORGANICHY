"use client";

import { BRAND } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

export default function WhatsAppPill() {
  return (
    <a
      href={BRAND.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ORGANICHY on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-elevated hover:bg-[#20bd5a] hover:scale-105 transition-all text-xs font-semibold group"
    >
      <MessageCircle className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
      <span className="hidden md:inline">WhatsApp Support</span>
    </a>
  );
}

