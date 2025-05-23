import { useState, useEffect } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any; 
  }
}

let isApiLoaded = false;
let apiPromise: Promise<void> | null = null;
const YOUTUBE_IFRAME_API_SRC = 'https://www.youtube.com/iframe_api';

export const useYouTubeIframeApi = (): { isApiReady: boolean; error: Error | null } => {
  const [isApiReady, setIsApiReady] = useState<boolean>(isApiLoaded || (typeof window !== 'undefined' && !!window.YT && !!window.YT.Player));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isApiReady) {
      return;
    }

    if (typeof window === 'undefined') { // Guard against SSR or non-browser environments
        return;
    }

    // If API is already loaded by another instance of the hook or manually
    if (window.YT && window.YT.Player) {
      isApiLoaded = true;
      setIsApiReady(true);
      return;
    }
    
    // Check if the script tag already exists
    const existingScript = document.querySelector(`script[src="${YOUTUBE_IFRAME_API_SRC}"]`);
    if (existingScript && !isApiLoaded) {
      // Script exists, but API might not be ready yet, rely on onYouTubeIframeAPIReady
      // or if it was loaded but our 'isApiLoaded' flag is false
    } else if (!existingScript) {
        const script = document.createElement('script');
        script.src = YOUTUBE_IFRAME_API_SRC;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            console.error("YouTube Iframe API script failed to load.");
            setError(new Error("YouTube Iframe API script failed to load."));
            apiPromise = null; // Reset promise on error
        };
        document.body.appendChild(script);
    }


    if (!apiPromise) {
        apiPromise = new Promise<void>((resolve, reject) => {
            const previousCallback = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (previousCallback) {
                    previousCallback();
                }
                isApiLoaded = true;
                setIsApiReady(true);
                resolve();
            };
            // Timeout for API ready, in case onYouTubeIframeAPIReady is not called
            setTimeout(() => {
                if (!isApiLoaded && window.YT && window.YT.Player) { // Check again if YT became available
                    isApiLoaded = true;
                    setIsApiReady(true);
                    resolve();
                } else if(!isApiLoaded) {
                    console.warn("YouTube Iframe API ready timeout.");
                    // setError(new Error("YouTube Iframe API ready timeout."));
                    // reject(new Error("YouTube Iframe API ready timeout."));
                }
            }, 5000); // 5 seconds timeout
        });
    }
    
    apiPromise.then(() => {
        setIsApiReady(true);
    }).catch(err => {
        if (!error) setError(err); // Set error only if not already set by script.onerror
    });


  }, [isApiReady, error]); // Added error to dependencies

  return { isApiReady, error };
};
