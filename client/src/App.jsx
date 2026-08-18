import React, { useEffect, useRef, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AuthLayout, GuestLayout } from './pages/Layout'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import BuilderPage from './pages/BuilderPage'
import PreviewPage from './pages/PreviewPage'
import { Toaster } from 'react-hot-toast'
import PublishPage from './pages/PublishPage'
import SplashScreen from './components/SplashScreen'
import { useAppContext } from './context/AppContext'
import ProfilePage from './pages/ProfilePage'

const MIN_SPLASH_MS = 1400;

const App = () => {
  const { loadingUser } = useAppContext();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [phase, setPhase] = useState('splash'); // 'splash' | 'fading' | 'done'
  const hasStartedFading = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loadingUser && minTimeElapsed && !hasStartedFading.current) {
      hasStartedFading.current = true;
      setPhase('fading');
      const timer = setTimeout(() => setPhase('done'), 300);
      return () => clearTimeout(timer);
    }
  }, [loadingUser, minTimeElapsed]);

  if (phase !== 'done') {
    return (
      <>
        <Toaster />
        <SplashScreen fading={phase === 'fading'} />
      </>
    )
  }

  return (
    <>
    <Toaster />
    <Routes>
      {/* Login Roputes*/}
      <Route element = {<GuestLayout />}>
        <Route path='/login' element={<AuthPage  mode="login"/>} />
        <Route path='/register' element={<AuthPage  mode="register"/>} />
      </Route>
      
      {/*pROTECTED ROUTES*/}
      <Route element = {<AuthLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/builder/:id' element={<BuilderPage/>} />
        <Route path='/preview/:id' element={<PreviewPage/>} />
      </Route>

      {/*Public Routes */}
      <Route path='/publish/:id' element={<PublishPage />}/>
      

      {/* Catch - all */}

      <Route path='*' element={ <Navigate to="/" replace /> } />
    </Routes>

    </>
    
  )
}

export default App