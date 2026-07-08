"use client";
import { useRef, useState, useTransition } from "react";
import { changeAdminCredentials } from "../actions";
import { KeyRound } from "lucide-react";

const inputCls = "w-full p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm mb-3";
const btnCls = "bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm";

export default function ChangeCredentialsForm({ currentUsername }: { currentUsername: string }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await changeAdminCredentials(formData);
      if (result?.error) {
        setMsg({ type: "error", text: result.error });
      } else if (result?.success) {
        setMsg({ type: "success", text: result.success });
        // Don't reset completely, just clear passwords
        if (formRef.current) {
          const form = formRef.current;
          (form.elements.namedItem("newPassword") as HTMLInputElement).value = "";
          (form.elements.namedItem("confirmPassword") as HTMLInputElement).value = "";
          (form.elements.namedItem("currentPassword") as HTMLInputElement).value = "";
        }
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <div className="md:col-span-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Current Password <span className="text-red-500">*</span></label>
        <p className="text-xs text-gray-400 mb-2">Required to authorize any changes.</p>
        <input
          name="currentPassword"
          type="password"
          required
          placeholder="Enter current password"
          className={inputCls}
        />
      </div>

      <div className="md:col-span-2 pt-4 border-t border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-4">Update Credentials</h3>
      </div>

      <div className="md:col-span-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Username <span className="text-red-500">*</span></label>
        <input
          name="newUsername"
          type="text"
          required
          defaultValue={currentUsername}
          placeholder="Enter username"
          className={inputCls}
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">New Password</label>
        <input
          name="newPassword"
          type="password"
          minLength={4}
          placeholder="Leave blank to keep current"
          className={inputCls}
        />
      </div>
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">Confirm New Password</label>
        <input
          name="confirmPassword"
          type="password"
          minLength={4}
          placeholder="Repeat new password"
          className={inputCls}
        />
      </div>

      {msg && (
        <div className={`md:col-span-2 p-3 rounded-xl text-sm font-medium ${
          msg.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-600 border border-red-200"
        }`}>
          {msg.text}
        </div>
      )}

      <div className="md:col-span-2 mt-2">
        <button type="submit" disabled={isPending} className={`${btnCls} flex items-center gap-2 disabled:opacity-50`}>
          <KeyRound size={16} />
          {isPending ? "Updating..." : "Update Credentials"}
        </button>
      </div>
    </form>
  );
}
