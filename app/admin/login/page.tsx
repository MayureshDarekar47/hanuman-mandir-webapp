"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMasterPrompt, setShowMasterPrompt] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [changeMsg, setChangeMsg] = useState<{type: "error" | "success", text: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("Invalid username or password");
      setLoading(false);
    } else {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      if ((session?.user as any)?.isMaster) {
        setShowMasterPrompt(true);
        setLoading(false);
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    setChangeMsg(null);
    try {
      const { changePasswordWithMaster } = await import("../actions");
      const result = await changePasswordWithMaster(newPassword);
      if (result.error) {
        setChangeMsg({ type: "error", text: result.error });
      } else if (result.success) {
        setChangeMsg({ type: "success", text: result.success });
        setTimeout(() => {
          router.push("/admin/dashboard");
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setChangeMsg({ type: "error", text: "Something went wrong" });
    }
    setChangingPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0503]">
      {/* Background with blur */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
        <Image 
          src="/assets/temple_04.jpg" 
          alt="Temple Background" 
          fill 
          className="object-cover object-center blur-sm" 
          priority
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0503] via-[#0a0503]/80 to-transparent"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-orange-900/20 to-amber-900/20 mix-blend-overlay"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10 px-4"
      >
        <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/10 p-8 sm:p-10 relative overflow-hidden">
          
          {/* Decorative shine */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col items-center mb-8 relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
            >
              <Lock className="text-white" size={36} />
            </motion.div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal</h2>
            <p className="text-orange-200/80 mt-2 text-center text-sm font-medium">Secure access to temple management</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-md"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-orange-50">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-white/20 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-500"
                placeholder="Enter admin username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-orange-50">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-white/20 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-12 placeholder:text-gray-500"
                  placeholder="Enter secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.6)] disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>
          
          <p className="text-xs text-white/40 text-center mt-8 relative z-10 font-medium tracking-wide uppercase">
            Shree Hanuman Mandir Trust
          </p>
        </div>
      </motion.div>

      {/* Master Password Prompt Modal */}
      {showMasterPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden"
          >
            <h3 className="text-xl font-bold text-white mb-2">Master Login Detected</h3>
            <p className="text-sm text-gray-300 mb-6">
              You logged in using the master password. Would you like to change the regular admin password now?
            </p>
            
            {changeMsg && (
              <div className={`p-3 rounded-xl text-sm font-medium mb-4 ${
                changeMsg.type === "success"
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}>
                {changeMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-400 uppercase">New Regular Password</label>
                <input
                  type="password"
                  required
                  minLength={4}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-600"
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="flex flex-col gap-3 mt-6">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {changingPassword ? "Updating..." : "Yes, Change Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    router.push("/admin/dashboard");
                    router.refresh();
                  }}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                >
                  No, Go to Dashboard
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
