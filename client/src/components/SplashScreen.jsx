import React from 'react'

const SplashScreen = ({ fading = false }) => {
    return (
        <div className={`fixed inset-0 z-50 bg-zinc-950 flex items-center justify-center transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}>
            <div className="flex items-center gap-1.5">
                <svg viewBox="7 13 86 62" className="h-14 animate-draw-logo">
                    <defs>
                        <linearGradient id="splash-g" x1="10" y1="20" x2="90" y2="20" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#fb923c" />
                            <stop offset="50%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 16,26 C 23,66 33,66 40,38 C 44,22 56,22 60,38 C 67,66 77,66 84,26"
                        fill="none"
                        stroke="url(#splash-g)"
                        strokeWidth="18"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength="1"
                        className="draw-path"
                    />
                </svg>
                <span className="text-4xl font-black tracking-tight text-white animate-fade-in-delayed">eave</span>
            </div>
        </div>
    )
}

export default SplashScreen