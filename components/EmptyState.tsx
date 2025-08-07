'use client';

import { Search, Film, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  description?: string;
}

export function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgba(30,30,45,0.6)] to-[rgba(30,30,45,0.8)] flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-ping opacity-60"></div>
        <Search className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3 text-center">
        {message}
      </h3>
      
      {description && (
        <p className="text-gray-400 max-w-md text-center leading-relaxed">
          {description}
        </p>
      )}
      
      <div className="mt-8 px-6 py-4 rounded-xl bg-[rgba(30,30,45,0.4)] border border-white/5 max-w-md">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-gray-200 mb-1">Search Tips</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
              <li>Check the spelling of your search terms</li>
              <li>Try using fewer or different keywords</li>
              <li>Adjust your filters to broaden your search</li>
              <li>Search for a movie title, actor, or director</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}