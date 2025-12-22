import { useRef, useState } from 'react';

interface CustomThemeUploadProps {
  onConfirm: () => void;
  onCancel: () => void;
  customBirdImage: string | null;
  customSound: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSoundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayPreview: () => void;
  isRecording: boolean;
}

export default function CustomThemeUpload({
  onConfirm,
  onCancel,
  customBirdImage,
  customSound,
  onImageUpload,
  onSoundUpload,
  onStartRecording,
  onStopRecording,
  onPlayPreview,
  isRecording
}: CustomThemeUploadProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Custom Theme Setup</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Upload Bird Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
          />
          {customBirdImage && <p className="text-green-400 text-sm mt-2">✓ Image uploaded</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Sound (Game Over)</label>
          <input
            type="file"
            accept="audio/*"
            onChange={onSoundUpload}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white mb-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
          />
          <div className="flex gap-2">
            <button
              onClick={isRecording ? onStopRecording : onStartRecording}
              className={`flex-1 ${isRecording ? 'bg-red-600' : 'bg-blue-600'} text-white px-4 py-2 rounded-lg hover:opacity-90 font-semibold shadow-lg`}
            >
              {isRecording ? '⏹ Stop Recording' : '🎤 Record'}
            </button>
            {customSound && (
              <button
                onClick={onPlayPreview}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold shadow-lg"
              >
                ▶ Preview
              </button>
            )}
          </div>
          {customSound && <p className="text-green-400 text-sm mt-2">✓ Sound ready</p>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={!customBirdImage || !customSound}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
          >
            Confirm & Start
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl hover:bg-white/20 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
