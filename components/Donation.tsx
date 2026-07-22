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
  qrUrl?: string | null;
  upiId?: string | null;
  upiName?: string | null;
  upiNote?: string | null;
}) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const displayName = upiName || "Hanuman Mandir";
  const displayNote = upiNote || "Temple Donation";

  // Standard UPI deep link — only built when an active UPI ID exists in the database
  const upiDeepLink = upiId
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(displayName)}&tn=${encodeURIComponent(displayNote)}`
    : null;



  return (
    <>
      <section className="py-2 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full max-w-[100vw] overflow-x-hidden sm:overflow-visible" id="donation" aria-label="Donation and Seva">
        <header className="text-center mb-4 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Heart className="text-orange-500 flex-shrink-0" size={32} aria-hidden="true" /> Donation
          </h2>
        </header>
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-1 shadow-2xl">
          <div className="bg-white rounded-[22px] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: Info */}
              <article className="p-6 sm:p-10 md:p-14">
                <header>
                  <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-2">
                    <Heart size={14} fill="currentColor" aria-hidden="true" /> Support The Temple
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                    <span className="text-orange-600">Seva Donation</span>
                  </h2>
                </header>
                <p className="text-gray-500 text-lg mb-1 sm:mb-8 leading-relaxed">
                  Your generous contribution helps maintain the temple, light the daily diyas, and support village events. Every rupee counts as seva.
                </p>

                <ul className="space-y-3 mb-1 sm:mb-8" aria-label="Donation Benefits">
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
              <aside className="bg-orange-50 flex flex-col items-center justify-center p-2 sm:p-10 md:p-14" aria-label="QR Code for Donation">
                <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-xl border border-orange-100 flex flex-col items-center w-full max-w-sm">
                  <div className="w-40 sm:w-52 h-40 sm:h-52 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-orange-200 overflow-hidden relative mb-3">
                    {qrUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrUrl}
                        alt="Donate via UPI QR Code — Hanuman Mandir Darekarwadi"
                        className="w-full h-full object-contain z-10 relative"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center z-0">
                        <QrCode size={56} className="text-orange-200" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <p className="font-bold text-gray-800 text-lg sm:text-xl text-center">{displayName}</p>

                  {upiId ? (
                    <div className="w-full mt-2 flex flex-col items-center">
                      <p className="text-[10px] sm:text-xs text-gray-400 mb-3 font-mono bg-gray-50 px-2 py-1 sm:px-3 sm:py-1 rounded-md border border-gray-100">{upiId}</p>

                      <div className="w-full mb-3">
                        <label htmlFor="donation-amount" className="sr-only">Donation Amount</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 font-bold">₹</span>
                          </div>
                          <input
                            type="number"
                            id="donation-amount"
                            min="1"
                            placeholder="Enter amount (Optional)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="block w-full pl-8 pr-3 py-3 border border-orange-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all"
                          />
                        </div>
                      </div>

                      {/* Mobile Payment Buttons - Explicit Apps */}
                      <div className="grid grid-cols-2 gap-2 w-full mb-3 md:hidden">
                        <a
                          href={`paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(displayName)}&tn=${encodeURIComponent(displayNote)}&cu=INR${amount ? `&am=${amount}` : ""}`}
                          className="bg-[#002970] text-white font-bold py-2.5 px-2 rounded-xl text-center text-xs shadow-sm active:scale-95 transition-transform"
                        >
                          Paytm
                        </a>
                        <a
                          href={`phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(displayName)}&tn=${encodeURIComponent(displayNote)}&cu=INR${amount ? `&am=${amount}` : ""}`}
                          className="bg-[#5f259f] text-white font-bold py-2.5 px-2 rounded-xl text-center text-xs shadow-sm active:scale-95 transition-transform"
                        >
                          PhonePe
                        </a>
                        <a
                          href={`gpay://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(displayName)}&tn=${encodeURIComponent(displayNote)}&cu=INR${amount ? `&am=${amount}` : ""}`}
                          className="bg-white text-gray-800 border border-gray-200 font-bold py-2.5 px-2 rounded-xl text-center text-xs shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1"
                        >
                          <span className="text-blue-500">G</span><span className="text-red-500">P</span><span className="text-yellow-500">a</span><span className="text-green-500">y</span>
                        </a>
                        <a
                          href={`bhim://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(displayName)}&tn=${encodeURIComponent(displayNote)}&cu=INR${amount ? `&am=${amount}` : ""}`}
                          className="bg-[#FF7A00] text-white font-bold py-2.5 px-2 rounded-xl text-center text-xs shadow-sm active:scale-95 transition-transform"
                        >
                          BHIM
                        </a>
                      </div>

                      {/* Generic / Default Button */}
                      <a
                        href={upiId ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(displayName)}&tn=${encodeURIComponent(displayNote)}&cu=INR${amount ? `&am=${amount}` : ""}` : "#"}
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
                        <span className="md:hidden">Other UPI Apps</span>
                        <span className="hidden md:inline">Pay Now with UPI</span>
                      </a>
                    </div>
                  ) : (
                    <div className="w-full mt-4 text-center">
                      <p className="text-sm text-gray-400 italic">Payment not configured yet.</p>
                      <p className="text-xs text-gray-400 mt-1">Admin: Add a UPI ID in the Payment Settings.</p>
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
