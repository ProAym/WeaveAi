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
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('VITE_GOOGLE_CLIENT_ID is missing in environment variables');
      return;
    }

    loadGoogleScript().then(() => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            await loginWithGoogle(response.credential);
          } catch (err) {
            console.error("Google Auth failed inside component:", err);
          }
        },
      });

      if (googleBtnRef.current) {
        googleBtnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: 280,
        });
      }
    });
  }, [loginWithGoogle]);

  return (
    <div className="flex justify-center items-center my-2">
      {/* Visible container for the Google Identity SDK button */}
      <div ref={googleBtnRef} />
    </div>
  );
};

export default GoogleSignInButton;
