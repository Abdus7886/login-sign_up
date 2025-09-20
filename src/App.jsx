import { useState, useEffect } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Dashboard from './components/Dashboard'
import Silk from './components/Silk'
import { auth } from './firebase'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user)
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  return (
    <div className="container">
      {isAuthenticated ? (
        <Dashboard onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <>
          <div className="background-wrapper">
            <Silk color="#667eea" speed={3} scale={1.5} noiseIntensity={1.2} rotation={0.2} />
          </div>
          <div className="form-container">
            <div className="form-header">
              <h1>{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
              <p>{isLogin ? 'Please sign in to continue' : 'Get started with your free account'}</p>
            </div>
            <div className="form-tabs">
              <button 
                className={isLogin ? 'active' : ''} 
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button 
                className={!isLogin ? 'active' : ''} 
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>
            {isLogin ? <LoginForm /> : <SignupForm />}
          </div>
        </>
      )}
    </div>
  )
}

export default App
