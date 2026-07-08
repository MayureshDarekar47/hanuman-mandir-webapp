"use server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import bcrypt from "bcryptjs";

export async function addNotice(formData: FormData) {
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  await prisma.notice.create({ data: { title, subtitle } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function deleteNotice(id: number) {
  await prisma.notice.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function addEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const dateStr = formData.get("date") as string;
  const description = formData.get("description") as string;
  await prisma.event.create({ data: { title, description, date: new Date(dateStr) } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function deleteEvent(id: number) {
  await prisma.event.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function addExpense(formData: FormData) {
  const dateStr = formData.get("date") as string;
  const category = formData.get("category") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const remark = formData.get("remark") as string;
  await prisma.expense.create({ data: { date: new Date(dateStr), category, amount, remark } });
  revalidatePath("/expenses");
  revalidatePath("/admin/dashboard");
}

export async function deleteExpense(id: number) {
  await prisma.expense.delete({ where: { id } });
  revalidatePath("/expenses");
  revalidatePath("/admin/dashboard");
}

export async function uploadGalleryImage(formData: FormData) {
  const file = formData.get("image") as File;
  if (!file || file.size === 0) return;
  if (file.size > 10 * 1024 * 1024) {
    console.error("Gallery upload rejected: file exceeds 10MB limit");
    return;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  // Sanitize filename: keep only alphanumeric, dots, dashes, underscores
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${Date.now()}_${safeName}`;
  const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';
  
  try {
    const { error } = await supabase.storage.from(bucketName).upload(`gallery/${filename}`, buffer, {
      contentType: file.type,
      upsert: false, // don't upsert gallery images — each is unique
    });
    if (error) {
      console.error("Supabase storage gallery upload error:", JSON.stringify(error));
      throw error;
    }
    
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`gallery/${filename}`);
    await prisma.galleryImage.create({ data: { url: publicUrlData.publicUrl, altText: file.name } });
  } catch (e) {
    console.error("Failed to upload gallery image", e);
    return;
  }
  
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function deleteGalleryImage(id: number, url: string) {
  try {
    await prisma.galleryImage.delete({ where: { id } });
    const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';
    const publicUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/`;
    const pathToRemove = url.startsWith(publicUrlPrefix) ? url.replace(publicUrlPrefix, '') : url;
    
    if (pathToRemove) {
      await supabase.storage.from(bucketName).remove([pathToRemove]);
    }
  } catch (e) {
    console.error(e);
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

// ── Donor Actions ──────────────────────────────────────────────
export async function addDonor(formData: FormData) {
  const name = formData.get("name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const dateStr = formData.get("date") as string;
  const note = formData.get("note") as string;
  if (!name || isNaN(amount) || !dateStr) return;
  await prisma.donor.create({ data: { name, amount, date: new Date(dateStr), note: note || null } });
  revalidatePath("/donors");
  revalidatePath("/admin/dashboard");
}

export async function deleteDonor(id: number) {
  await prisma.donor.delete({ where: { id } });
  revalidatePath("/donors");
  revalidatePath("/admin/dashboard");
}

export async function importDonorsFromCSV(formData: FormData) {
  const file = formData.get("csv") as File;
  if (!file || file.size === 0) return;

  const text = await file.text();
  const lines = text.trim().split("\n").filter(Boolean);
  // Skip header row, expect: name, amount, date (dd/mm/yyyy or yyyy-mm-dd), note
  const dataLines = lines.slice(1);

  const records: { name: string; amount: number; date: Date; note?: string }[] = [];
  for (const line of dataLines) {
    const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
    const name = cols[0];
    const amount = parseFloat(cols[1]);
    const rawDate = cols[2];
    const note = cols[3] || undefined;

    if (!name || isNaN(amount) || !rawDate) continue;

    // Try parsing date — support dd/mm/yyyy or yyyy-mm-dd
    let parsedDate: Date;
    if (rawDate.includes("/")) {
      const [d, m, y] = rawDate.split("/");
      parsedDate = new Date(`${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`);
    } else {
      parsedDate = new Date(rawDate);
    }
    if (isNaN(parsedDate.getTime())) continue;
    records.push({ name, amount, date: parsedDate, note });
  }

  if (records.length > 0) {
    await prisma.donor.createMany({ data: records });
  }
  revalidatePath("/donors");
  revalidatePath("/admin/dashboard");
}

// ── Aarti Actions ─────────────────────────────────────────────
export async function uploadAarti(formData: FormData) {
  const file = formData.get("audio") as File;
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  if (!file || file.size === 0 || !title) return;
  if (file.size > 10 * 1024 * 1024) {
    console.error("Aarti upload rejected: file exceeds 10MB limit");
    return;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp3';
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `aarti-${Date.now()}_${safeName}`;
  const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';
  try {
    console.log(`[uploadAarti] Uploading to bucket: ${bucketName}, path: ${filename}`);
    const { error } = await supabase.storage.from(bucketName).upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      console.error("[uploadAarti] Storage error:", JSON.stringify(error));
      throw error;
    }
    
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filename);
    
    await prisma.aarti.create({ data: { title, audioUrl: publicUrlData.publicUrl, createdAt: new Date() } });
  } catch (e) {
    console.error("Failed to upload aarti", e);
    return;
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function deleteAarti(id: number, audioUrl: string) {
  try {
    await prisma.aarti.delete({ where: { id } });
    const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';
    const publicUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/`;
    const pathToRemove = audioUrl.startsWith(publicUrlPrefix) ? audioUrl.replace(publicUrlPrefix, '') : audioUrl;
    
    if (pathToRemove) {
      await supabase.storage.from(bucketName).remove([pathToRemove]);
    }
  } catch (e) {
    console.error(e);
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

// ── Hero Background Actions ──────────────────────────────────
export async function uploadHeroBackground(formData: FormData) {
  const file = formData.get("image") as File;
  if (!file || file.size === 0) return { error: "No file provided" };
  if (file.size > 10 * 1024 * 1024) return { error: "File must be less than 10MB" };

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `hero-${timestamp}.${ext}`;
  const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';

  try {
    console.log(`[uploadHeroBackground] Uploading to bucket: ${bucketName}, path: ${filename}, type: ${file.type}`);
    
    // Upload original file directly (no WebP conversion)
    const { error } = await supabase.storage.from(bucketName).upload(filename, buffer, { 
      contentType: file.type, 
      upsert: false 
    });
    
    if (error) {
      console.error("[uploadHeroBackground] Storage error:", JSON.stringify(error));
      throw error;
    }
    
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filename);

    // Deactivate all existing
    await prisma.heroBackground.updateMany({ data: { isActive: false } });

    // Save new background as active
    await prisma.heroBackground.create({
      data: {
        url: urlData.publicUrl,
        mobileUrl: urlData.publicUrl, // Same URL since we removed resizing
        isActive: true,
      }
    });

    // Enforce history limit: keep only 5 backups + 1 active = 6 max.
    const allBgs = await prisma.heroBackground.findMany({
      orderBy: { createdAt: "desc" }
    });
    
    if (allBgs.length > 6) {
      const toDelete = allBgs.slice(6);
      for (const bg of toDelete) {
        await _deleteHeroBgRecord(bg.id, bg.url, bg.mobileUrl);
      }
    }

  } catch (e) {
    console.error("Failed to process hero background", e);
    return { error: "Failed to process image" };
  }
  
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function setHeroBackgroundActive(id: number) {
  await prisma.heroBackground.updateMany({ data: { isActive: false } });
  await prisma.heroBackground.update({
    where: { id },
    data: { isActive: true }
  });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

// Private helper — does NOT call revalidatePath (safe to call internally)
async function _deleteHeroBgRecord(id: number, url: string, mobileUrl?: string | null) {
  try {
    await prisma.heroBackground.delete({ where: { id } });
    const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';
    const publicUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/`;
    const pathsToRemove: string[] = [];
    if (url) pathsToRemove.push(url.startsWith(publicUrlPrefix) ? url.replace(publicUrlPrefix, '') : url);
    if (mobileUrl) pathsToRemove.push(mobileUrl.startsWith(publicUrlPrefix) ? mobileUrl.replace(publicUrlPrefix, '') : mobileUrl);
    if (pathsToRemove.length > 0) {
      await supabase.storage.from(bucketName).remove(pathsToRemove);
    }
  } catch (e) {
    console.error("Delete Hero Background Error:", e);
  }
}

export async function deleteHeroBackground(id: number, url: string, mobileUrl?: string | null) {
  await _deleteHeroBgRecord(id, url, mobileUrl);
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

// ── Global CMS Settings Actions ────────────────────────────────

export async function updateSiteSettings(formData: FormData) {
  const id = parseInt(formData.get("id") as string) || 0;
  const data = {
    heroTitle: formData.get("heroTitle") as string,
    heroSubtitle: formData.get("heroSubtitle") as string,
    heroQuote: formData.get("heroQuote") as string,
    heroLocation: formData.get("heroLocation") as string,
  };

  // Use upsert to avoid duplicate-row race condition
  await prisma.siteSettings.upsert({
    where: { id: id > 0 ? id : 0 },
    create: data,
    update: data,
  });
  
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function updateThemeSettings(formData: FormData) {
  const id = parseInt(formData.get("id") as string) || 0;
  const data = {
    primaryColor: formData.get("primaryColor") as string,
    secondaryColor: formData.get("secondaryColor") as string,
    backgroundColor: formData.get("backgroundColor") as string,
    textColor: formData.get("textColor") as string,
  };
  
  if (id === 0) await prisma.themeSettings.create({ data });
  else await prisma.themeSettings.update({ where: { id }, data });
  
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function updateAnimationSettings(formData: FormData) {
  const id = parseInt(formData.get("id") as string) || 0;
  const data = {
    enableAnimations: formData.get("enableAnimations") === "on",
    enableParticles: formData.get("enableParticles") === "on",
    enableFlowers: formData.get("enableFlowers") === "on",
    enableFog: formData.get("enableFog") === "on",
    enableParallax: formData.get("enableParallax") === "on",
    enableGlow: formData.get("enableGlow") === "on",
    speedMultiplier: parseFloat(formData.get("speedMultiplier") as string) || 1.0,
  };
  
  if (id === 0) await prisma.animationSettings.create({ data });
  else await prisma.animationSettings.update({ where: { id }, data });
  
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function updateSeoSettings(formData: FormData) {
  const id = parseInt(formData.get("id") as string) || 0;
  const data = {
    metaTitle: formData.get("metaTitle") as string,
    metaDescription: formData.get("metaDescription") as string,
    keywords: formData.get("keywords") as string,
  };
  
  if (id === 0) await prisma.seoSettings.create({ data });
  else await prisma.seoSettings.update({ where: { id }, data });
  
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

// ── Admin Credentials ──────────────────────────────────────────
export async function changeAdminCredentials(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newUsername = formData.get("newUsername") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newUsername) return { error: "Username and current password are required." };

  const admin = await prisma.adminUser.findFirst().catch(() => null);
  if (!admin) return { error: "Admin user not found." };

  const isValid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!isValid) return { error: "Current password is incorrect." };

  let dataToUpdate: { username: string; passwordHash?: string } = { username: newUsername };

  if (newPassword) {
    if (newPassword !== confirmPassword) return { error: "New passwords do not match." };
    if (newPassword.length < 4) return { error: "Password must be at least 4 characters." };
    dataToUpdate.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: dataToUpdate,
  });

  return { success: "Credentials updated successfully." };
}

// ── QR Code Upload ──────────────────────────────────────────────
export async function uploadQRCode(formData: FormData) {
  const file = formData.get("qr") as File;
  if (!file || file.size === 0) return;
  if (file.size > 5 * 1024 * 1024) {
    console.error("QR upload rejected: exceeds 5MB");
    return;
  }
  if (!file.type.startsWith("image/")) {
    console.error("QR upload rejected: not an image");
    return;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';
  // Use flat path, preserve original format
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const storagePath = `donation-qr.${ext}`;

  try {
    console.log(`[uploadQRCode] Uploading to bucket: ${bucketName}, path: ${storagePath}`);
    const { error } = await supabase.storage.from(bucketName).upload(storagePath, buffer, { contentType: file.type, upsert: true });
    if (error) {
      console.error("[uploadQRCode] Supabase storage error:", JSON.stringify(error));
      throw error;
    }

    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
    console.log(`[uploadQRCode] Public URL: ${publicUrlData.publicUrl}`);

    // Safe upsert: find existing record first, update by real ID
    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
      await prisma.siteSettings.update({ where: { id: existing.id }, data: { qrImageUrl: publicUrlData.publicUrl } });
    } else {
      await prisma.siteSettings.create({ data: { qrImageUrl: publicUrlData.publicUrl } });
    }
  } catch (e) {
    console.error("[uploadQRCode] Failed:", e);
    return;
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

// ── Guidelines CRUD ─────────────────────────────────────────────
export async function addGuideline(formData: FormData) {
  const text = formData.get("text") as string;
  if (!text?.trim()) return;

  const count = await prisma.guideline.count().catch(() => 0);
  await prisma.guideline.create({
    data: { text: text.trim(), orderIndex: count },
  });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function deleteGuideline(id: number) {
  await prisma.guideline.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function uploadAboutImage(formData: FormData) {
  const file = formData.get("image") as File;
  if (!file || file.size === 0) return { error: "No file provided" };
  if (file.size > 10 * 1024 * 1024) return { error: "File must be less than 10MB" };

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  
  // Preserve original file extension — do NOT force-convert to WebP
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  // Use a flat filename (no subdirectory) to avoid Supabase Storage path issues
  const storagePath = `about-section-${timestamp}.${ext}`;
  const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';

  try {
    console.log(`[uploadAboutImage] Uploading to bucket: ${bucketName}, path: ${storagePath}, type: ${file.type}`);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, buffer, { contentType: file.type, upsert: true });
    
    if (error) {
      console.error("[uploadAboutImage] Supabase storage error:", JSON.stringify(error));
      throw error;
    }
    
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
    console.log(`[uploadAboutImage] Public URL: ${publicUrlData.publicUrl}`);
    
    // Safe upsert: find first record, then upsert by its actual ID (or create new)
    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: { aboutImage: publicUrlData.publicUrl },
      });
    } else {
      await prisma.siteSettings.create({
        data: { aboutImage: publicUrlData.publicUrl },
      });
    }
  } catch (e) {
    console.error("[uploadAboutImage] Failed:", e);
    return { error: "Failed to upload image. Check server logs for details." };
  }
  
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function deleteAboutImage(imageUrl: string) {
  try {
    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: { aboutImage: null },
      });
    }
    const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';
    const publicUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/`;
    const pathToRemove = imageUrl.startsWith(publicUrlPrefix) ? imageUrl.replace(publicUrlPrefix, '') : null;
    if (pathToRemove) {
      await supabase.storage.from(bucketName).remove([pathToRemove]);
    }
  } catch (e) {
    console.error("Delete About Image Error:", e);
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/settings");
}

export async function deleteQRCode(qrImageUrl: string) {
  try {
    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: { qrImageUrl: null },
      });
    }
    const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';
    const publicUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/`;
    const pathToRemove = qrImageUrl.startsWith(publicUrlPrefix) ? qrImageUrl.replace(publicUrlPrefix, '') : null;
    if (pathToRemove) {
      await supabase.storage.from(bucketName).remove([pathToRemove]);
    }
  } catch (e) {
    console.error("Delete QR Code Error:", e);
  }
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/settings");
}

// ── Temple Timings ──────────────────────────────────────────────
export async function addTiming(formData: FormData) {
  const title = formData.get("title") as string;
  const time = formData.get("time") as string;
  const description = formData.get("description") as string;
  if (!title?.trim() || !time?.trim()) return;

  const count = await prisma.timing.count().catch(() => 0);
  await prisma.timing.create({
    data: { 
      title: title.trim(), 
      time: time.trim(), 
      description: description?.trim() || null, 
      orderIndex: count 
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function deleteTiming(id: number) {
  await prisma.timing.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}
