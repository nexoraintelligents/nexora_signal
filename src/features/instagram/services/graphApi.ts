import { MetaReplyResponse } from '../types';
import axios from "axios";

const META_API_VERSION = 'v25.0';

export async function sendInstagramMessage(
  recipientId: string,
  text: string
): Promise<MetaReplyResponse | null> {

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  console.log("========== INSTAGRAM SEND DEBUG START ==========");
  console.log("[DEBUG] Recipient:", recipientId);
  console.log("[DEBUG] Message:", text);
  console.log("[DEBUG] Token exists:", !!token);

  if (!token) {
    console.error('[Instagram] ❌ INSTAGRAM_ACCESS_TOKEN is not defined');
    return null;
  }

  const pageId = process.env.INSTAGRAM_PAGE_ID;
  if (!pageId) {
    console.error('[Instagram] ❌ INSTAGRAM_PAGE_ID is not defined');
    return null;
  }
  const url = `https://graph.facebook.com/${META_API_VERSION}/${pageId}/messages`;
  const payload = {
    recipient: { id: recipientId },
    message: { text },
  };

  console.log("[DEBUG] URL:", url);
  console.log("[DEBUG] Payload:", JSON.stringify(payload, null, 2));

  try {
    console.log("🔥 BEFORE AXIOS CALL");

    const response = await axios.post(
      url,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ AXIOS SUCCESS RESPONSE:");
    console.log("[DEBUG] Status:", response.status);
    console.log("[DEBUG] Data:", JSON.stringify(response.data, null, 2));

    console.log("========== INSTAGRAM SEND DEBUG END ==========");

    return response.data as MetaReplyResponse;

  } catch (error: any) {
    console.error("❌ AXIOS ERROR START ==========");

    if (error.response) {
      // 🔴 Meta API error
      console.error("[DEBUG] HTTP Status:", error.response.status);
      console.error("[DEBUG] Status Text:", error.response.statusText);
      console.error("[DEBUG] Response Data:", JSON.stringify(error.response.data, null, 2));

      const err = error.response.data?.error;
      if (err) {
        console.error("❌ META API ERROR:");
        console.error("Type:", err.type);
        console.error("Message:", err.message);
        console.error("Code:", err.code);
        console.error("Subcode:", err.error_subcode);
        console.error("FB Trace ID:", err.fbtrace_id);
      }

    } else if (error.request) {
      // ❌ request made but no response
      console.error("❌ NO RESPONSE RECEIVED:", error.request);
    } else {
      // ❌ something else
      console.error("❌ AXIOS GENERAL ERROR:", error.message);
    }

    console.error("❌ AXIOS ERROR END ==========");
    return null;
  }
}
/**
 * Fetches a list of media objects (Posts and Reels) for the authenticated account.
 */
export async function getInstagramMedia(): Promise<any[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN; // ✅ read at request time
  if (!token) {
    console.error('[Instagram] INSTAGRAM_ACCESS_TOKEN is not defined');
    return [];
  }

  let url = `https://graph.instagram.com/${META_API_VERSION}/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count` as string | null;
  let allMedia: any[] = [];

  try {
    while (url && allMedia.length < 200) {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.data) {
        allMedia = allMedia.concat(data.data);
      }

      url = data.paging?.next || null;
    }
    console.log(`[Instagram API Response (Media)] Fetched ${allMedia.length} total media items`);
    return allMedia;
  } catch (error) {
    console.error('[Instagram] getInstagramMedia failed:', error);
    return allMedia;
  }
}

/**
 * Fetches all available insights for a specific media object.
 */
export async function getMediaInsights(mediaId: string, mediaType?: string): Promise<any[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    console.error('[Instagram] INSTAGRAM_ACCESS_TOKEN is not defined');
    return [];
  }

  const isReel = mediaType === 'VIDEO' || mediaType === 'REELS';
  const metrics = isReel
    ? 'plays,reach,likes,comments,shares,saved,total_interactions,ig_reels_avg_watch_time'
    : 'reach,saved,total_interactions,likes,comments,shares,profile_visits,follows';

  // ✅ Correct — uses mediaId, not igSid
  const url = `https://graph.facebook.com/${META_API_VERSION}/${mediaId}/insights?metric=${metrics}`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();

    if (data.error) {
      console.error(`[Instagram] Insights error for ${mediaId}:`, data.error);
      return [];
    }

    return data.data || [];
  } catch (error) {
    console.error('[Instagram] getMediaInsights failed:', error);
    return [];
  }
}

/**
 * Fetches comments for a specific media object.
 */
export async function getInstagramComments(mediaId: string): Promise<any[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN; // ✅ read at request time
  if (!token) {
    console.error('[Instagram] INSTAGRAM_ACCESS_TOKEN is not defined');
    return [];
  }

  let url = `https://graph.instagram.com/${META_API_VERSION}/${mediaId}/comments?fields=id,text,timestamp,like_count,from,user,replies{id,text,timestamp,from,user}&limit=100` as string | null;
  let allComments: any[] = [];

  try {
    while (url && allComments.length < 500) {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.data) {
        allComments = allComments.concat(data.data);
      }

      url = data.paging?.next || null;
    }

    console.log(`[Instagram API Response (Comments)] Fetched ${allComments.length} total comments for ${mediaId}`);
    return allComments;
  } catch (error) {
    console.error('[Instagram] getInstagramComments failed:', error);
    return allComments;
  }
}

/**
 * Fetch username from IGSID.
 */
export async function getInstagramUsername(igSid: string): Promise<string> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    console.error('[Instagram] INSTAGRAM_ACCESS_TOKEN is not defined');
    return 'instagram_user';
  }

  // ✅ Fixed — graph.facebook.com, not graph.instagram.com
  const url = `https://graph.facebook.com/${META_API_VERSION}/${igSid}?fields=name,username`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    return data.username || data.name || 'instagram_user';
  } catch {
    return 'instagram_user';
  }
}

/**
 * Sends a private DM as a reply to a public comment.
 */
export async function sendPrivateReply(commentId: string, message: string): Promise<any> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN; // ✅ read at request time
  if (!token) {
    console.error('[Instagram] INSTAGRAM_ACCESS_TOKEN is not defined');
    return null;
  }

  const url = `https://graph.instagram.com/${META_API_VERSION}/${commentId}/private_replies?message=${encodeURIComponent(message)}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    console.log(`[Instagram API] Private reply sent to comment ${commentId}:`, data);
    return data;
  } catch (error) {
    console.error('[Instagram] sendPrivateReply failed:', error);
    return null;
  }
}