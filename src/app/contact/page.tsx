"use client";

import { useState, useEffect } from "react";
import { BRAND } from "@/lib/constants";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Send,
  CheckCircle,
  Instagram,
  Facebook,
  Youtube,
  Clock,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "GENERAL",
    message: "",
  });

  const [contactEmail, setContactEmail] = useState(BRAND.supportEmail);
  const [contactPhone, setContactPhone] = useState(BRAND.supportPhone);
  const [contactWhatsApp, setContactWhatsApp] = useState(BRAND.whatsappNumber);
  const [contactAddress, setContactAddress] = useState(BRAND.location);
  const [contactHours, setContactHours] = useState("Monday to Saturday, 9:00 AM - 7:00 PM IST");

  useEffect(() => {
    async function loadContactCms() {
      try {
        const res = await fetch("/api/cms/sections?key=contact_information");
        const data = await res.json();
        if (data.success && data.data?.metadata) {
          const meta = data.data.metadata;
          if (meta.email) setContactEmail(meta.email);
          if (meta.phone) setContactPhone(meta.phone);
          if (meta.whatsapp) setContactWhatsApp(meta.whatsapp);
          if (meta.address) setContactAddress(meta.address);
          if (meta.businessHours) setContactHours(meta.businessHours);
        }
      } catch (e) {}
    }
    loadContactCms();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-brand-cream-50 min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200">
            <Mail className="w-3.5 h-3.5 text-brand-green-800" />
            <span>WE ARE HERE TO HELP</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-brand-green-900 tracking-tight leading-tight">
            Contact ORGANICHY
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal-600 leading-relaxed">
            Have questions about our slow-roasting process, shipping to your city, or bulk wholesale orders for your gym? Connect with Sourav and our team in Moradabad.
          </p>
        </div>

        {/* Contact Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-card space-y-6">
              <h3 className="font-heading font-black text-xl text-brand-green-900 border-b border-brand-cream-200 pb-4">
                Direct Channels
              </h3>

              <div className="space-y-5 text-xs sm:text-sm">
                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-brand-cream-100 flex items-center justify-center shrink-0 text-brand-green-900 border border-brand-cream-300">
                    <MapPin className="w-5 h-5 text-brand-green-800" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-charcoal-900">
                      Headquarters & Facility
                    </h4>
                    <p className="text-xs text-brand-charcoal-500 mt-0.5">
                      {contactAddress}
                    </p>
                    <span className="text-[10px] text-brand-mint-600 font-semibold block mt-0.5">
                      Dispatched with Indian Speed Post & Delhivery
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-brand-cream-100 flex items-center justify-center shrink-0 text-brand-green-900 border border-brand-cream-300">
                    <Mail className="w-5 h-5 text-brand-green-800" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-charcoal-900">
                      Email Support
                    </h4>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-xs text-brand-green-900 font-semibold hover:underline block mt-0.5"
                    >
                      {contactEmail}
                    </a>
                    <span className="text-[10px] text-brand-charcoal-400 block">
                      Guaranteed reply within 24 hours
                    </span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#25D366]/10 flex items-center justify-center shrink-0 text-[#25D366] border border-[#25D366]/30">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-charcoal-900">
                      WhatsApp Quick Support
                    </h4>
                    <a
                      href={`https://wa.me/${contactWhatsApp.replace(/[^0-9]/g, "")}?text=Hi%20ORGANICHY`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#25D366] hover:underline block mt-0.5"
                    >
                      Chat with Customer Care &rarr;
                    </a>
                    <span className="text-[10px] text-brand-charcoal-400 block">
                      Direct line: {contactWhatsApp}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-brand-cream-100 flex items-center justify-center shrink-0 text-brand-green-900 border border-brand-cream-300">
                    <Phone className="w-5 h-5 text-brand-green-800" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-charcoal-900">
                      Phone Line
                    </h4>
                    <p className="text-xs text-brand-charcoal-600 mt-0.5">
                      {contactPhone}
                    </p>
                    <span className="text-[10px] text-brand-charcoal-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {contactHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-brand-cream-200">
                <span className="text-xs font-bold text-brand-charcoal-700 block mb-3">
                  Follow Our Athletic Community:
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={BRAND.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-brand-cream-100 text-brand-charcoal-700 hover:text-brand-green-900 hover:bg-brand-mint-100 transition"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={BRAND.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-brand-cream-100 text-brand-charcoal-700 hover:text-brand-green-900 hover:bg-brand-mint-100 transition"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={BRAND.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-brand-cream-100 text-brand-charcoal-700 hover:text-brand-green-900 hover:bg-brand-mint-100 transition"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Wholesale Callout */}
            <div id="wholesale" className="p-6 rounded-3xl bg-brand-green-900 text-brand-cream-100 space-y-2">
              <span className="text-[10px] font-bold text-brand-mint-300 uppercase tracking-widest block">
                GYM OWNERS & NUTRITION STORES
              </span>
              <h4 className="font-heading font-black text-lg text-white">
                Bulk Wholesale Inquiries
              </h4>
              <p className="text-xs text-brand-cream-200/80 leading-relaxed">
                Looking to stock 100% natural, freshly roasted peanut butter jars in your gym, fitness café, or sports club? Select &ldquo;Bulk / Wholesale&rdquo; in the form.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-card space-y-6">
              <div className="border-b border-brand-cream-200 pb-4">
                <h3 className="font-heading font-black text-2xl text-brand-green-900">
                  Send Us a Message
                </h3>
                <p className="text-xs text-brand-charcoal-500 mt-1">
                  Fill in your details below and our customer team will respond shortly.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-brand-mint-50 border border-brand-mint-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-brand-mint-400 text-brand-green-950 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-black text-lg text-brand-green-900">
                    Message Received!
                  </h4>
                  <p className="text-xs text-brand-charcoal-600 max-w-sm mx-auto">
                    Thank you for reaching out. Founder Sourav and the customer care team will review your message and reply via email or WhatsApp within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 rounded-full bg-brand-green-900 text-brand-cream-100 text-xs font-bold"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-heading font-bold text-brand-charcoal-800">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Sourav Sharma"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full p-3.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-heading font-bold text-brand-charcoal-800">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full p-3.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-heading font-bold text-brand-charcoal-800">
                        Phone Number (WhatsApp)
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full p-3.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-heading font-bold text-brand-charcoal-800">
                        Subject / Inquiry Type
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full p-3.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                      >
                        <option value="GENERAL">General Product Question</option>
                        <option value="ORDER">Order Tracking & Shipping</option>
                        <option value="WHOLESALE">Bulk Gym / Wholesale Order</option>
                        <option value="FEEDBACK">Feedback or Quality Check</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-bold text-brand-charcoal-800">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us what you need help with..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full p-3.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide transition shadow-card flex items-center justify-center gap-2"
                  >
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

