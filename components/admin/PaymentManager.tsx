"use client";

import { useState, useTransition } from "react";
import {
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setPaymentMethodActive,
  uploadPaymentQr,
} from "@/app/admin/actions";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Upload,
  X,
  Plus,
  Save,
  QrCode,
  Loader2,
} from "lucide-react";

type PaymentMethod = {
  id: number;
  upiId: string;
  payeeName: string | null;
  paymentNote: string | null;
  qrImageUrl: string | null;
  isActive: boolean;
};

const inputCls =
  "w-full p-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm";

// ─── Inline editable row ────────────────────────────────────────────────────
function PaymentRow({
  method,
  onSetActive,
  onDelete,
}: {
  method: PaymentMethod;
  onSetActive: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const [isPending, startTransition] = useTransition();

  // Editable fields (local state so user sees changes before save)
  const [upiId, setUpiId] = useState(method.upiId);
  const [payeeName, setPayeeName] = useState(method.payeeName ?? "");
  const [paymentNote, setPaymentNote] = useState(method.paymentNote ?? "");

  // QR upload states
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(method.qrImageUrl);
  const [qrSuccess, setQrSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveDetails = () => {
    setError(null);
    if (!upiId.trim()) {
      setError("UPI ID cannot be empty.");
      return;
    }
    const fd = new FormData();
    fd.append("upiId", upiId.trim());
    fd.append("payeeName", payeeName.trim());
    fd.append("paymentNote", paymentNote.trim());
    startTransition(async () => {
      await updatePaymentMethod(method.id, fd);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    });
  };

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrFile(file);
    const reader = new FileReader();
    reader.onload = () => setQrPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadQr = () => {
    if (!qrFile) return;
    const fd = new FormData();
    fd.append("image", qrFile);
    startTransition(async () => {
      await uploadPaymentQr(method.id, fd);
      setQrFile(null);
      setQrSuccess(true);
      setTimeout(() => setQrSuccess(false), 2500);
    });
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all ${
        method.isActive
          ? "border-orange-500 ring-2 ring-orange-200 shadow-lg"
          : "border-gray-100 shadow-sm"
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <button
            disabled={isPending || method.isActive}
            onClick={() => onSetActive(method.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              method.isActive
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-700"
            }`}
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : method.isActive ? (
              <CheckCircle2 size={14} />
            ) : (
              <Circle size={14} />
            )}
            {method.isActive ? "ACTIVE" : "Set Active"}
          </button>

          {method.isActive && (
            <span className="text-xs text-orange-600 font-semibold">
              ← Currently used on public site
            </span>
          )}
        </div>

        <button
          disabled={isPending}
          onClick={() => onDelete(method.id)}
          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Body: two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Left: editable fields */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
              UPI ID *
            </label>
            <input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g., 9876543210@ybl"
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
              Payee Name
            </label>
            <input
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              placeholder="e.g., Hanuman Mandir"
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
              Payment Note
            </label>
            <input
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="e.g., Temple Donation"
              className={inputCls}
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            disabled={isPending}
            onClick={handleSaveDetails}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saveSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>

        {/* Right: QR code */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden group">
            {qrPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrPreview}
                alt="QR Code preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-300 gap-2">
                <QrCode size={40} />
                <span className="text-xs">No QR Code</span>
              </div>
            )}
            {/* Overlay hint */}
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-1">
              <Upload size={20} />
              <span className="text-xs font-bold">Choose QR Image</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleQrChange}
              />
            </label>
          </div>

          {qrFile ? (
            <div className="flex flex-col items-center gap-2 w-full">
              <p className="text-xs text-gray-500 truncate max-w-[10rem]">{qrFile.name}</p>
              <button
                disabled={isPending}
                onClick={handleUploadQr}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                {qrSuccess ? "Uploaded!" : "Upload QR Code"}
              </button>
              <button
                onClick={() => {
                  setQrFile(null);
                  setQrPreview(method.qrImageUrl);
                }}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          ) : (
            <label className="w-full cursor-pointer">
              <div className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-600 hover:text-orange-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                <Upload size={14} />
                {qrPreview ? "Replace QR Code" : "Upload QR Code"}
              </div>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleQrChange}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add new payment method form ────────────────────────────────────────────
function AddPaymentForm({ onCancel }: { onCancel: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const upiId = fd.get("upiId") as string;
    if (!upiId?.trim()) {
      setError("UPI ID cannot be empty.");
      return;
    }
    startTransition(async () => {
      await addPaymentMethod(fd);
      onCancel();
    });
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 relative">
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>
      <h3 className="text-lg font-bold text-orange-900 mb-4">Add New UPI ID</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
            UPI ID *
          </label>
          <input
            name="upiId"
            required
            placeholder="e.g., temple@sbi"
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
            Payee Name
          </label>
          <input
            name="payeeName"
            placeholder="Hanuman Mandir"
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
            Payment Note
          </label>
          <input
            name="paymentNote"
            placeholder="Temple Donation"
            className={inputCls}
          />
        </div>
        {error && <p className="md:col-span-3 text-red-500 text-xs">{error}</p>}
        <div className="md:col-span-3 flex gap-3 mt-1">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {isPending ? "Saving..." : "Add Payment Method"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Delete confirmation dialog ──────────────────────────────────────────────
function DeleteDialog({
  id,
  upiId,
  onCancel,
}: {
  id: number;
  upiId: string;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deletePaymentMethod(id);
      onCancel();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete UPI ID?</h3>
        <p className="text-gray-500 text-sm text-center mb-1 font-mono">{upiId}</p>
        <p className="text-gray-400 text-xs text-center mb-6">
          This will permanently delete the UPI ID and its QR code from storage. This cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-100 border border-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main container ──────────────────────────────────────────────────────────
export default function PaymentManager({ methods }: { methods: PaymentMethod[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [deletingMethod, setDeletingMethod] = useState<PaymentMethod | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSetActive = (id: number) => {
    startTransition(async () => {
      await setPaymentMethodActive(id);
    });
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900">UPI Payment Methods</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {methods.length === 0
              ? "No UPI IDs added yet — click Add New to get started."
              : `${methods.length} method${methods.length > 1 ? "s" : ""} configured. Mark one as Active to use it on the public site.`}
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Add form */}
      {isAdding && <AddPaymentForm onCancel={() => setIsAdding(false)} />}

      {/* Empty state */}
      {!isAdding && methods.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <QrCode size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 font-semibold">No payment methods yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Click <strong>Add New</strong> to create your first UPI payment method.
          </p>
        </div>
      )}

      {/* Rows */}
      {methods.map((method) => (
        <PaymentRow
          key={method.id}
          method={method}
          onSetActive={handleSetActive}
          onDelete={(id) => setDeletingMethod(methods.find((m) => m.id === id) ?? null)}
        />
      ))}

      {/* Delete dialog */}
      {deletingMethod && (
        <DeleteDialog
          id={deletingMethod.id}
          upiId={deletingMethod.upiId}
          onCancel={() => setDeletingMethod(null)}
        />
      )}
    </div>
  );
}
