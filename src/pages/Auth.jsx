import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DISTRICTS, ls } from '../data'

const F = (l, n, t = 'text') => ({ l, n, t })

const fields = [
  F('Full name', 'name'),
  F('Date of birth', 'dob', 'date'),
  F('Mobile number', 'mobile', 'tel'),
  F('Email', 'email', 'email'),
  F('City', 'city'),
  F('School / College', 'school'),
  F('Class', 'cls'),
  F('Stream', 'stream'),
  F('Board', 'board'),
  F('Areas of interest', 'interest'),
  F('Password', 'password', 'password')
]

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

    setF(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'file'
            ? files?.[0] || null
            : value
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
      formData.append(
        'termsAccepted',
        f.termsAccepted ? 'true' : 'false'
      )

      if (f.profilePhoto) {
        formData.append('profilePhoto', f.profilePhoto)
      }

      // DEBUG
      console.log('========== NOVA FORM DATA ==========')

      for (const [key, value] of formData.entries()) {
        console.log(
          key,
          value instanceof File
            ? value.name
            : value
        )
      }

      console.log('====================================')

      const apiUrl =
        import.meta.env.VITE_API_URL ||
        'http://localhost:8080'

      const response = await fetch(
        `${apiUrl}/api/members/register`,
        {
          method: 'POST',
          body: formData
        }
      )

      const result = await response.json()

      console.log('Backend response:', result)

      if (!response.ok) {
        throw new Error(
          result?.message ||
          'Registration failed'
        )
      }

      const member = result?.data

      if (member) {
        localStorage.setItem(
          'nova_user',
          JSON.stringify(member)
        )
      }

      localStorage.setItem(
        'nova_session',
        '1'
      )

      setSuccess(
        'Your NOVA membership has been created successfully!'
      )

      setTimeout(() => {
        nav('/dashboard')
      }, 800)

    } catch (err) {
      console.error(
        'Registration error:',
        err
      )

      setError(
        err.message ||
        'Unable to connect to server.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form">

      <h1>Welcome to NOVA.</h1>

      <p>Membership is completely free.</p>

      {error && (
        <p className="err">
          {error}
        </p>
      )}

      {success && (
        <p className="success">
          {success}
        </p>
      )}

      <form onSubmit={go}>

        <label>
          Full name
          <input
            required
            name="fullName"
            type="text"
            value={f.fullName}
            onChange={set}
          />
        </label>

        <label>
          Date of birth
          <input
            required
            name="dateOfBirth"
            type="date"
            value={f.dateOfBirth}
            onChange={set}
          />
        </label>

        <label>
          Mobile number
          <input
            required
            name="mobileNumber"
            type="tel"
            value={f.mobileNumber}
            onChange={set}
          />
        </label>

        <label>
          Email
          <input
            required
            name="email"
            type="email"
            value={f.email}
            onChange={set}
          />
        </label>

        <label>
          City
          <input
            required
            name="city"
            type="text"
            value={f.city}
            onChange={set}
          />
        </label>

        <label>
          School / College
          <input
            required
            name="schoolCollege"
            type="text"
            value={f.schoolCollege}
            onChange={set}
          />
        </label>

        <label>
          Class
          <input
            required
            name="className"
            type="text"
            value={f.className}
            onChange={set}
          />
        </label>

        <label>
          Stream
          <input
            required
            name="stream"
            type="text"
            value={f.stream}
            onChange={set}
          />
        </label>

        <label>
          Board
          <input
            required
            name="board"
            type="text"
            value={f.board}
            onChange={set}
          />
        </label>

        <label>
          Areas of interest
          <input
            required
            name="areasOfInterest"
            type="text"
            value={f.areasOfInterest}
            onChange={set}
          />
        </label>

        <label>
          Password
          <input
            required
            name="password"
            type="password"
            value={f.password}
            onChange={set}
          />
        </label>

        <label>
          Gender
          <select
            required
            name="gender"
            value={f.gender}
            onChange={set}
          >
            <option value="">
              Select
            </option>
            <option value="Female">
              Female
            </option>
            <option value="Male">
              Male
            </option>
            <option value="Other">
              Other
            </option>
          </select>
        </label>

        <label>
          District

          <select
            required
            name="district"
            value={f.district}
            onChange={set}
          >
            <option value="">
              Select (Maharashtra)
            </option>

            {DISTRICTS.map(d => (
              <option
                key={d}
                value={d}
              >
                {d}
              </option>
            ))}
          </select>
        </label>

        <label>
          Profile photo

          <input
            type="file"
            name="profilePhoto"
            accept="image/*"
            onChange={set}
          />
        </label>

        <label className="chk">

          <input
            type="checkbox"
            name="termsAccepted"
            required
            checked={f.termsAccepted}
            onChange={set}
          />

          I agree to the Project NOVA community
          guidelines and terms.

        </label>

        <button
          className="btn"
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Creating membership...'
            : 'Create my NOVA membership'}
        </button>

      </form>

      <Link to="/login">
        Already a member? Log in
      </Link>

    </div>
  )
}


export function Login() {

  const nav = useNavigate()

  const [err, setErr] = useState('')

 const go = async (e) => {
  e.preventDefault()

  setError('')
  setSuccess('')
  setLoading(true)

  try {
    // Take values directly from the actual HTML form
    const formData = new FormData(e.currentTarget)

    // Debug
    console.log('========== NOVA FORM DATA ==========')

    for (const [key, value] of formData.entries()) {
      console.log(
        key,
        value instanceof File ? value.name : value
      )
    }

    console.log('====================================')

    const apiUrl =
      import.meta.env.VITE_API_URL ||
      'http://localhost:8080'

    const response = await fetch(
      `${apiUrl}/api/members/register`,
      {
        method: 'POST',
        body: formData
      }
    )

    const result = await response.json()

    console.log('Backend response:', result)

    if (!response.ok) {
      throw new Error(
        result?.message ||
        'Registration failed'
      )
    }

    const member = result?.data

    if (member) {
      localStorage.setItem(
        'nova_user',
        JSON.stringify(member)
      )
    }

    localStorage.setItem(
      'nova_session',
      '1'
    )

    setSuccess(
      'Your NOVA membership has been created successfully!'
    )

    setTimeout(() => {
      nav('/dashboard')
    }, 800)

  } catch (err) {

    console.error(
      'Registration error:',
      err
    )

    setError(
      err.message ||
      'Unable to connect to server.'
    )

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

          <input
            name="id"
            required
          />
        </label>

        <label>
          Password

          <input
            name="pw"
            type="password"
            required
          />
        </label>

        {err && (
          <p className="err">
            {err}
          </p>
        )}

        <button className="btn">
          Login
        </button>

      </form>

      <a
        href="#"
        onClick={e => {
          e.preventDefault()
          setErr(
            'Password reset needs a backend (email/SMS). Add Supabase or Firebase to enable it.'
          )
        }}
      >
        Forgot password
      </a>

      {' · '}

      <Link to="/register">
        New to NOVA? Join free
      </Link>

    </div>
  )
}