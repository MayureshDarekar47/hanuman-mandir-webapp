"use client";
import { useState, useRef } from "react";
import { QrCode, Heart, Shield, FileText, CheckCircle, ChevronDown } from "lucide-react";
import Link from "next/link";

const STEPS = [
  { num: 1, text: "Complete your UPI payment using the Pay Now button above." },
  { num: 2, text: "Take a screenshot of the successful payment confirmation." },
  { num: 3, text: "Click the WhatsApp button below." },
  { num: 4, text: "WhatsApp will open with the temple's number and a pre-filled message." },
  { num: 5, text: "Attach your screenshot and press Send." },
];

export default function Donation({
  qrUrl,
  upiId,
  upiName,
  upiNote,
  whatsappNumber = "919999999999",
  whatsappMessage,
}: {
  qrUrl?: string | null;
  upiId?: string | null;
  upiName?: string | null;
  upiNote?: string | null;
  whatsappNumber?: string | null;
  whatsappMessage?: string | null;
}) {
  const [showModal, setShowModal] = useState(false);
  const [hasClickedPay, setHasClickedPay] = useState(false);
  const [amount, setAmount] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  const displayName = upiName || "Hanuman Mandir";
  const displayNote = upiNote || "Temple Donation";
  const waNumber = whatsappNumber || "919999999999";
  const waMessage = whatsappMessage ||
    "🙏 Jai Hanuman!\n\nI have completed my donation.\nPlease find my payment screenshot attached.\n\nThank you.";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const buildUpiLink = (scheme: string) => {
    const base = `${scheme}pa=${encodeURIComponent(upiId!)}&pn=${encodeURIComponent(displayName)}&tn=${encodeURIComponent(displayNote)}&cu=INR`;
    return amount ? `${base}&am=${amount}` : base;
  };

  const handlePayClick = () => {
    setHasClickedPay(true);
    // Smooth scroll to success section after a brief delay
    setTimeout(() => {
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  };

  const upiDeepLink = upiId ? buildUpiLink("upi://pay?") : null;

  return (
    <>
      <section
        className="py-2 sm:py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full max-w-[100vw] overflow-x-hidden sm:overflow-visible"
        id="donation"
        aria-label="Donation and Seva"
      >
        {/* ── Section Header ── */}
        <header className="text-center mb-4 sm:mb-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Heart className="text-orange-500 flex-shrink-0" size={32} aria-hidden="true" /> Donation
          </h2>
        </header>

        {/* ── Main Card ── */}
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
                  Your generous contribution helps maintain the temple, light the daily diyas, and support village
                  events. Every rupee counts as seva.
                </p>

                <ul className="space-y-3 mb-1 sm:mb-8" aria-label="Donation Benefits">
                  {[
                    { icon: Shield, text: "Secure UPI Transfer" },
                    { icon: FileText, text: "Transparent records published publicly" },
                    { icon: Heart, text: "100% goes to temple maintenance & events" },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-gray-700 font-medium">
                      <span
                        className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
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

              {/* Right: QR + Buttons */}
              <aside
                className="bg-orange-50 flex flex-col items-center justify-center p-2 sm:p-10 md:p-14"
                aria-label="QR Code for Donation"
              >
                <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-xl border border-orange-100 flex flex-col items-center w-full max-w-sm">
                  {/* QR Code */}
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
                      <p className="text-[10px] sm:text-xs text-gray-400 mb-3 font-mono bg-gray-50 px-2 py-1 sm:px-3 sm:py-1 rounded-md border border-gray-100">
                        {upiId}
                      </p>

                      {/* Amount input */}
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

                      {/* Mobile: Explicit app buttons */}
                      <div className="grid grid-cols-2 gap-2 w-full mb-3 md:hidden">
                        <a
                          href={buildUpiLink("paytmmp://pay?")}
                          onClick={handlePayClick}
                          className="bg-[#002970] text-white font-bold py-2.5 px-2 rounded-xl text-center text-xs shadow-sm active:scale-95 transition-transform"
                        >
                          Paytm
                        </a>
                        <a
                          href={buildUpiLink("phonepe://pay?")}
                          onClick={handlePayClick}
                          className="bg-[#5f259f] text-white font-bold py-2.5 px-2 rounded-xl text-center text-xs shadow-sm active:scale-95 transition-transform"
                        >
                          PhonePe
                        </a>
                        <a
                          href={buildUpiLink("gpay://upi/pay?")}
                          onClick={handlePayClick}
                          className="bg-white text-gray-800 border border-gray-200 font-bold py-2.5 px-2 rounded-xl text-center text-xs shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1"
                        >
                          <span className="text-blue-500">G</span>
                          <span className="text-red-500">P</span>
                          <span className="text-yellow-500">a</span>
                          <span className="text-green-500">y</span>
                        </a>
                        <a
                          href={buildUpiLink("bhim://pay?")}
                          onClick={handlePayClick}
                          className="bg-[#FF7A00] text-white font-bold py-2.5 px-2 rounded-xl text-center text-xs shadow-sm active:scale-95 transition-transform"
                        >
                          BHIM
                        </a>
                      </div>

                      {/* Main Pay Now button */}
                      <a
                        href={upiDeepLink || "#"}
                        onClick={(e) => {
                          const isMobile =
                            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                              navigator.userAgent
                            ) ||
                            (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) ||
                            window.screen.width <= 768;

                          if (!isMobile) {
                            e.preventDefault();
                            setShowModal(true);
                          }
                          handlePayClick();
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

        {/* ══════════════════════════════════════════════════════
            ✅  POST-PAYMENT SUCCESS SECTION
            Shown when user clicks any Pay Now / UPI button
        ══════════════════════════════════════════════════════ */}
        {hasClickedPay && (
          <div
            ref={successRef}
            className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {/* Scroll hint arrow */}
            <div className="flex justify-center mb-2">
              <div className="flex flex-col items-center gap-1 text-orange-400 animate-bounce">
                <ChevronDown size={20} />
                <span className="text-xs font-semibold">Next Step</span>
              </div>
            </div>

            {/* Main success card */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-green-200 shadow-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
              {/* Decorative background circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-green-100 opacity-50 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-emerald-100 opacity-50 blur-2xl pointer-events-none" />

              <div className="relative z-10 p-6 sm:p-10 flex flex-col items-center text-center gap-6">

                {/* Thank you header */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg animate-in zoom-in duration-500">
                    <CheckCircle size={40} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-4xl sm:text-5xl font-black text-green-700 leading-tight">🙏 Thank you!</p>
                    <p className="text-lg sm:text-xl font-semibold text-green-600 mt-1">
                      Thank you for your donation.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />

                {/* Step-by-step instructions */}
                <div className="w-full max-w-lg">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                    Complete Your Donation Verification
                  </p>
                  <div className="grid grid-cols-1 gap-3 text-left">
                    {STEPS.map((step) => (
                      <div
                        key={step.num}
                        className="flex items-start gap-3 bg-white/70 backdrop-blur-sm border border-green-100 rounded-2xl px-4 py-3 shadow-sm"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white text-sm font-black flex items-center justify-center shadow">
                          {step.num}
                        </span>
                        <p className="text-gray-700 font-medium text-sm leading-relaxed pt-1">{step.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Button */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="whatsapp-donation-btn"
                  className="group w-full max-w-lg flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20c45c] active:scale-95 text-white font-black text-lg sm:text-xl py-5 px-8 rounded-2xl shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_40px_rgba(37,211,102,0.6)] transition-all duration-300"
                >
                  {/* WhatsApp SVG icon */}
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 flex-shrink-0 fill-white"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Share Payment Screenshot on WhatsApp
                  <svg
                    className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>

                {/* Verification note */}
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 max-w-lg w-full text-left">
                  <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">ℹ️</span>
                  <p className="text-amber-800 text-sm font-medium leading-relaxed">
                    <strong>Note:</strong> Your donation will be verified after receiving your payment screenshot.
                    Thank you for your patience and generous seva! 🙏
                  </p>
                </div>

                {/* Reset link */}
                <button
                  onClick={() => {
                    setHasClickedPay(false);
                    setAmount("");
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors mt-2"
                >
                  ← Make another donation
                </button>
              </div>
            </div>
          </div>
        )}
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
