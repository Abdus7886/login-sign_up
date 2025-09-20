import { useState } from 'react'
import { auth, googleProvider } from '../firebase'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      // Auth state listener in App.jsx will handle the redirect
    } catch (err) {
      setError(err.message)
      console.error('Login error:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <button type="submit" className="login-button">Login</button>
      <div className="divider">
        <span>or</span>
      </div>
      <button 
        type="button" 
        className="google-button"
        onClick={async () => {
          try {
            setError(''); // Clear any existing errors
            console.log('Attempting Google sign in...');
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Google sign in successful:', result.user);
            // You can add a success message or redirect here
            alert('Successfully signed in with Google!');
          } catch (err) {
            console.error('Google sign in error:', err);
            // More user-friendly error messages
            if (err.code === 'auth/popup-blocked') {
              setError('Please allow popups for Google sign-in to work');
            } else if (err.code === 'auth/cancelled-popup-request') {
              setError('Sign-in was cancelled');
            } else {
              setError(err.message);
            }
          }
        }}
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
        Continue with Google
      </button>
    </form>
  )
}

export default LoginForm