export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { updateSiteSettings, updateThemeSettings, updateAnimationSettings, updateSeoSettings } from "../actions";
import ChangeCredentialsForm from "./ChangeCredentialsForm";

const inputCls = "w-full p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm mb-3";
const btnCls = "bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm";
const sectionCls = "bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8";

export default async function SettingsPage() {
  const [site, theme, anim, seo, admin] = await Promise.all([
    prisma.siteSettings.findFirst().catch(() => null),
    prisma.themeSettings.findFirst().catch(() => null),
    prisma.animationSettings.findFirst().catch(() => null),
    prisma.seoSettings.findFirst().catch(() => null),
    prisma.adminUser.findFirst().catch(() => null),
  ]);

  return (
    <div className="space-y-10 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Global Settings</h1>
        <p className="text-gray-500 mt-1">Manage global theme, animations, SEO, and Hero texts.</p>
      </div>

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
          </div>

          <div className="mt-6">
            <label className="text-xs font-bold text-gray-500 uppercase">Animation Speed Multiplier (0.5x to 2x)</label>
            <input type="number" step="0.1" name="speedMultiplier" defaultValue={anim?.speedMultiplier || 1.0} className="w-32 p-2 rounded-lg border border-gray-200 text-sm mt-2 block" />
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

