import {useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {DISTRICTS,ls} from '../data'
const F=(l,n,t='text')=>({l,n,t})
const fields=[F('Full name','name'),F('Date of birth','dob','date'),F('Mobile number','mobile','tel'),F('Email','email','email'),F('City','city'),F('School / College','school'),F('Class','cls'),F('Stream','stream'),F('Board','board'),F('Areas of interest','interest'),F('Password','password','password')]
export function Register(){
 const nav=useNavigate(),[f,setF]=useState({gender:'',district:''}),[ok,setOk]=useState(false)
 const set=e=>setF({...f,[e.target.name]:e.target.value})
 const go=e=>{e.preventDefault();const id='NOVA-MH-'+String(Math.floor(Math.random()*999999)).padStart(6,'0');const {password,...u}=f
  localStorage.setItem('nova_user',JSON.stringify({...u,id,password}));localStorage.setItem('nova_users',JSON.stringify([...ls('nova_users',[]),{...u,id}]));localStorage.setItem('nova_session','1');nav('/dashboard')}
 return <div className="form"><h1>Welcome to NOVA.</h1><p>Membership is completely free.</p>
  <form onSubmit={go}>{fields.map(x=><label key={x.n}>{x.l}<input required name={x.n} type={x.t} onChange={set}/></label>)}
  <label>Gender<select required name="gender" onChange={set}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></select></label>
  <label>District<select required name="district" onChange={set}><option value="">Select (Maharashtra)</option>{DISTRICTS.map(d=><option key={d}>{d}</option>)}</select></label>
  <label>Profile photo<input type="file" accept="image/*"/></label>
  <label className="chk"><input type="checkbox" required checked={ok} onChange={()=>setOk(!ok)}/> I agree to the Project NOVA community guidelines and terms.</label>
  <button className="btn">Create my NOVA membership</button></form><Link to="/login">Already a member? Log in</Link></div>}
export function Login(){
 const nav=useNavigate(),[err,setErr]=useState('')
 const go=e=>{e.preventDefault();const d=new FormData(e.target),u=ls('nova_user',null)
  if(u&&(u.email===d.get('id')||u.mobile===d.get('id'))&&u.password===d.get('pw')){localStorage.setItem('nova_session','1');nav('/dashboard')}else setErr('No matching member found. New to NOVA? Join free.')}
 return <div className="form"><h1>Welcome back.</h1><form onSubmit={go}><label>Mobile / Email<input name="id" required/></label><label>Password<input name="pw" type="password" required/></label>
  {err&&<p className="err">{err}</p>}<button className="btn">Login</button></form><a href="#" onClick={e=>{e.preventDefault();setErr('Password reset needs a backend (email/SMS). Add Supabase or Firebase to enable it.')}}>Forgot password</a> · <Link to="/register">New to NOVA? Join free</Link></div>}