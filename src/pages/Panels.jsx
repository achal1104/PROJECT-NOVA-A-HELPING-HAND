import {useState} from 'react'
import {Link,Navigate,useNavigate} from 'react-router-dom'
import {motion} from 'framer-motion'
import {Reveal,Count,shrinkPhoto,Share} from '../ui'
import {useT} from '../i18n'
import * as D from '../data'

const KIND={event:['🎟️','Event'],visit:['🏭','Industrial visit'],help:['🌱','Helping Hand'],group:['💬','Group']}
const Avatar=({u,lg})=>u.photo?<img className={'avatar'+(lg?' lg':'')} src={u.photo} alt={u.name}/>:<span className={'avatar'+(lg?' lg':'')} aria-hidden="true">{u.name.trim()[0]?.toUpperCase()}</span>
const Bar=({v})=><div className="bar dk"><motion.b initial={{width:0}} animate={{width:v+'%'}} transition={{duration:1}}/></div>

export function Dashboard(){
 const {t}=useT(),nav=useNavigate(),u=D.currentUser()
 const [j,setJ]=useState(()=>u?D.getJ(u.id):{}),[regs,setRegs]=useState(()=>u?D.getRegs(u.id):[])
 if(!u)return <Navigate to="/login"/>
 const lib=D.allLib(),all=Object.values(lib).flat(),cp=D.getCP(u.id)
 const prog=c=>D.pct(cp,c.title,c.n),avg=l=>l.length?Math.round(l.reduce((a,c)=>a+prog(c),0)/l.length):0
 const done=all.filter(c=>prog(c)===100).length
 const one=n=>{const c=all.find(x=>x.title===n);return c?prog(c):0}
 const cnt=l=>l==='Courses completed'?done:(j[l]||0)
 const pts=D.JR.reduce((a,[l,p])=>a+cnt(l)*p,0)
 const log=l=>{const n={...j,[l]:(j[l]||0)+1};setJ(n);D.setJ(u.id,n)}
 const cancel=r=>setRegs(D.removeReg(u.id,r.kind,r.name))
 const ideas=D.ls('nova_ideas',[]).filter(i=>i.byId===u.id).length
 const skills=[['🗣️ English speaking',avg(lib.English||[])],['🧠 Personality development',avg(lib['Personality Development']||[])],['💬 Communication',one('Communication')],['🚀 Leadership',one('Leadership')]]
 const journey=[['Courses completed',done],['Events registered',regs.filter(r=>r.kind==='event').length],['Workshops attended',cnt('Workshops attended')],['Volunteer activities',cnt('Tree plantation drives')+cnt('Food drives')],['Community participation',ideas+regs.filter(r=>r.kind==='group').length]]
 const events=D.allEvents(),visits=D.allVisits(),drives=D.allDrives()
 const notes=[
  ...regs.slice().reverse().map(r=>`Your registration for ${r.name} is confirmed`),
  ...D.ls('nova_notes',[]).map(n=>n.text),
  ...D.adminList('notes').slice(-2).map(n=>'New notes uploaded: '+n.title),
  ...D.adminList('courses').slice(-2).map(n=>'New course available: '+n.title),
  ...D.adminList('workshops').slice(-2).map(n=>'New workshop announced: '+n.name),
  ...D.adminList('events').slice(-2).map(n=>'New event: '+n.name),
  ...D.adminList('visits').slice(-2).map(n=>'Industrial visit registration open: '+n.name),
  ...D.adminList('drives').slice(-2).map(n=>'Drive scheduled: '+n.name)].slice(0,8)
 if(!notes.length)notes.push('Welcome to NOVA! Explore courses, events and drives to get started.')
 const near=s=>{const x=String(s||'').toLowerCase();return !!x&&[u.city,u.district].some(v=>v&&(x.includes(v.toLowerCase())||v.toLowerCase().includes(x)))}
 const local=[...events.filter(e=>near(e.loc)||e.loc==='Online').map(e=>[e.name,e.loc,e.date]),...visits.filter(v=>!v.past&&near(v.loc)).map(v=>[v.name,v.loc,v.date]),...drives.filter(d=>near(d.loc)).map(d=>[d.name,d.loc,d.date])].slice(0,5)
 const isBadge=D.BADGES.map(([b,rule])=>[b,rule({cnt,pts})])
 return <div className="dash"><Reveal><div className="who"><Avatar u={u} lg/><h1>{t('Welcome to NOVA')}, {u.name.split(' ')[0]} 👋</h1></div></Reveal>
  <div className="grid g4">
   <div className="card lime"><small>MY NOVA PROFILE</small><h3>{u.id}</h3><p>{u.school}<br/>Class {u.cls} • {u.city}, {u.district}</p><Link className="btn sm white" to="/profile">Edit profile</Link></div>
   <div className="card peach"><small>YOUR NOVA POINTS</small><h3><Count to={pts}/></h3><p>Participation, not competition.</p></div>
   <div className="card lav"><h3>📚 My learning</h3><Bar v={avg(all)}/><small>{avg(all)}% overall progress</small><div className="row"><Link className="btn sm" to="/notes">Notes</Link><Link className="btn sm" to="/courses">Courses</Link><Link className="btn sm" to="/science">Projects</Link></div></div>
   <div className="card blue"><h3>🗣️ My skills</h3>{skills.map(([l,v])=><div key={l}><small>{l} — {v}%</small><Bar v={v}/></div>)}</div></div>
  <div className="grid g3">
   <div className="card white"><h3>💼 Business</h3><p>Workshops, resources and industrial visits.</p><div className="row"><Link className="btn sm" to="/workshops">Workshops</Link><Link className="btn sm" to="/#visits">Visits</Link><Link className="btn sm" to="/#business">Business</Link></div></div>
   <div className="card white"><h3>🌱 Community</h3><p>Food drives, tree plantation, volunteering and community events.</p><div className="row"><Link className="btn sm" to="/#help">Drives</Link><Link className="btn sm" to="/community">Community</Link></div></div>
   <div className="card white"><h3>🎬 Events</h3>{events.slice(0,3).map(e=><p key={e.name}>📅 {e.name} — {e.date}</p>)}<Link className="btn sm" to="/#events">All events</Link></div></div>
  <h3 className="sub">🎟️ My registrations</h3>
  {!regs.length&&<p>No registrations yet. <Link to="/#events"><b>Browse events</b></Link> or <Link to="/#help"><b>join a drive</b></Link>.</p>}
  {regs.map(r=><div key={r.kind+r.name} className="ev2"><span>{(KIND[r.kind]||['🎟️','Activity'])[0]} <b>{r.name}</b> · {(KIND[r.kind]||[0,'Activity'])[1]} · {new Date(r.at).toLocaleDateString()}</span><button className="btn sm white" onClick={()=>cancel(r)}>Cancel</button></div>)}
  <h3 className="sub">🏆 My NOVA journey</h3>
  <div className="grid g4">{journey.map(([l,v])=><div key={l} className="card white" style={{minHeight:110}}><small>{l}</small><h3>{v}</h3></div>)}</div>
  <p style={{marginTop:'1.5rem'}}><b>Log what you did to earn points</b> <small>(courses are counted automatically)</small></p>
  <div className="grid g3">{D.JR.filter(([l])=>l!=='Courses completed').map(([l,p])=><div key={l} className="card white" style={{minHeight:120}}><small>+{p} points each</small><h3>{j[l]||0} <span style={{fontSize:'.9rem'}}>{l}</span></h3><button className="btn sm" onClick={()=>log(l)}>Log one</button></div>)}</div>
  <h3 className="sub">Badges</h3><div className="tabs">{isBadge.map(([b,on])=><span key={b} className={'pill '+(on?'lime':'')} style={on?{}:{opacity:.45}}>{b}</span>)}</div>
  <h3 className="sub">🔔 Notifications</h3>{notes.map((n,i)=><p key={i}>🔔 {n}</p>)}
  <h3 className="sub">NOVA in {u.district||'your city'}</h3><p>Upcoming activities near you:</p>
  {local.length?local.map(([n,l,d],i)=><p key={i}>📍 {n} — {l}, {d}</p>):<p>Nothing scheduled in your area yet. <Link to="/#events"><b>See all events</b></Link>.</p>}
  <p style={{marginTop:'2rem'}}><button className="btn" onClick={()=>{D.endSession();nav('/')}}>{t('Log out')}</button> <Share text={`I'm a Project NOVA member (${u.id})! Join free:`} label="Invite a friend"/></p></div>}

export function Profile(){
 const u=D.currentUser(),[f,setF]=useState(u||{}),[photo,setPhoto]=useState(u?.photo||''),[int,setInt]=useState(u?.interests||[]),[msg,setMsg]=useState(''),[err,setErr]=useState('')
 if(!u)return <Navigate to="/login"/>
 const set=e=>setF({...f,[e.target.name]:e.target.value})
 const onPhoto=async e=>{setErr('');try{const p=await shrinkPhoto(e.target.files[0]);if(p)setPhoto(p)}catch(x){setErr(x.message);e.target.value=''}}
 const save=e=>{e.preventDefault();D.updateUser(u.id,{name:f.name.trim(),district:f.district,city:f.city,school:f.school,cls:f.cls,stream:f.stream,board:f.board,interests:int,photo});setMsg('Profile saved ✓')}
 return <div className="form"><h1>My profile</h1>
  <div className="idcard"><Avatar u={{...u,photo}} lg/><b className="mid">{u.id}</b><p>{u.email} • {u.mobile} • Born {u.dob}</p></div>
  <form onSubmit={save}>
   <label>Full name<input required name="name" value={f.name||''} onChange={set}/></label>
   <label>District<select required name="district" value={f.district||''} onChange={set}>{D.DISTRICTS.map(d=><option key={d}>{d}</option>)}</select></label>
   <label>City<input required name="city" value={f.city||''} onChange={set}/></label>
   <label>School / College<input required name="school" value={f.school||''} onChange={set}/></label>
   <label>Class<select name="cls" value={f.cls||''} onChange={set}>{D.CLASS_OPTS.map(d=><option key={d}>{d}</option>)}</select></label>
   <label>Stream<select name="stream" value={f.stream||''} onChange={set}>{D.STREAM_OPTS.map(d=><option key={d}>{d}</option>)}</select></label>
   <label>Board<select name="board" value={f.board||''} onChange={set}>{D.BOARD_OPTS.map(d=><option key={d}>{d}</option>)}</select></label>
   <fieldset className="fs"><legend>Areas of interest</legend><div className="chips">{D.INTERESTS.map(i=><button type="button" key={i} aria-pressed={int.includes(i)} className={int.includes(i)?'on':''} onClick={()=>setInt(int.includes(i)?int.filter(x=>x!==i):[...int,i])}>{i}</button>)}</div></fieldset>
   <label>Change profile photo<input type="file" accept="image/*" onChange={onPhoto}/></label>
   {err&&<p className="err" role="alert">{err}</p>}{msg&&<p role="status">{msg}</p>}
   <button className="btn">Save changes</button></form><Link to="/dashboard">← Back to dashboard</Link></div>}