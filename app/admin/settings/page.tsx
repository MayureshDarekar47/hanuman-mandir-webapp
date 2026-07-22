export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { updateSiteSettings, updateThemeSettings, updateAnimationSettings, updateSeoSettings, updateWhatsappSettings } from "../actions";
import ChangeCredentialsForm from "./ChangeCredentialsForm";

const inputCls = "w-full p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm mb-3";
const btnCls = "bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm";
const sectionCls = "bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const [site, theme, anim, seo, admin] = await Promise.all([
    prisma.siteSettings.findFirst().catch(() => null),
    prisma.themeSettings.findFirst().catch(() => null),
    prisma.animationSettings.findFirst().catch(() => null),
    prisma.seoSettings.findFirst().catch(() => null),
    prisma.adminUser.findFirst().catch(() => null),
  ]);

  return (
    <div className="space-y-10 p-6 sm:p-10 pt-32 sm:pt-40 pb-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Global Settings</h1>
        </div>
        <Link href="/admin/dashboard" prefetch={true} className="bg-white hover:bg-gray-100 text-gray-800 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 border border-gray-200 flex-shrink-0">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* ── WhatsApp Contact Settings ── */}
      <section className={sectionCls}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#25D366]" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">WhatsApp Donation Settings</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">Yahan se aap donation ke baad users ko bhejna wala WhatsApp number aur message change kar sakte hain.</p>
        <form action={updateWhatsappSettings} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Temple WhatsApp Number</label>
            <p className="text-[11px] text-gray-400 mb-2">Country code ke sath likhen, bina + ya spaces ke. Example: 919876543210 for +91 98765 43210</p>
            <input
              name="whatsappNumber"
              defaultValue={site?.whatsappNumber || "919999999999"}
              required
              placeholder="e.g. 919876543210"
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Pre-filled WhatsApp Message</label>
            <p className="text-[11px] text-gray-400 mb-2">Yeh message automatically WhatsApp mein type hoga jab user button click karega.</p>
            <textarea
              name="whatsappMessage"
              defaultValue={site?.whatsappMessage || "🙏 Jai Hanuman!\n\nI have completed my donation.\nPlease find my payment screenshot attached.\n\nThank you."}
              rows={5}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm font-mono"
            />
          </div>
          <button type="submit" className={btnCls}>Save WhatsApp Settings</button>
        </form>
      </section>

      {/* Hero & Site Texts */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Hero Section Texts</h2>
        <form action={updateSiteSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="hidden" name="id" value={site?.id || 0} />
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Hero Title</label>
            <input name="heroTitle" defaultValue={site?.heroTitle || "Hanuman Mandir"} required className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Hero Subtitle</label>
            <input name="heroSubtitle" defaultValue={site?.heroSubtitle || "हनुमान मंदिर"} required className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Sanskrit Quote</label>
            <input name="heroQuote" defaultValue={site?.heroQuote || "ॐ जय बजरंग बली ॐ"} required className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
            <input name="heroLocation" defaultValue={site?.heroLocation || "दरेकरवाडी, ढवळपुरी, पारनेर, अहिल्यानगर"} required className={inputCls} />
          </div>
          <button type="submit" className={`${btnCls} md:col-span-2`}>Save Site Settings</button>
        </form>
      </section>



      {/* Theme Settings */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Theme Colors</h2>
        <form action={updateThemeSettings} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="hidden" name="id" value={theme?.id || 0} />
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Primary Color</label>
            <div className="flex gap-2 items-center mb-3">
              <input type="color" name="primaryColor" defaultValue={theme?.primaryColor || "#ea580c"} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" defaultValue={theme?.primaryColor || "#ea580c"} className="flex-1 p-2 rounded-lg border border-gray-200 text-sm" disabled />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Secondary Color</label>
            <div className="flex gap-2 items-center mb-3">
              <input type="color" name="secondaryColor" defaultValue={theme?.secondaryColor || "#d97706"} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" defaultValue={theme?.secondaryColor || "#d97706"} className="flex-1 p-2 rounded-lg border border-gray-200 text-sm" disabled />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Background Color</label>
            <div className="flex gap-2 items-center mb-3">
              <input type="color" name="backgroundColor" defaultValue={theme?.backgroundColor || "#0f0805"} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" defaultValue={theme?.backgroundColor || "#0f0805"} className="flex-1 p-2 rounded-lg border border-gray-200 text-sm" disabled />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Text Color</label>
            <div className="flex gap-2 items-center mb-3">
              <input type="color" name="textColor" defaultValue={theme?.textColor || "#ffffff"} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" defaultValue={theme?.textColor || "#ffffff"} className="flex-1 p-2 rounded-lg border border-gray-200 text-sm" disabled />
            </div>
          </div>
          <button type="submit" className={`${btnCls} md:col-span-2 lg:col-span-4`}>Save Theme Settings</button>
        </form>
      </section>

      {/* Animation Settings */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Animation Controls</h2>
        <form action={updateAnimationSettings} className="space-y-4">
          <input type="hidden" name="id" value={anim?.id || 0} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="enableAnimations" defaultChecked={anim?.enableAnimations ?? true} className="w-5 h-5 text-orange-600 rounded border-gray-300" />
              <span className="text-sm font-semibold text-gray-700">Enable All Animations</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="enableParticles" defaultChecked={anim?.enableParticles ?? true} className="w-5 h-5 text-orange-600 rounded border-gray-300" />
              <span className="text-sm font-semibold text-gray-700">Floating Particles</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="enableFlowers" defaultChecked={anim?.enableFlowers ?? true} className="w-5 h-5 text-orange-600 rounded border-gray-300" />
              <span className="text-sm font-semibold text-gray-700">Falling Flowers</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="enableFog" defaultChecked={anim?.enableFog ?? true} className="w-5 h-5 text-orange-600 rounded border-gray-300" />
              <span className="text-sm font-semibold text-gray-700">Morning Fog / Mist</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="enableParallax" defaultChecked={anim?.enableParallax ?? true} className="w-5 h-5 text-orange-600 rounded border-gray-300" />
              <span className="text-sm font-semibold text-gray-700">Mouse Parallax</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="enableGlow" defaultChecked={anim?.enableGlow ?? true} className="w-5 h-5 text-orange-600 rounded border-gray-300" />
              <span className="text-sm font-semibold text-gray-700">Warm Glow Effects</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="enableLeaves" defaultChecked={anim?.enableLeaves ?? false} className="w-5 h-5 text-orange-600 rounded border-gray-300" />
              <span className="text-sm font-semibold text-gray-700">Falling Sacred Leaves</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="enableSmoke" defaultChecked={anim?.enableSmoke ?? false} className="w-5 h-5 text-orange-600 rounded border-gray-300" />
              <span className="text-sm font-semibold text-gray-700">Aarti Smoke (Fog)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="enableSparkles" defaultChecked={anim?.enableSparkles ?? false} className="w-5 h-5 text-orange-600 rounded border-gray-300" />
              <span className="text-sm font-semibold text-gray-700">Golden Sparkles</span>
            </label>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-xl border border-gray-100">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between mb-2">
                <span>Animation Speed (Slow to Fast)</span>
                <span className="text-orange-600">{anim?.speedMultiplier || 1.0}x</span>
              </label>
              <input type="range" min="0.5" max="2.0" step="0.1" name="speedMultiplier" defaultValue={anim?.speedMultiplier || 1.0} className="w-full accent-orange-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1 font-semibold"><span>0.5x (Slow)</span><span>1.0x (Normal)</span><span>2.0x (Fast)</span></div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between mb-2">
                <span>Animation Intensity (Amount)</span>
                <span className="text-orange-600">{anim?.intensityMultiplier || 1.0}x</span>
              </label>
              <input type="range" min="0.2" max="3.0" step="0.1" name="intensityMultiplier" defaultValue={anim?.intensityMultiplier || 1.0} className="w-full accent-orange-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1 font-semibold"><span>Thoda (Low)</span><span>Normal</span><span>Bahut Jada (High)</span></div>
            </div>
          </div>

          <button type="submit" className={btnCls}>Save Animations</button>
        </form>
      </section>

      {/* SEO Settings */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">SEO Management</h2>
        <form action={updateSeoSettings} className="space-y-4">
          <input type="hidden" name="id" value={seo?.id || 0} />
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Meta Title</label>
            <input name="metaTitle" defaultValue={seo?.metaTitle || "Hanuman Mandir"} required className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Meta Description</label>
            <textarea name="metaDescription" defaultValue={seo?.metaDescription || "Welcome to Hanuman Mandir"} required className={`${inputCls} h-24 resize-none`} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Keywords (comma separated)</label>
            <input name="keywords" defaultValue={seo?.keywords || "hanuman, mandir, temple"} required className={inputCls} />
          </div>
          <button type="submit" className={btnCls}>Save SEO</button>
        </form>
      </section>

      {/* Change Admin Credentials */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Change Admin Credentials</h2>
        <p className="text-sm text-gray-500 mb-6">Update your admin username or password. Current password is required to make any changes.</p>
        <ChangeCredentialsForm currentUsername={admin?.username || "admin"} />
      </section>
    </div>
  );
}

