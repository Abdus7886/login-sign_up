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
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      console.log('Logged in successfully:', userCredential.user)
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
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Google sign in successful:', result.user);
          } catch (err) {
            setError(err.message);
            console.error('Google sign in error:', err);
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