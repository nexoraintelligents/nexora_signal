import React from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import {
  MessageCircle,
  User,
  Clock,
  CheckCircle2,
  BarChart3,
  Image as ImageIcon,
  Heart,
  MessageSquare
} from 'lucide-react';
import SyncButton from './SyncButton';

export const metadata = {
  title: 'Instagram Analytics | Nexora Signal',
  description: 'Manage messages, media, and performance insights.',
};

export default async function InstagramDashboardPage() {
  const supabase = await createClient();

  // Fetch everything in parallel
  const [
    { data: messages, error: messagesError },
    { data: media, error: mediaError },
    { data: insights, error: insightsError },
    { data: comments },
    { data: replies }
  ] = await Promise.all([
    supabase.from('instagram_messages').select('*').order('created_at', { ascending: false }),
    supabase.from('instagram_media').select('*').order('timestamp', { ascending: false }),
    supabase.from('instagram_insights').select('*').order('end_time', { ascending: false }).limit(20),
    supabase.from('instagram_comments').select('*').order('timestamp', { ascending: false }),
    supabase.from('instagram_comment_replies').select('*').order('timestamp', { ascending: false })
  ]);


  console.log('[Instagram Dashboard] Data Summary:', {
    messagesCount: messages?.length || 0,
    mediaCount: media?.length || 0,
    insightsCount: insights?.length || 0,
    commentsCount: comments?.length || 0,
    repliesCount: replies?.length || 0,
    errors: { messagesError, mediaError, insightsError }
  });
  console.log('[Instagram Dashboard] Raw Insights:', JSON.stringify(insights?.slice(0, 5), null, 2));
  console.log('[Instagram Dashboard] Raw Comments (first 3):', JSON.stringify(comments?.slice(0, 3), null, 2));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Instagram Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Messages, Media Performance, and Growth Insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SyncButton />
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Total Messages</div>
            <MessageCircle className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{messages?.length || 0}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Media Posts</div>
            <ImageIcon className="w-4 h-4 text-pink-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{media?.length || 0}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Avg Engagement</div>
            <BarChart3 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {media?.length ? Math.round(media.reduce((acc: number, m: any) => acc + (m.like_count || 0), 0) / media.length) : 0}
          </div>
        </div>
      </div>

      {/* Per-Post Analytics */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          Post & Reel Analytics
        </h2>
        <div className="space-y-6">
          {media?.map((item: any) => {
            // Collect all data for this specific media item
            const postInsights = insights?.filter((ins: any) => ins.target_id === item.ig_id) || [];
            const postComments = comments?.filter((c: any) => c.media_id === item.ig_id) || [];
            
            const getMetric = (name: string) => postInsights.find((i: any) => i.metric_name === name)?.value ?? '-';
            const isReel = item.media_type === 'VIDEO' || item.media_type === 'REELS';

            return (
              <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail */}
                  <div className="md:w-48 md:h-auto h-48 bg-slate-100 dark:bg-zinc-800 relative shrink-0">
                    {item.media_url && (
                      <img src={item.media_url} alt={item.caption || ''} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-md text-[10px] text-white font-bold uppercase">
                      {item.media_type?.replace('_', ' ')}
                    </div>
                    <a href={item.permalink} target="_blank" rel="noopener noreferrer"
                      className="absolute bottom-2 left-2 px-2 py-0.5 bg-purple-600/80 backdrop-blur-sm rounded-md text-[10px] text-white hover:bg-purple-600">
                      View on IG ↗
                    </a>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-slate-700 dark:text-zinc-300 line-clamp-2 max-w-lg">
                          {item.caption || <span className="italic text-slate-400">No caption</span>}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
                      <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {isReel ? getMetric('plays') : getMetric('impressions')}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                          {isReel ? 'Plays' : 'Impressions'}
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-slate-900 dark:text-white">{getMetric('reach')}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Reach</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {isReel ? getMetric('total_interactions') : getMetric('engagement')}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Engagement</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-slate-900 dark:text-white">{getMetric('saved')}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Saves</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-slate-900 dark:text-white">{getMetric('shares')}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Shares</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-red-500">{item.like_count ?? '-'}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Likes</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-blue-500">{item.comments_count ?? '-'}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Comments</div>
                      </div>
                      {!isReel && (
                        <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 text-center">
                          <div className="text-lg font-bold text-green-500">{getMetric('follows')}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">New Follows</div>
                        </div>
                      )}
                      {!isReel && (
                        <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 text-center">
                          <div className="text-lg font-bold text-slate-900 dark:text-white">{getMetric('profile_visits')}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Profile Visits</div>
                        </div>
                      )}
                      {isReel && (
                        <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                          <div className="text-lg font-bold text-purple-500">{getMetric('ig_reels_avg_watch_time')}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Avg Watch Time</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Integrated Comments for this post */}
                <div className="border-t border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-800/20">
                  <div className="px-5 py-3 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> {postComments.length} Comments & Replies
                    </span>
                  </div>
                  
                  {postComments.length === 0 ? (
                    <div className="px-5 py-4 text-center text-xs text-slate-400">No comments synced for this post.</div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-zinc-800/40">
                      {postComments.map((c: any) => {
                        const name = c.username || 'instagram_user';
                        const initials = name.charAt(0).toUpperCase();
                        const commentReplies = replies?.filter((r: any) => r.comment_id === c.ig_id) || [];
                        return (
                          <div key={c.id} className="px-5 py-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {initials}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                    @{name}
                                  </span>
                                  <span className="text-[10px] text-slate-400">{new Date(c.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-zinc-300 mt-0.5">{c.text}</p>
                                
                                {/* Replies */}
                                {commentReplies.length > 0 && (
                                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-slate-100 dark:border-zinc-800">
                                    {commentReplies.map((r: any) => (
                                      <div key={r.id} className="flex items-start gap-2">
                                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                                          {(r.username || 'i').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 decoration-purple-500/30">
                                              @{r.username || 'instagram_user'}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{new Date(r.timestamp).toLocaleString()}</span>
                                          </div>
                                          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{r.text}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>



    </div>
  );
}

