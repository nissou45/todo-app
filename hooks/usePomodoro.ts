import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

interface UsePomodoroReturn {
  timeLeft: number;
  isActive: boolean;
  mode: 'work' | 'break';
  toggleTimer: () => void;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
}

export const usePomodoro = (onComplete: () => void): UsePomodoroReturn => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const modeRef = useRef(mode);
  const onCompleteRef = useRef(onComplete);
  modeRef.current = mode;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = async () => {
    setIsActive(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const currentMode = modeRef.current;
    const nextMode = currentMode === 'work' ? 'break' : 'work';
    const nextTime = nextMode === 'work' ? 25 * 60 : 5 * 60;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: currentMode === 'work' ? 'Travail terminé ! 🍅' : 'Pause terminée ! ☕',
        body: currentMode === 'work' ? 'C\'est l\'heure de la pause.' : 'C\'est l\'heure de se remettre au travail.',
      },
      trigger: null,
    });

    if (currentMode === 'work') {
      onCompleteRef.current();
    }

    setMode(nextMode);
    setTimeLeft(nextTime);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    isActive,
    mode,
    toggleTimer,
    resetTimer,
    formatTime,
  };
};
