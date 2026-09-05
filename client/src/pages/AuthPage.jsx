import React, { useState } from 'react'
import LoginLeft from '../components/LoginLeft'
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOffIcon, Loader2Icon, MailIcon, LockIcon, UserIcon, SparklesIcon, ArrowRightIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import GoogleSignInButton from '../components/GoogleSignInButton';


const AuthPage = ({ mode }) => {
  const { login, register } = useAppContext()
  const navigate = useNavigate();

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message || (mode === "login" ? "Invalid email or password" : "Registration failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Left Panel - Branding */}
      <LoginLeft />

      {/* Right Panel - Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Ambient AI Background Mesh Gradients */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 p-8 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none z-10 transition-colors duration-200">
          
          {/* Mobile-only Brand Header — desktop shows LoginLeft instead */}
          <div className="lg:hidden flex items-center justify-center gap-1 mb-6">
            <img src="/weave_logo_mark.svg" alt="Weave" className="h-7 -mr-1" />
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">eave</span>
          </div>

          {/* Header Badge & Title */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 mb-3">
              <SparklesIcon size={12} className="text-amber-500 dark:text-amber-400" />
              <span>BuilderAI Platform</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
              {isLogin ? "Enter your credentials to access your workspace." : "Start building AI-powered web applications in seconds."}
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mb-6 p-3.5 border border-red-200/80 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium animate-fade-in flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <UserIcon size={16} className="absolute left-3.5 text-zinc-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-150"
                    placeholder="John Smith"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                E-mail Address
              </label>
              <div className="relative flex items-center">
                <MailIcon size={16} className="absolute left-3.5 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-150"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <LockIcon size={16} className="absolute left-3.5 text-zinc-400 dark:text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-150"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer transition-colors p-1"
                >
                  {showPassword ? <EyeOffIcon size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-sm font-semibold rounded-xl shadow-md shadow-amber-600/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
            >
              {loading ? (
                <Loader2Icon size={16} className="animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? "Sign in to Workspace" : "Create Workspace Account"}</span>
                  <ArrowRightIcon size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Google Sign In */}
          <GoogleSignInButton />

          {/* Switch Mode Footer */}
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-center text-xs text-zinc-500 dark:text-zinc-400">
            {isLogin ? (
              <>
                New to BuilderAI?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Sign in here
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default AuthPage
