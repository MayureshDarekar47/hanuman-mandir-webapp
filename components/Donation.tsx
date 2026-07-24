"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { QrCode, Heart, Shield, FileText, CheckCircle, Camera, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import Link from "next/link";


export default function Donation({
  qrUrl,
  upiId,
  upiName,
  upiNote,
  whatsappNumber = "919999999999",
  whatsappMessage,
  paymentSuccessTitle,
  paymentSuccessSubtitle,
  receiptWarningText,
  isWhatsappEnabled = true,
}: {
  qrUrl?: string | null;
  upiId?: string | null;
  upiName?: string | null;
  upiNote?: string | null;
  whatsappNumber?: string | null;
  whatsappMessage?: string | null;
  paymentSuccessTitle?: string | null;
  paymentSuccessSubtitle?: string | null;
  receiptWarningText?: string | null;
  isWhatsappEnabled?: boolean;
}) {
  const [showModal, setShowModal] = useState(false);
  const [hasClickedPay, setHasClickedPay] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isWaitingForReturn, setIsWaitingForReturn] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const displayName = upiName || "Hanuman Mandir";
  const displayNote = upiNote || "Temple Donation";
  const waNumber = whatsappNumber ?? "919999999999";
  const baseWaMessage = whatsappMessage ??
    "🙏 Jai Hanuman!\n\nI have completed my donation.\n\nThank you.";
  
  const donationDetails = `
--- Donation Details ---
Donor Name: ${donorName || "Anonymous"}
Amount: ${amount ? `₹${amount}` : "As entered in UPI app"}
Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
UPI ID: ${upiId || "—"}
`;

  const finalWaMessage = `${baseWaMessage}\n${donationDetails}`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(finalWaMessage)}`;

  const buildUpiLink = (scheme: string) => {
    const base = `${scheme}pa=${encodeURIComponent(upiId!)}&pn=${encodeURIComponent(displayName)}&tn=${encodeURIComponent(displayNote)}&cu=INR`;
    return amount ? `${base}&am=${amount}` : base;
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isWaitingForReturn) {
        setIsWaitingForReturn(false);
        setHasClickedPay(true);
        setTimeout(() => {
          successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 400);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isWaitingForReturn]);

  const handlePayClick = () => {
    if (!isWhatsappEnabled) return;

    const isMobile = typeof window !== 'undefined' && (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) ||
      window.screen.width <= 768
    );

    if (isMobile) {
      setIsWaitingForReturn(true);
      // Fallback: If visibilitychange doesn't fire (e.g. UPI app not installed), show it after 8 seconds
      setTimeout(() => {
        setIsWaitingForReturn((prev) => {
          if (prev) {
            setHasClickedPay(true);
            setTimeout(() => {
              successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 400);
            return false;
          }
          return prev;
        });
      }, 15000);
    } else {
      setHasClickedPay(true);
      // Scroll to the waiting confirmation banner
      setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
    }
  };

  const handlePaymentConfirm = () => {
    setPaymentDone(true);
  };

  // Auto-capture screenshot when success section appears
  const captureScreenshot = useCallback(async () => {
    if (!receiptRef.current || screenshotUrl || isCapturing) return;
    setIsCapturing(true);
    try {
      // Wait for animations to complete
      await new Promise((r) => setTimeout(r, 800));
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 420,
      });
      setScreenshotUrl(canvas.toDataURL("image/png"));
    } catch (err) {
      console.error("Screenshot capture failed:", err);
    } finally {
      setIsCapturing(false);
    }
  }, [screenshotUrl, isCapturing]);

  useEffect(() => {
    if (paymentDone) {
      captureScreenshot();
    }
  }, [paymentDone, captureScreenshot]);

  // Share screenshot by opening WhatsApp directly to the admin's chat with the donation details text
  const handleShare = async () => {
    if (!screenshotUrl) return;
    try {
      // Open WhatsApp directly with the admin's number and pre-filled message containing details
      window.open(waLink, "_blank");
    } catch (err) {
      window.open(waLink, "_blank");
    }
  };

  // Download screenshot
  const handleDownload = () => {
    if (!screenshotUrl) return;
    const link = document.createElement("a");
    link.href = screenshotUrl;
    link.download = `donation-receipt-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const upiDeepLink = upiId ? buildUpiLink("upi://pay?") : null;

  return (
    <>
      <section
        className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full max-w-[100vw] overflow-x-hidden sm:overflow-visible"
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

                {isWhatsappEnabled && (
                  <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl p-4 mb-4 sm:mb-8 flex gap-3 items-start">
                    <span className="text-lg mt-0.5" aria-hidden="true">📸</span>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      <strong className="text-[#25D366]">Verification Step:</strong> After payment, take a screenshot and click the WhatsApp button to verify your donation.
                    </p>
                  </div>
                )}

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

                      {/* Name input */}
                      <div className="w-full mb-3">
                        <label htmlFor="donor-name" className="sr-only">Your Name</label>
                        <input
                          type="text"
                          id="donor-name"
                          placeholder="Your Name (Required)"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          className="block w-full px-4 py-3 border border-orange-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all font-medium"
                        />
                      </div>

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
            ⏳  STEP 1 — Waiting for payment confirmation
            Shows after Pay button clicked, before user confirms payment done
        ══════════════════════════════════════════════════════ */}
        {hasClickedPay && !paymentDone && (
          <div
            ref={successRef}
            className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="relative overflow-hidden rounded-2xl border-2 border-orange-200 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 p-5 sm:p-7 flex flex-col items-center text-center gap-5">
              {/* Icon */}
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center animate-pulse">
                <span className="text-3xl">📱</span>
              </div>

              {/* Text */}
              <div>
                <p className="text-xl font-black text-orange-700">
                  {paymentSuccessTitle ?? "Was your payment successful?"}
                </p>
                {isWhatsappEnabled && (
                  <p className="text-xs text-orange-500 mt-2 font-semibold tracking-wide whitespace-pre-line">
                    {paymentSuccessSubtitle ?? "🔒 Your donation receipt will be auto-generated & sent to the admin for verification."}
                  </p>
                )}
              </div>

              {/* Yes / No buttons */}
              <div className="grid grid-cols-2 gap-3 w-full">
                {/* YES */}
                <button
                  onClick={handlePaymentConfirm}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:scale-95 text-white font-black text-lg py-4 px-4 rounded-xl shadow-lg transition-all duration-300"
                >
                  <CheckCircle size={22} />
                  Yes ✅
                </button>

                {/* NO */}
                <button
                  onClick={() => { setHasClickedPay(false); }}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 active:scale-95 text-red-500 border-2 border-red-300 font-black text-lg py-4 px-4 rounded-xl shadow-sm transition-all duration-300"
                >
                  <span className="text-xl">✗</span>
                  No ❌
                </button>
              </div>


            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            ✅  STEP 2 — Receipt + Screenshot (after payment confirmed)
        ══════════════════════════════════════════════════════ */}
        {paymentDone && (
          <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── Hidden Receipt card — this gets captured as screenshot ── */}
            <div className="absolute top-0 left-0 -z-10 opacity-0 pointer-events-none" aria-hidden="true">
              <div
                ref={receiptRef}
                className="relative overflow-hidden rounded-2xl border-2 border-green-200 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 w-[420px]"
              >
                <div className="relative z-10 p-5 sm:p-7 flex flex-col items-center text-center gap-3">
                  {/* Temple header */}
                  <div className="w-full border-b border-green-200 pb-3">
                    <p className="text-xs font-semibold text-green-500 tracking-widest uppercase">Donation Receipt</p>
                    <p className="text-xl sm:text-2xl font-black text-green-800 mt-1">🙏 {displayName}</p>
                  </div>

                  {/* Thank you row */}
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md flex-shrink-0">
                      <CheckCircle size={26} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-black text-green-700 leading-tight">Thank you!</p>
                      {donorName && (
                        <p className="text-base font-bold text-green-800">🙏 {donorName}</p>
                      )}
                    </div>
                  </div>

                  {/* Details table */}
                  <div className="w-full bg-white/70 rounded-xl p-3 mt-1 border border-green-100">
                    {donorName && (
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-500 font-medium">Donor Name:</span>
                        <span className="text-green-700 font-bold">{donorName}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Amount:</span>
                      <span className="text-green-700 font-bold">{amount ? `₹${amount}` : "As entered in UPI app"}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1.5">
                      <span className="text-gray-500 font-medium">Date:</span>
                      <span className="text-green-700 font-bold">{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1.5">
                      <span className="text-gray-500 font-medium">UPI ID:</span>
                      <span className="text-green-700 font-bold font-mono text-xs">{upiId || "—"}</span>
                    </div>
                  </div>

                  {isWhatsappEnabled && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 w-full mt-2 shadow-inner flex flex-col justify-center">
                      <p className="text-base font-extrabold text-red-600 text-left leading-relaxed">
                        {receiptWarningText ?? "⚠️ Attach your payment screenshot. Without it, your payment will not be counted."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Visible Receipt UI — shows only Thank You and Warning ── */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-green-200 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="relative z-10 p-5 sm:p-7 flex flex-col items-center text-center gap-5">

                {/* Thank you row */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                    <CheckCircle size={36} className="text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-3xl font-black text-green-700 leading-tight">Thank you!</p>
                </div>

                {/* Warning Message */}
                {isWhatsappEnabled && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-5 sm:p-6 w-full shadow-inner flex flex-col justify-center">
                    <p className="text-base md:text-lg font-extrabold text-red-600 text-left leading-relaxed">
                      {receiptWarningText ?? "⚠️ Please click below to send your payment confirmation via WhatsApp. Without it, your payment will not be counted."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Actions below receipt (not captured in screenshot) ── */}
            <div className="mt-4 flex flex-col items-center gap-3">

              {/* Capture status */}
              {isCapturing && (
                <div className="flex items-center gap-2 text-sm text-orange-600 font-medium animate-pulse">
                  <Loader2 size={16} className="animate-spin" />
                  📸 Watting...
                </div>
              )}


              {/* Buttons: WhatsApp (big) + Download (small) */}
              <div className="flex gap-3 w-full items-center">
                {/* WhatsApp Share — big */}
                {isWhatsappEnabled && (
                  <button
                    onClick={handleShare}
                    disabled={!screenshotUrl}
                    id="whatsapp-donation-btn"
                    className={`group flex-1 flex items-center justify-center gap-2 text-white font-black text-base py-4 px-4 rounded-xl transition-all duration-300 ${screenshotUrl
                        ? "bg-[#25D366] hover:bg-[#20c45c] active:scale-95 shadow-[0_4px_14px_rgba(37,211,102,0.35)]"
                        : "bg-gray-300 cursor-not-allowed"
                      }`}
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0 fill-white" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {screenshotUrl ? "Send via WhatsApp" : "Wait..."}
                  </button>
                )}

                {/* Download — small icon button */}
                <button
                  onClick={handleDownload}
                  disabled={!screenshotUrl}
                  title="Download Screenshot"
                  className={`flex items-center justify-center gap-1 font-semibold text-xs py-4 px-4 rounded-xl border-2 transition-all active:scale-95 flex-shrink-0 ${screenshotUrl
                      ? "bg-white hover:bg-gray-50 text-gray-600 border-gray-200 shadow-sm"
                      : "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                    }`}
                >
                  <Download size={18} />
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
