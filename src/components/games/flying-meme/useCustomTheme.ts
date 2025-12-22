import { useState, useRef, useEffect } from 'react';

export function useCustomTheme() {
  const [customBirdImage, setCustomBirdImage] = useState<string | null>(null);
  const [customSound, setCustomSound] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const cachedImage = localStorage.getItem('customBirdImage');
    const cachedSound = localStorage.getItem('customSound');
    if (cachedImage) setCustomBirdImage(cachedImage);
    if (cachedSound) setCustomSound(cachedSound);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCustomBirdImage(dataUrl);
        localStorage.setItem('customBirdImage', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCustomSound(dataUrl);
        localStorage.setItem('customSound', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setCustomSound(dataUrl);
          localStorage.setItem('customSound', dataUrl);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording failed:', err);
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playPreview = () => {
    if (customSound) {
      const audio = new Audio(customSound);
      audio.play();
    }
  };

  const clearCache = () => {
    localStorage.removeItem('customBirdImage');
    localStorage.removeItem('customSound');
    setCustomBirdImage(null);
    setCustomSound(null);
  };

  return {
    customBirdImage,
    customSound,
    isRecording,
    handleImageUpload,
    handleSoundUpload,
    startRecording,
    stopRecording,
    playPreview,
    clearCache
  };
}
