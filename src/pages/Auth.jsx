import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DISTRICTS } from '../data'

// ---------------------------------------------------------------------------
// API config
// VITE_API_URL comes from .env (local) or your hosting dashboard (live).
// Trailing slash is stripped so `${API}/api/...` never becomes `//api/...`.
// ---------------------------------------------------------------------------
const API = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '')

// >>> If your Spring Boot login endpoint / body is different, change ONLY these two <<<
const LOGIN_PATH = '/api/members/login'
const loginBody = (identifier, password) => ({ emailOrMobile: identifier, password })

const NETWORK_ERROR = 'Cannot reach the server. Check your internet connection and try again.'

// ---------------------------------------------------------------------------
// Session helper
// The rest of the app (data.js -> currentUser()) reads:
//   nova_users   : JSON array of users, each with { id, name, school, cls, ... }
//   nova_session : the id of the logged-in user (plain string)
// So after register/login we convert the backend member into that shape.
// ---------------------------------------------------------------------------
const toLocalUser = (m) => {
  const interests = Array.isArray(m.areasOfInterest)
    ? m.areasOfInterest
    : String(m.areasOfInterest || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

  let photo = m.profilePhotoUrl || m.profilePhoto || m.photo || ''
  if (photo && !/^(https?:|data:)/i.test(photo)) {
    photo = `${API}/${String(photo).replace(/^\/+/, '')}`
  }

  return {
    id: String(m.memberId ?? m.memberCode ?? m.id ?? m.mobileNumber ?? Date.now()),
    name: m.fullName || '',
    dob: m.dateOfBirth || '',
    gender: m.gender || '',
    mobile: m.mobileNumber || '',
    email: m.email || '',
    district: m.district || '',
    city: m.city || '',
    school: m.schoolCollege || '',
    cls: m.className || '',
    stream: m.stream || '',
    board: m.board || '',
    interests,
    photo,
    active: true,
    createdAt: Date.now()
  }
}

const startSession = (member) => {
  const user = toLocalUser(member)
  try {
    const users = JSON.parse(localStorage.getItem('nova_users') || '[]')
    localStorage.setItem(
      'nova_users',
      JSON.stringify([...users.filter((u) => u.id !== user.id), user])
    )
    localStorage.setItem('nova_session', user.id)
    localStorage.setItem('nova_user', JSON.stringify(member))
  } catch (e) {
    console.warn('Could not save session', e)
  }
}

// Read JSON safely (a 500 / proxy error page is not JSON)
const readJson = async (response) => {
  try {
    return await response.json()
  } catch {
    return {}
  }
}

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------
export function Register() {
  const nav = useNavigate()

  const [f, setF] = useState({
    fullName: '',
    dateOfBirth: '',
    mobileNumber: '',
    email: '',
    city: '',
    schoolCollege: '',
    className: '',
    stream: '',
    board: '',
    areasOfInterest: '',
    password: '',
    gender: '',
    district: '',
    termsAccepted: false,
    profilePhoto: null
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const set = (e) => {
    const { name, value, type, checked, files } = e.target
    setF((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files?.[0] || null : value
    }))
  }

  const go = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('fullName', f.fullName)
      formData.append('dateOfBirth', f.dateOfBirth)
      formData.append('mobileNumber', f.mobileNumber)
      formData.append('email', f.email)
      formData.append('city', f.city)
      formData.append('schoolCollege', f.schoolCollege)
      formData.append('className', f.className)
      formData.append('stream', f.stream)
      formData.append('board', f.board)
      formData.append('areasOfInterest', f.areasOfInterest)
      formData.append('password', f.password)
      formData.append('gender', f.gender)
      formData.append('district', f.district)
      formData.append('termsAccepted', f.termsAccepted ? 'true' : 'false')
      if (f.profilePhoto) formData.append('profilePhoto', f.profilePhoto)

      let response
      try {
        response = await fetch(`${API}/api/members/register`, {
          method: 'POST',
          body: formData
        })
      } catch {
        throw new Error(NETWORK_ERROR)
      }

      const result = await readJson(response)

      if (!response.ok) {
        throw new Error(result?.message || 'Registration failed')
      }

      // Use what the backend returned; fill any gaps from the form the user just filled.
      const { password, profilePhoto, termsAccepted, ...formValues } = f
      startSession({ ...formValues, ...(result?.data || {}) })

      setSuccess('Your NOVA membership has been created successfully!')
      setTimeout(() => nav('/dashboard'), 800)
    } catch (err) {
      setError(err.message || NETWORK_ERROR)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form">
      <h1>Welcome to NOVA.</h1>
      <p>Membership is completely free.</p>

      {error && <p className="err" role="alert">{error}</p>}
      {success && <p className="success" role="status">{success}</p>}

      <form onSubmit={go}>
        <label>
          Full name
          <input required name="fullName" type="text" value={f.fullName} onChange={set} />
        </label>

        <label>
          Date of birth
          <input required name="dateOfBirth" type="date" value={f.dateOfBirth} onChange={set} />
        </label>

        <label>
          Mobile number
          <input required name="mobileNumber" type="tel" value={f.mobileNumber} onChange={set} />
        </label>

        <label>
          Email
          <input required name="email" type="email" value={f.email} onChange={set} />
        </label>

        <label>
          City
          <input required name="city" type="text" value={f.city} onChange={set} />
        </label>

        <label>
          School / College
          <input required name="schoolCollege" type="text" value={f.schoolCollege} onChange={set} />
        </label>

        <label>
          Class
          <input required name="className" type="text" value={f.className} onChange={set} />
        </label>

        <label>
          Stream
          <input required name="stream" type="text" value={f.stream} onChange={set} />
        </label>

        <label>
          Board
          <input required name="board" type="text" value={f.board} onChange={set} />
        </label>

        <label>
          Areas of interest
          <input required name="areasOfInterest" type="text" value={f.areasOfInterest} onChange={set} />
        </label>

        <label>
          Password
          <input required name="password" type="password" value={f.password} onChange={set} />
        </label>

        <label>
          Gender
          <select required name="gender" value={f.gender} onChange={set}>
            <option value="">Select</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          District
          <select required name="district" value={f.district} onChange={set}>
            <option value="">Select (Maharashtra)</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label>
          Profile photo
          <input type="file" name="profilePhoto" accept="image/*" onChange={set} />
        </label>

        <label className="chk">
          <input
            type="checkbox"
            name="termsAccepted"
            required
            checked={f.termsAccepted}
            onChange={set}
          />
          I agree to the Project NOVA community guidelines and terms.
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Creating membership...' : 'Create my NOVA membership'}
        </button>
      </form>

      <Link to="/login">Already a member? Log in</Link>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export function Login() {
  const nav = useNavigate()

  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const go = async (e) => {
    e.preventDefault()

    // Read the form BEFORE any await (e.currentTarget is null afterwards)
    const data = new FormData(e.currentTarget)
    const identifier = String(data.get('id') || '').trim()
    const password = String(data.get('pw') || '')

    setErr('')
    setLoading(true)

    try {
      let response
      try {
        response = await fetch(`${API}${LOGIN_PATH}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginBody(identifier, password))
        })
      } catch {
        throw new Error(NETWORK_ERROR)
      }

      const result = await readJson(response)

      if (!response.ok) {
        throw new Error(result?.message || 'Login failed. Check your mobile/email and password.')
      }

      const member = result?.data
      if (!member) {
        throw new Error('Login worked, but the server sent no member details.')
      }

      startSession(member)
      nav('/dashboard')
    } catch (error) {
      setErr(error.message || NETWORK_ERROR)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form">
      <h1>Welcome back.</h1>

      <form onSubmit={go}>
        <label>
          Mobile / Email
          <input name="id" required autoComplete="username" />
        </label>

        <label>
          Password
          <input name="pw" type="password" required autoComplete="current-password" />
        </label>

        {err && <p className="err" role="alert">{err}</p>}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          setErr(
            'Password reset needs a backend (email/SMS). Add Supabase or Firebase to enable it.'
          )
        }}
      >
        Forgot password
      </a>
      {' · '}
      <Link to="/register">New to NOVA? Join free</Link>
    </div>
  )
}