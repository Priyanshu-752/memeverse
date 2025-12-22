import { ThemeType } from './types';

interface ThemeSelectorProps {
  onSelectTheme: (theme: 'bachan' | 'gandi' | 'custom') => void;
  onClearCache: () => void;
  hasCustomCache: boolean;
}

export default function ThemeSelector({ onSelectTheme, onClearCache, hasCustomCache }: ThemeSelectorProps) {
  return (
    <div>
      <p className="text-neutral-300 mb-6 text-lg">Select Your Theme:</p>
      <div className="flex gap-4 justify-center flex-wrap">
        <button
          onClick={() => onSelectTheme('bachan')}
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-xl hover:opacity-90 text-xl font-bold shadow-lg"
        >
          Bachan Theme
        </button>
        <button
          onClick={() => onSelectTheme('gandi')}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:opacity-90 text-xl font-bold shadow-lg"
        >
          Gandhi Theme
        </button>
        <button
          onClick={() => onSelectTheme('custom')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:opacity-90 text-xl font-bold shadow-lg"
        >
          Custom Theme
        </button>
      </div>
      {hasCustomCache && (
        <button
          onClick={onClearCache}
          className="mt-4 bg-red-500/80 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm border border-red-400/50"
        >
          Clear Custom Cache
        </button>
      )}
    </div>
  );
}
