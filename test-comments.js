const { INSTAGRAM_ACCESS_TOKEN } = process.env;
const META_API_VERSION = 'v25.0';

async function test() {
  const mediaId = '17879111580551905';
  let url = `https://graph.instagram.com/${META_API_VERSION}/${mediaId}/comments?fields=id,text,timestamp,like_count,from,user,replies{id,text,timestamp,from,user}`;
  
  const res = await fetch(url, { headers: { 'Authorization': `Bearer ${INSTAGRAM_ACCESS_TOKEN}` } });
  const data = await res.json();
  console.log(JSON.stringify(data.data ? data.data.slice(0,2) : data, null, 2));
}
test().catch(console.error);
