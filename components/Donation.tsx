"use client";
import { useState } from "react";
import { QrCode, Heart, Shield, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Donation({ 
  qrUrl,
  upiId,
  upiName,
  upiNote,
}: { 
  qrUrl?: string;
  upiId?: string;
  upiName?: string;
  upiNote?: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const defaultName = upiName || "Hanuman Mandir";
  const defaultNote = upiNote || "Temple Donation";
  
  // Standard UPI deep link format
  const upiDeepLink = upiId 
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(defaultName)}&tn=${encodeURIComponent(defaultNote)}`
    : null;



  return (
    <>
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="donation" aria-label="Donation and Seva">
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-1 shadow-2xl">
          <div className="bg-white rounded-[22px] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: Info */}
              <article className="p-6 sm:p-10 md:p-14">
                <header>
                  <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                    <Heart size={14} fill="currentColor" aria-hidden="true" /> Support The Temple
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                    Make a<br />
                    <span className="text-orange-600">Seva Donation</span>
                  </h2>
                </header>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                  Your generous contribution helps maintain the temple, light the daily diyas, and support village events. Every rupee counts as seva.
                </p>

                <ul className="space-y-3 mb-8" aria-label="Donation Benefits">
                  {[
                    { icon: Shield, text: "Secure UPI Transfer" },
                    { icon: FileText, text: "Transparent records published publicly" },
                    { icon: Heart, text: "100% goes to temple maintenance & events" },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-gray-700 font-medium">
                      <span className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Icon size={14} className="text-orange-600" />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/donors"
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm underline underline-offset-4"
                  aria-label="View all donors"
                >
                  View all donors →
                </Link>
              </article>

              {/* Right: QR */}
              <aside className="bg-orange-50 flex flex-col items-center justify-center p-6 sm:p-10 md:p-14" aria-label="QR Code for Donation">
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-6">Scan to Donate</p>
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-orange-100 flex flex-col items-center w-full max-w-sm">
                  <div className="w-44 sm:w-52 h-44 sm:h-52 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-orange-200 overflow-hidden relative mb-5">
                    {qrUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrUrl}
                        alt="Donate via UPI QR Code — Hanuman Mandir Darekarwadi"
                        className="w-full h-full object-contain z-10 relative"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center z-0">
                        <QrCode size={64} className="text-orange-200" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <p className="font-bold text-gray-800 text-xl text-center">{defaultName}</p>
                  <p className="text-gray-400 text-sm mt-1 mb-2">UPI / GPay / PhonePe</p>

                  {upiDeepLink && (
                    <div className="w-full mt-4 flex flex-col items-center">
                      <a
                        href={upiDeepLink}
                        onClick={(e) => {
                          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                            || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1)
                            || window.screen.width <= 768;
                          
                          if (!isMobile) {
                            e.preventDefault();
                            setShowModal(true);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold py-3.5 px-6 rounded-xl text-center shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Shield size={18} />
                        Pay Now with UPI
                      </a>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Fallback Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center relative border border-orange-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
              <QrCode size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Scan to Donate</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              UPI payments are available on supported mobile devices. Please scan the QR Code to donate.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-xl transition-colors active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
