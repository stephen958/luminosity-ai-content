// _worker.js
// Cloudflare Pages Worker for AI Bot Detection and Routing
// Place this file in the root of your repository

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('User-Agent') || '';
    
    // Comprehensive list of AI bot user agents
    const aiBotPatterns = [
      // OpenAI
      'GPTBot',
      'ChatGPT-User',
      'OAI-SearchBot',
      
      // Anthropic
      'ClaudeBot',
      'Claude-Web',
      'anthropic-ai',
      
      // Google AI
      'Google-Extended',
      'GoogleOther',
      'Gemini',
      
      // Common Crawl (used by many AI companies)
      'CCBot',
      
      // Perplexity
      'PerplexityBot',
      
      // Other major AI platforms
      'Amazonbot',
      'cohere-ai',
      'Omgilibot',
      'FacebookBot',
      'Applebot-Extended',
      'YouBot',
      'Bytespider',
      'Diffbot',
      'Meta-ExternalAgent',
      'ImagesiftBot',
      'AISearch',
      'ai2bot',
      'Seekr',
      'PetalBot',
      'Scrapy',
      'anthropic',
      
      // Research/Academic bots
      'AwarioRssBot',
      'AwarioSmartBot',
      'DataForSeoBot',
      
      // Generic AI identifiers
      'AI2Bot',
      'AdsBot-Google',
    ];
    
    // Check if the user agent matches any AI bot pattern
    const isAIBot = aiBotPatterns.some(pattern => 
      userAgent.includes(pattern)
    );
    
    // Log bot visits for analytics (visible in Cloudflare dashboard)
    if (isAIBot) {
      console.log(`AI Bot detected: ${userAgent}`);
    }
    
    // Route based on detection
    if (isAIBot) {
      // Serve AI-optimized content to bots
      const aiOptimizedUrl = new URL(request.url);
      aiOptimizedUrl.pathname = '/ai-optimized.html';
      
      const response = await env.ASSETS.fetch(aiOptimizedUrl);
      
      // Add custom headers for tracking
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('X-Served-To', 'AI-Bot');
      newResponse.headers.set('X-Bot-Type', userAgent.substring(0, 50));
      newResponse.headers.set('Cache-Control', 'public, max-age=3600');
      
      return newResponse;
    } else {
      // Redirect human visitors to main website
      return Response.redirect('https://www.ai-luminosity.com' + url.pathname, 302);
    }
  }
};