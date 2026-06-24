# KM.DEV Shop — Session Changes

This document details every modification made to the shop management system during this session.

---

## 1. PIN Access Gate

**Files modified:** `public/shop.html`, `shop.html`

**What:** Added a full-screen PIN gate that blocks all content until the correct PIN is entered.

**Why:** Restrict access so only the owner (you) can use the shop. The PIN gate appears immediately on page load, before any content is rendered.

**How it works:**
- A `<div id="pinGate">` overlay is positioned fixed, covering the entire viewport
- It displays a centered lock icon, title ("KM.DEV — Private Access"), subtitle, password input, and Unlock button
- The gate is styled with the same CSS custom properties as the rest of the app (supports both dark/light themes)
- Once unlocked, `sessionStorage.setItem('km_pin', '1')` is set — so the gate won't reappear until the browser tab is closed
- A tiny inline `<script>` right after the gate HTML checks `sessionStorage.getItem('km_pin')` on every page load and immediately hides the gate if already unlocked (runs before any paint)

**PIN:** `060160`

**Files touched:**
| Location | What was added |
|---|---|
| CSS (~line 320) | `#pinGate`, `.pin-box`, `.pin-icon`, `.pin-title`, `.pin-sub`, `.pin-inp`, `.pin-err`, `.pin-btn` styles |
| HTML (~line 335) | PIN gate overlay with input, error message, unlock button |
| Inline script (~line 345) | Session check to auto-hide gate if already unlocked |
| JS function `checkPin()` (~line 2066) | Validates input against PIN, shows error on mismatch, stores session and hides on success |

---

## 2. Branding — "KM DEV"

**Files modified:** `public/shop.html`, `shop.html`

**What:** Updated all company branding references from generic names to "KM DEV".

**Changes made:**

| Location | Before | After |
|---|---|---|
| `<title>` | `KM.DEV Cellphone Shop v2` | `KM DEV — Shop v2` |
| Header `<h1>` | `KM.DEV Shop Management` | `KM DEV — Shop` |
| Header subtitle | `Data saved in your browser · KM.DEV` | `Private · KM DEV` |
| Auth modal `<h2>` | `KM.DEV Shop` | `KM DEV` |
| Default company name (config) | `CELLPHONE REPAIR SHOP` | `KM DEV` |

All other brand references (phone `060 160 3996`, email `kgomotsothabo2004@gmail.com`, address `Gauteng, South Africa`) remain unchanged.

---

## 3. Logo & Print System — Audit (No Changes Needed)

**What we verified:** The logo rendering system is already fully implemented across all four receipt views. No code changes were required.

**Existing logo support:**

| Receipt View | File | Line | Code |
|---|---|---|---|
| Printed receipts | `buildPrint()` | ~1537 | `var logo=cfg.logo?'<div><img...':'':''` |
| Receipt preview modal | `vRec()` | ~1473 | `if(cfg.logo) h+='<img...'` |
| Generator printed receipts | `rgPrintReceipt()` | ~2383 | `var logo=cfg.logo?'<div><img...':'':''` |
| Generator receipt modal | `rgViewReceipt()` | ~2326 | `if(cfg.logo)h+='<img...'` |

**How to use it:**
1. Go to the **Settings** tab
2. Enter password: `admin123`
3. Click **Upload Logo**
4. Select your logo image (max 5MB)
5. Click **Save Settings**

The logo will then automatically appear in:
- Printed receipt headers (in the print document header area)
- Receipt detail modals (in the company info section)
- WhatsApp share pages (the print preview opened before sharing)
- Any "Print to PDF" export

**Phone & Email in receipts:**
Both `cfg.phone` and `cfg.email` already render in every receipt view via dynamic config references — no hardcoding needed. They appear in the print header, modal company info, and generator views.

---

## 4. File Sync

After modifying `public/shop.html`, the changes were copied to `shop.html` in the root directory so both files remain identical.

---

## Summary of All Changes

| # | Change | Type | Status |
|---|---|---|---|
| 1 | PIN gate with `060160` | New feature | ✅ Done |
| 2 | Branding updated to "KM DEV" | Enhancement | ✅ Done |
| 3 | Logo/print system audit | Verification | ✅ Already built-in |

**Total lines of code added:** ~40 (PIN gate CSS + HTML + JS)
**Total lines modified:** ~8 (branding text replacements)


---

## 5. Receipt Generator Portal

**Files modified:** `shop.html`, `public/shop.html`

**What:** Added a complete standalone Receipt Generator section with password protection, offline-first storage, and MongoDB cloud sync.

**Features:**
- New tab: "🧾 Receipt Generator" (after Settings)
- Password-protected with admin credentials (email + password verified against MongoDB)
- Offline fallback to local password when server unreachable
- 3-step workflow: Customer → Items → Review & Generate
- Customer integration (search/select existing or create new)
- Receipt fields: number, customer info, date/time, items, qty, unit price, discount, total, notes, technician, payment status
- Payment status badges: Unpaid / Partial / Paid in Full
- Search by receipt #, name, phone, email, date
- History view with Print / View / Edit / Delete
- QR code generated on canvas for each receipt
- Print system extends existing (company info, logo, watermark, developer credit)
- Dashboard widget: total receipts, today's count, pending sync, total revenue
- Sync tab: Push unsynced to MongoDB, Pull from cloud, merge safely
- Sync status indicators: 🟢 Synced / 🟡 Pending
- Included in Export/Import backup system

**Lines added:** ~400 (CSS + HTML + JS)

---

## 6. Database Connection & API Routes

**Files created:**
- `src/models/GeneratedReceipt.ts` — Mongoose model for generated receipts
- `src/app/api/shop-auth/route.ts` — POST endpoint for admin password verification (bcrypt)
- `src/app/api/generated-receipts/route.ts` — GET/POST/DELETE for receipt CRUD & sync

**What:** Connected the shop.html Receipt Generator to the project's MongoDB database via Next.js API routes.

**How it works:**
- `/api/shop-auth` — verifies admin email + password against the Admin collection
- `/api/generated-receipts` — GET (pull all), POST (push/upsert batch), DELETE (by localId)
- shop.html calls these APIs for authentication and cloud sync
- Falls back to localStorage-only mode when offline

---

## 7. Navigation Link — "Receipts" in Homepage Nav

**Files modified:** `src/components/layout/Navbar.tsx`, `src/components/layout/MobileNav.tsx`

**What:** Added "Receipts" link after "Admin" in the public site navigation (desktop + mobile).

**Link:** `/shop.html` — served from `public/shop.html`

---

## Updated Summary

| # | Change | Type | Status |
|---|---|---|---|
| 1 | PIN gate with `060160` | New feature | ✅ Done |
| 2 | Branding updated to "KM DEV" | Enhancement | ✅ Done |
| 3 | Logo/print system audit | Verification | ✅ Already built-in |
| 4 | File sync | Maintenance | ✅ Done |
| 5 | Receipt Generator Portal | New feature | ✅ Done |
| 6 | Database connection + API routes | New feature | ✅ Done |
| 7 | "Receipts" nav link in homepage | Enhancement | ✅ Done |
