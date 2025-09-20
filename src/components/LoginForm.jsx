import { useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

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
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm