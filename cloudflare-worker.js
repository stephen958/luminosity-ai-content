// Cloudflare Worker to detect AI bots and serve optimized content
// Deploy this to Cloudflare Workers and route it to ai-luminosity.com

const AI_BOT_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'Google-Extended',
  'GoogleOther',
  'anthropic-ai',
  'Claude-Web',
  'ClaudeBot',
  'cohere-ai',
  'PerplexityBot',
  'Omgilibot',
  'FacebookBot',
  'Applebot-Extended',
  'Bytespider',
  'ImagesiftBot',
  'Diffbot',
  'meta-externalagent',
  'OAI-SearchBot'
];

// GitHub Pages URLs for your LLM-optimized content
const GITHUB_PAGES_BASE = 'https://YOUR-USERNAME.github.io/ai-luminosity-llm';

// Map of routes to LLM-optimized pages
const LLM_ROUTES = {
  '/': '/index.html',
  '/services': '/services.html',
  '/questionsandanswers': '/questionsandanswers.html'
};

async function handleRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('User-Agent') || '';
  
  // Check if request is from an AI bot
  const isAIBot = AI_BOT_USER_AGENTS.some(bot => 
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
  
  // If AI bot, serve LLM-optimized content from GitHub Pages
  if (isAIBot) {
    const llmPath = LLM_ROUTES[url.pathname] || LLM_ROUTES['/'];
    const llmUrl = GITHUB_PAGES_BASE + llmPath;
    
    try {
      // Fetch LLM-optimized content
      const response = await fetch(llmUrl);
      
      // Create new response with original domain in headers
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          'X-Served-By': 'Cloudflare-Worker-LLM-Optimized',
          'X-Original-Domain': url.hostname,
          'X-Robots-Tag': 'noindex, follow',
          'Link': `<https://www.ai-luminosity.com${url.pathname}>; rel="canonical"`
        }
      });
    } catch (error) {
      // If GitHub Pages fetch fails, fall through to origin
      console.error('Error fetching LLM content:', error);
    }
  }
  
  // For human users or if LLM fetch failed, serve original site
  return fetch(request);
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});