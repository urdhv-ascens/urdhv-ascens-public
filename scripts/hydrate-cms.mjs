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
  : 'https://urdhvascens.com/api/content.php';

async function hydrate() {
  console.log('🔄 Initiating Ūrdhv Ascens CMS Data Hydration...');

  // 1. Primary Source: Hostinger Content API (Spec §3.1)
  try {
    console.log(`📡 Checking Hostinger Control Center API (${HOSTINGER_API})...`);
    const res = await fetch(HOSTINGER_API, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object' && !data.error && data.hero) {
        await fs.writeFile(contentPath, JSON.stringify(data, null, 2), 'utf8');
        console.log('✅ Successfully hydrated content.json from Hostinger Control Center!');
        return;
      }
    }
  } catch (err) {
    console.warn('⚠️ Hostinger API unreachable or timed out:', err.message);
  }

  // 2. Secondary Source: Local bundled content.json verification
  try {
    const localContent = await fs.readFile(contentPath, 'utf8');
    const parsed = JSON.parse(localContent);
    if (parsed && parsed.hero) {
      console.log('✅ Using bundled local content.json (Build will proceed reliably).');
      return;
    }
  } catch (err) {
    console.warn('⚠️ Local content.json not found or invalid:', err.message);
  }

  console.log('ℹ️ Proceeding with static defaults.');
}

hydrate();
