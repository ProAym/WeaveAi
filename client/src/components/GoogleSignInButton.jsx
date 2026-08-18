import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

let googleScriptPromise = null;

function loadGoogleScript() {
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return googleScriptPromise;
}

const GoogleSignInButton = () => {
  const { loginWithGoogle } = useAppContext();
  const hiddenBtnRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('VITE_GOOGLE_CLIENT_ID is missing in your .env file');
      return;
    }

    loadGoogleScript().then(() => {
      if (!window.google?.accounts?.id) return;

      // Initialize Google Identity SDK
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            await loginWithGoogle(response.credential);
          } catch (err) {
            // Handled inside AppContext
          }
        },
      });

      // Render button in a hidden element to establish the trigger
      if (hiddenBtnRef.current) {
        hiddenBtnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(hiddenBtnRef.current, {
          type: 'icon',
          shape: 'circle',
        });
      }
    });
  }, [loginWithGoogle]);

  const handleGoogleSignIn = () => {
    // Try triggering the rendered Google button programmatically
    const renderedButton = hiddenBtnRef.current?.querySelector('[role="button"]');
    if (renderedButton) {
      renderedButton.click();
    } else if (window.google?.accounts?.id) {
      // Fallback: trigger One Tap / Prompt standard popup
      window.google.accounts.id.prompt();
    }
  };

  return (
    <div className="flex justify-center items-center my-2">
      {/* Custom Circular White Button with Official Google SVG Logo */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center transition-all
         duration-200 shadow-md hover:shadow-lg active:scale-95 focus:outline-none cursor-pointer"
        title="Sign in with Google"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      </button>

      {/* Hidden container required by Google SDK */}
      <div ref={hiddenBtnRef} className="hidden" />
    </div>
  );
};

export default GoogleSignInButton;