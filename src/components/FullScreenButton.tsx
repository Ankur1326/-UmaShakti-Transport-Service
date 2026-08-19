import React, { useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';

// Extend the `Document` and `HTMLElement` interfaces to include vendor-prefixed fullscreen methods
interface FullScreenDocument extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface FullScreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

const FullScreenButton: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const handleFullScreenToggle = (): void => {
    const documentElement = document.documentElement as FullScreenElement;
    const fullScreenDoc = document as FullScreenDocument;

    if (!isFullScreen) {
      // Enter full-screen mode
      if (documentElement.requestFullscreen) {
        documentElement.requestFullscreen();
      } else if (documentElement.webkitRequestFullscreen) { // Safari support
        documentElement.webkitRequestFullscreen();
      } else if (documentElement.mozRequestFullScreen) { // Firefox support
        documentElement.mozRequestFullScreen();
      } else if (documentElement.msRequestFullscreen) { // IE11 support
        documentElement.msRequestFullscreen();
      }
    } else {
      // Exit full-screen mode
      if (fullScreenDoc.exitFullscreen) {
        fullScreenDoc.exitFullscreen();
      } else if (fullScreenDoc.webkitExitFullscreen) { // Safari support
        fullScreenDoc.webkitExitFullscreen();
      } else if (fullScreenDoc.mozCancelFullScreen) { // Firefox support
        fullScreenDoc.mozCancelFullScreen();
      } else if (fullScreenDoc.msExitFullscreen) { // IE11 support
        fullScreenDoc.msExitFullscreen();
      }
    }

    setIsFullScreen(!isFullScreen); // Toggle full-screen state
  };

  return (
    <button
      onClick={handleFullScreenToggle}
      aria-label="Toggle Full Screen"
      className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {isFullScreen ? (
        <Minimize className="w-4 h-4 text-[#66B788] dark:text-[#66B788]" />
      ) : (
        <Maximize className="w-4 h-4 text-[#66B788] dark:text-[#66B788]" />
      )}
    </button>
  );
};

export default FullScreenButton;
