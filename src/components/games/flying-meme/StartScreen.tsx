import Link from 'next/link';
import { ThemeType } from './types';
import ThemeSelector from './ThemeSelector';
import CustomThemeUpload from './CustomThemeUpload';

interface StartScreenProps {
  score: number;
  selectedTheme: ThemeType;
  onSelectTheme: (theme: 'bachan' | 'gandi' | 'custom') => void;
  onStartGame: () => void;
  onChangeTheme: () => void;
  onClearCache: () => void;
  customBirdImage: string | null;
  customSound: string | null;
  showCustomUpload: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSoundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayPreview: () => void;
  onConfirmCustomTheme: () => void;
  onCancelCustomUpload: () => void;
  isRecording: boolean;
}

export default function StartScreen({
  score,
  selectedTheme,
  onSelectTheme,
  onStartGame,
  onChangeTheme,
  onClearCache,
  customBirdImage,
  customSound,
  showCustomUpload,
  onImageUpload,
  onSoundUpload,
  onStartRecording,
  onStopRecording,
  onPlayPreview,
  onConfirmCustomTheme,
  onCancelCustomUpload,
  isRecording
}: StartScreenProps) {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <header className="fixed top-0 w-full z-40 bg-black/30 backdrop-blur-md border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/games" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Memerverse</Link>
          <Link href="/games" className="text-purple-400 hover:text-pink-400 transition">← Back to Games</Link>
        </nav>
      </header>

      <div className="relative pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Flying Meme 🐦</h1>
    
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-6">Score: <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">{score}</span></h2>
        
              <div>
                {!selectedTheme ? (
                  <ThemeSelector
                    onSelectTheme={onSelectTheme}
                    onClearCache={onClearCache}
                    hasCustomCache={!!(customBirdImage || customSound)}
                  />
                ) : (
                  <div>
                    <p className="text-neutral-300 mb-2">Theme: <span className="font-bold text-white">{selectedTheme === 'bachan' ? 'Bachan' : selectedTheme === 'gandi' ? 'Gandhi' : 'Custom'}</span></p>
                    <p className="text-neutral-300 mb-4">Press SPACE or Click to fly! Avoid the obstacles!</p>
                    <button
                      onClick={onStartGame}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:opacity-90 mr-3 shadow-lg font-semibold"
                    >
                      Start Game (Fullscreen)
                    </button>
                    <button
                      onClick={onChangeTheme}
                      className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/20"
                    >
                      Change Theme
                    </button>
                  </div>
                )}
              </div>

              {showCustomUpload && (
                <CustomThemeUpload
                  onConfirm={onConfirmCustomTheme}
                  onCancel={onCancelCustomUpload}
                  customBirdImage={customBirdImage}
                  customSound={customSound}
                  onImageUpload={onImageUpload}
                  onSoundUpload={onSoundUpload}
                  onStartRecording={onStartRecording}
                  onStopRecording={onStopRecording}
                  onPlayPreview={onPlayPreview}
                  isRecording={isRecording}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
