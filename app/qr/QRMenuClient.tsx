'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { Wifi, Star, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { ApiMenuSection, ApiPublicMenuSettings } from '@/lib/api/types';

interface QRMenuClientProps {
  sections: ApiMenuSection[];
  settings: ApiPublicMenuSettings | null;
}

export default function QRMenuClient({ sections, settings }: QRMenuClientProps) {
  const [wifiModalOpen, setWifiModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    return new Set(sections.map(s => s.id));
  });

  const wifiEnabled = settings?.wifiEnabled ?? false;
  const googleReviewEnabled = settings?.googleReviewEnabled ?? false;

  useEffect(() => {
    if (wifiModalOpen && settings?.wifiSsid && settings?.wifiPassword) {
      const wifiString = `WIFI:T:WPA;S:${settings.wifiSsid};P:${settings.wifiPassword};;`;
      QRCode.toDataURL(wifiString, {
        width: 280,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      }).then(setQrDataUrl).catch(console.error);
    }
  }, [wifiModalOpen, settings]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-black text-cream pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-center py-4 px-4">
          <Image
            src="/images/club-mareva-logo-gold.svg"
            alt="Club Mareva Beirut"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </div>
      </header>

      {/* Action Buttons Row */}
      {(wifiEnabled || googleReviewEnabled) && (
        <div className="flex items-center justify-center gap-3 px-4 py-4">
          {wifiEnabled && (
            <button
              onClick={() => setWifiModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full text-cream text-sm font-medium transition-all active:scale-95"
            >
              <Wifi className="w-4 h-4 text-gold" />
              Connect to WiFi
            </button>
          )}
          {googleReviewEnabled && settings?.googleReviewUrl && (
            <a
              href={settings.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full text-cream text-sm font-medium transition-all active:scale-95"
            >
              <Star className="w-4 h-4 text-gold" />
              Leave a Review
            </a>
          )}
        </div>
      )}

      {/* Menu Sections */}
      <div className="px-4 space-y-2">
        {sections.map((section) => (
          <div key={section.id} className="border border-white/10 rounded-xl overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-center gap-3">
                {section.icon && (
                  <span className="text-xl">{section.icon}</span>
                )}
                <div className="text-left">
                  <h2 className="text-base font-semibold text-white tracking-wide">
                    {section.name}
                  </h2>
                  {section.description && (
                    <p className="text-xs text-white/50 mt-0.5">{section.description}</p>
                  )}
                </div>
              </div>
              {expandedSections.has(section.id) ? (
                <ChevronUp className="w-5 h-5 text-white/40" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white/40" />
              )}
            </button>

            {/* Section Items */}
            {expandedSections.has(section.id) && (
              <div className="divide-y divide-white/5">
                {section.groups.map((group, gi) => (
                  <div key={gi}>
                    {/* Family Header */}
                    {group.type === 'family' && group.family && (
                      <div className="px-5 pt-3 pb-1">
                        <h3 className="text-sm font-semibold text-gold tracking-wider uppercase">
                          {group.family.name}
                        </h3>
                      </div>
                    )}
                    {/* Items */}
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="px-5 py-3 flex items-start justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-white font-medium">
                              {item.displayName || item.name}
                            </span>
                            {item.abv && (
                              <span className="text-[11px] text-white/40">
                                {item.abv}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-white/40 mt-0.5 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          {item.details && (
                            <p className="text-[11px] text-white/30 mt-0.5">
                              {item.details}
                            </p>
                          )}
                        </div>
                        {item.price && (
                          <span className="text-sm text-gold font-medium whitespace-nowrap">
                            ${item.price}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-16 text-white/40">
            <p className="text-lg">Menu coming soon</p>
          </div>
        )}
      </div>

      {/* WiFi Modal */}
      {wifiModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setWifiModalOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className="relative w-full sm:max-w-sm bg-[#1A1A1A] border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setWifiModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6 text-gold" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-1">
                Connect to WiFi
              </h3>
              <p className="text-sm text-white/50 mb-5">
                Scan the QR code below to connect automatically
              </p>

              {/* QR Code */}
              {qrDataUrl ? (
                <div className="bg-white rounded-xl p-3 mb-5">
                  <img
                    src={qrDataUrl}
                    alt="WiFi QR Code"
                    width={280}
                    height={280}
                    className="w-[280px] h-[280px]"
                  />
                </div>
              ) : (
                <div className="w-[280px] h-[280px] bg-white/5 rounded-xl flex items-center justify-center mb-5">
                  <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Network Info */}
              <div className="w-full space-y-2 text-left">
                <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg">
                  <span className="text-xs text-white/40">Network</span>
                  <span className="text-sm text-white font-medium">{settings?.wifiSsid}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg">
                  <span className="text-xs text-white/40">Password</span>
                  <span className="text-sm text-white font-medium font-mono">{settings?.wifiPassword}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
