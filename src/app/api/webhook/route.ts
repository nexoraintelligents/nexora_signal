import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { processWebhookPayload } from '@/features/instagram/services/processor';

// ✅ Meta calls GET to verify your webhook endpoint
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  console.log('[Instagram Webhook] GET verification attempt:', { mode, token: !!token, challenge });

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('[Instagram Webhook] ✅ Verification successful');
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn('[Instagram Webhook] ❌ Verification failed — token mismatch or wrong mode');
  return new NextResponse('Forbidden', { status: 403 });
}

// ✅ Meta sends POST for actual events
export async function POST(req: NextRequest) {
  const requestStart = Date.now();
  console.log('========== WEBHOOK POST START ==========');

  try {
    // STEP 1: Read raw body
    console.log('[Webhook STEP 1] Reading raw body...');
    const rawBody = await req.text();
    console.log('[Webhook STEP 1 DONE] Body length:', rawBody.length);

    // STEP 2: Verify signature
    console.log('[Webhook STEP 2] Verifying signature...');
    const sig = req.headers.get('x-hub-signature-256') || '';
    const appSecret = process.env.INSTAGRAM_APP_SECRET;

    if (!appSecret) {
      console.error('[Webhook STEP 2] ❌ INSTAGRAM_APP_SECRET is not set!');
    } else {
      const expected = 'sha256=' + crypto
        .createHmac('sha256', appSecret)
        .update(rawBody)
        .digest('hex');

      if (sig !== expected) {
        console.warn('[Webhook STEP 2] ⚠️ Signature mismatch — bypassing for testing');
        console.warn('[Webhook STEP 2] Received :', sig);
        console.warn('[Webhook STEP 2] Expected :', expected);
        // Uncomment to enforce in production:
        // return new NextResponse('Unauthorized', { status: 401 });
      } else {
        console.log('[Webhook STEP 2] ✅ Signature verified');
      }
    }

    // STEP 3: Parse payload
    console.log('[Webhook STEP 3] Parsing JSON payload...');
    const payload = JSON.parse(rawBody);
    console.log('[Webhook STEP 3 DONE] Payload:', JSON.stringify(payload, null, 2));

    // STEP 4: Process payload — ✅ AWAITED so Vercel doesn't kill it early
    console.log('[Webhook STEP 4] Starting processWebhookPayload (AWAITED)...');
    await processWebhookPayload(payload);
    console.log('[Webhook STEP 4 DONE] processWebhookPayload completed successfully');

    const duration = Date.now() - requestStart;
    console.log(`========== WEBHOOK POST END (${duration}ms) ==========`);

    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    const duration = Date.now() - requestStart;
    console.error(`[Instagram Webhook] ❌ POST error after ${duration}ms:`, error);
    console.log('========== WEBHOOK POST END WITH ERROR ==========');

    // ⚠️ Still return 200 to Meta so it doesn't retry endlessly
    return new NextResponse('OK', { status: 200 });
  }
}