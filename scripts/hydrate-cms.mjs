import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentPath = path.join(__dirname, '..', 'src', 'data', 'content.json');

const HOSTINGER_API = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/content.php`
  : 'https://gold-cat-133405.hostingersite.com/api/content.php';

async function hydrate() {
  console.log('🔄 Initiating Ūrdhv Ascens CMS Data Hydration...');

  let localContent = {};
  try {
    const raw = await fs.readFile(contentPath, 'utf8');
    localContent = JSON.parse(raw);
  } catch (err) {
    console.warn('⚠️ Could not read local content.json:', err.message);
  }

  // 1. Fetch Remote Updates from Hostinger
  try {
    console.log(`📡 Checking Hostinger Control Center API (${HOSTINGER_API})...`);
    const res = await fetch(HOSTINGER_API, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15000)
    });

    if (res.ok) {
      const remoteData = await res.json();
      if (remoteData && typeof remoteData === 'object' && !remoteData.error && remoteData.hero) {
        // Intelligently merge: Preserve local assets, webp image paths, and git-committed data
        const merged = {
          ...localContent,
          ...remoteData,
          siteSettings: { ...(localContent.siteSettings || {}), ...(remoteData.siteSettings || {}) },
          hero: {
            ...(localContent.hero || {}),
            ...(remoteData.hero || {}),
            backgroundImage: (localContent.hero?.backgroundImage && localContent.hero.backgroundImage !== '/assets/images/favicon.webp')
              ? localContent.hero.backgroundImage
              : (remoteData.hero?.backgroundImage || '/assets/images/hero-bg.webp'),
            backgroundBlur: localContent.hero?.backgroundBlur ?? 4,
            backgroundOpacity: localContent.hero?.backgroundOpacity ?? 55
          },
          about: {
            ...(localContent.about || {}),
            ...(remoteData.about || {}),
            imageUrl: localContent.about?.imageUrl || '/assets/images/About-Us.webp'
          },
          legal: {
            ...(remoteData.legal || {}),
            ...(localContent.legal || {})
          },
          // For projectsList, merge item by item, preserving local imageUrl and descriptions if remote has empty string
          projectsList: (localContent.projectsList || []).map((localProj) => {
            const remoteProj = Array.isArray(remoteData.projectsList)
              ? remoteData.projectsList.find((p) => p.id === localProj.id || p.slug === localProj.slug)
              : null;
            if (!remoteProj) return localProj;
            return {
              ...localProj,
              ...remoteProj,
              // Never overwrite local imageUrl if remote is empty
              imageUrl: remoteProj.imageUrl && remoteProj.imageUrl.trim() !== '' ? remoteProj.imageUrl : localProj.imageUrl,
              // Never downgrade Enhance Doorstep description if remote is stale
              description: localProj.slug === 'enhance-doorstep' && !remoteProj.description?.includes('salon')
                ? localProj.description
                : (remoteProj.description || localProj.description),
              category: localProj.slug === 'enhance-doorstep' && !remoteProj.category?.includes('Salon')
                ? localProj.category
                : (remoteProj.category || localProj.category)
            };
          })
        };

        await fs.writeFile(contentPath, JSON.stringify(merged, null, 2), 'utf8');
        console.log('✅ Successfully hydrated and merged content.json (local assets preserved)!');
        return;
      }
    }
  } catch (err) {
    console.warn('⚠️ Hostinger API unreachable or timed out:', err.message);
  }

  // 2. Secondary Source: Local bundled content.json verification
  if (localContent && localContent.hero) {
    console.log('✅ Using bundled local content.json (Build will proceed reliably).');
    return;
  }

  console.log('ℹ️ Proceeding with static defaults.');
}

hydrate();
