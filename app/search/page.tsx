'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchNews } from '@/lib/news-service';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface Article {
  title: string;
  description: string;
  link?: string;
  image: string;
  category: string;
  pubDate: string;
  author?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function performSearch() {
      // Clear results first
      setSearchResults([]);
      
      if (!query || query.trim().length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await searchNews(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {/* Hero Section */}
      {/* <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8"> */}
            {/* <Link href="/">
              <Button 
                variant="ghost" 
                className="mb-6 text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
                <SearchIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Search Results
            </h1> */}
            
            {/* Only show results count when there are actual results */}
            {/* {!loading && query && searchResults.length > 0 && (
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-white/90 text-lg">
                  Found <span className="font-bold text-purple-300">{searchResults.length}</span> results for "<span className="font-bold text-purple-300">{query}</span>"
                </div>
              </div>
            )}
          </div>
        </div>
      </section> */}

      {/* Results Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          {loading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
              <div className="text-white/70 text-lg">Searching through articles...</div>
            </div>
          ) : query && searchResults.length > 0 ? (
            // Results found
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((article, index) => (
                <article 
                  key={index} 
                  className="group bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image || '/placeholder-image.jpg'}
                      alt={article.title || 'News article'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium shadow-lg">
                        {article.category || 'News'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors leading-tight">
                      {article.title || 'Untitled Article'}
                    </h2>
                    <div className="text-white/70 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {article.description || 'No description available.'}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <time>
                          {article.pubDate ? new Date(article.pubDate).toLocaleDateString() : 'Unknown date'}
                        </time>
                      </div>
                      {article.author && (
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-24">{article.author}</span>
                        </div>
                      )}
                    </div>
                    
                    {article.link ? (
                      <Link
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                      >
                        Read Full Article →
                      </Link>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 text-white/50 text-sm font-medium cursor-not-allowed">
                        Article link unavailable
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : query ? (
            // No results found for query
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="p-6 rounded-full bg-white/5 border border-white/20 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-12 h-12 text-white/50" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Results Found</h3>
                <div className="text-white/70 text-lg mb-2">
                  We couldn't find any articles matching "<span className="font-semibold text-purple-300">{query}</span>"
                </div>
                <div className="text-white/50 mb-8">Try searching with different keywords or check your spelling</div>
                
                <div>
                  <h4 className="text-white font-semibold mb-3">Search suggestions:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Technology', 'Business', 'Sports', 'World News', 'Science'].map((suggestion) => (
                      <Link
                        key={suggestion}
                        href={`/search?q=${encodeURIComponent(suggestion)}`}
                        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm border border-white/20 hover:border-white/30 transition-all duration-300"
                      >
                        {suggestion}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // No search query - Clean welcome state
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="p-6 rounded-full bg-white/5 border border-white/20 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-12 h-12 text-white/50" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Search</h3>
                <div className="text-white/70 text-lg mb-8">
                  Use the search bar above to find news articles from our sources
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-3">Popular topics:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Technology', 'Business', 'Sports', 'World News', 'Science'].map((suggestion) => (
                      <Link
                        key={suggestion}
                        href={`/search?q=${encodeURIComponent(suggestion)}`}
                        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm border border-white/20 hover:border-white/30 transition-all duration-300"
                      >
                        {suggestion}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 