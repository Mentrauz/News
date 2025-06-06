export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Daily Pulse Logo */}
        <div className="mb-6">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight font-serif text-white">
            <span className="block">Daily</span>
            <span className="block mt-2">Pulse</span>
          </h1>
        </div>
        
        {/* Loading text */}
        <div className="text-white text-lg font-light tracking-wide">
          Loading...
        </div>
        
        {/* Loading animation dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
} 