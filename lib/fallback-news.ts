import { NewsArticle } from './newsapi';

// Fallback news data for when API is rate limited
export const fallbackNews = {
  topStories: [
    {
      id: 'fallback-1',
      title: 'Daily Pulse - Your Trusted News Source',
      description: 'We\'re currently experiencing high traffic. Our news content will refresh automatically when available.',
      content: 'Thank you for visiting Daily Pulse. Due to high demand, we\'re temporarily showing cached content.',
      author: 'Daily Pulse Team',
      publishedAt: new Date().toISOString(),
      urlToImage: '/placeholder-news.svg',
      url: '#',
      source: {
        id: 'daily-pulse',
        name: 'Daily Pulse'
      },
      category: 'General',
      featured: true
    }
  ] as NewsArticle[],
  
  politics: [
    {
      id: 'fallback-politics-1',
      title: 'Political News Updates Coming Soon',
      description: 'Our political coverage will resume shortly. We appreciate your patience.',
      content: 'Daily Pulse provides comprehensive political news coverage.',
      author: 'Political Desk',
      publishedAt: new Date().toISOString(),
      urlToImage: '/placeholder-small.svg',
      url: '#',
      source: {
        id: 'daily-pulse',
        name: 'Daily Pulse'
      },
      category: 'Politics',
      featured: true
    }
  ] as NewsArticle[],
  
  justice: [
    {
      id: 'fallback-justice-1',
      title: 'Justice Coverage Temporarily Unavailable',
      description: 'Our justice and legal news will be back online shortly.',
      content: 'Daily Pulse covers important legal developments and court proceedings.',
      author: 'Legal Correspondent',
      publishedAt: new Date().toISOString(),
      urlToImage: '/placeholder-small.svg',
      url: '#',
      source: {
        id: 'daily-pulse',
        name: 'Daily Pulse'
      },
      category: 'Justice',
      featured: true
    }
  ] as NewsArticle[],
  
  nationalSecurity: [
    {
      id: 'fallback-security-1',
      title: 'National Security Updates Refreshing',
      description: 'Security and defense news content is being updated.',
      content: 'Stay informed about national security developments with Daily Pulse.',
      author: 'Security Analyst',
      publishedAt: new Date().toISOString(),
      urlToImage: '/placeholder-small.svg',
      url: '#',
      source: {
        id: 'daily-pulse',
        name: 'Daily Pulse'
      },
      category: 'National Security',
      featured: true
    }
  ] as NewsArticle[],
  
  technology: [
    {
      id: 'fallback-tech-1',
      title: 'Technology News Refreshing',
      description: 'Tech coverage will resume momentarily. Thank you for your patience.',
      content: 'Daily Pulse brings you the latest in technology and innovation.',
      author: 'Tech Reporter',
      publishedAt: new Date().toISOString(),
      urlToImage: '/placeholder-small.svg',
      url: '#',
      source: {
        id: 'daily-pulse',
        name: 'Daily Pulse'
      },
      category: 'Technology',
      featured: true
    }
  ] as NewsArticle[],
  
  environment: [
    {
      id: 'fallback-env-1',
      title: 'Environmental News Loading',
      description: 'Climate and environmental coverage is being refreshed.',
      content: 'Environmental news and climate updates from Daily Pulse.',
      author: 'Environmental Correspondent',
      publishedAt: new Date().toISOString(),
      urlToImage: '/placeholder-small.svg',
      url: '#',
      source: {
        id: 'daily-pulse',
        name: 'Daily Pulse'
      },
      category: 'Environment',
      featured: true
    }
  ] as NewsArticle[],
  
  world: [
    {
      id: 'fallback-world-1',
      title: 'International News Updating',
      description: 'Global news coverage will return shortly.',
      content: 'Stay connected to world events with Daily Pulse international coverage.',
      author: 'International Desk',
      publishedAt: new Date().toISOString(),
      urlToImage: '/placeholder-small.svg',
      url: '#',
      source: {
        id: 'daily-pulse',
        name: 'Daily Pulse'
      },
      category: 'World',
      featured: true
    }
  ] as NewsArticle[]
}; 