export const playSound = (soundName: string) => {
  const audio = new Audio(`/assets/sounds/${soundName}.mp3`);
  audio.play().catch((error) => console.error("Error playing sound:", error));
};

export const playLoopedSound = (soundName: string, interval: number) => {
  const audio = new Audio(`/assets/sounds/${soundName}.mp3`);
  audio.loop = true;

  const playSound = () => {
    audio.currentTime = 0;
    audio.play().catch((error) => console.error("Error playing sound:", error));
  };

  playSound();
  const intervalId = setInterval(playSound, interval);

  return () => {
    clearInterval(intervalId);
    audio.pause();
    audio.currentTime = 0;
  };
};
