
import React from 'react';

interface PaperAirplaneIconProps {
  className?: string;
}

const PaperAirplaneIcon: React.FC<PaperAirplaneIconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
    // Solid version for a more button-like feel if preferred:
    // fill="currentColor" 
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      // d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" // Original paper airplane
      d="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12Zm0 0h7.5" // More like a send icon
    />
  </svg>
);

export default PaperAirplaneIcon;
