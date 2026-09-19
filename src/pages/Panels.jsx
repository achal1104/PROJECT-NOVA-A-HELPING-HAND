import {useState} from 'react'
import {Link,Navigate} from 'react-router-dom'
import {Reveal,Count} from '../ui'
import {BADGES,EVENTS,K,JR,DISTRICTS,ls} from '../data'
export function Dashboard(){
 const u=ls('nova_user',null),[j,setJ]=useState(()=>ls('nova_j',{}))
 if(!u||!localStorage.getItem('nova_session'))return <Navigate to="/login"/>
 const pts=JR.reduce((a,[l,p])=>a+(j[l]||0)*p,0),g=l=>j[l]||0
 const log=l=>{const n={...j,[l]:g(l)+1};setJ(n);localStorage.setItem('nova_j',JSON.stringify(n))}
 const un=[g('Courses completed')>0,g('Tree plantation drives')>0,g('Food drives')>0,g('Workshops attended')>0,pts>=50,pts>=150]
 const order=[3,2,0,1,4,5].map(i=>[BADGES[i],un[[3,2,0,1,4,5].indexOf(i)]])
 const notes=[...ls('nova_notes',[]).map(n=>n.text),'New workshop announced','Industrial visit registration open','New notes uploaded','New course available','Food drive scheduled']
 return <div className="dash"><Reveal><h1>Welcome to NOVA, {u.name.split(' ')[0]} 👋</h1></Reveal>
  <div className="grid g4"><div className="card lime"><small>MY NOVA PROFILE</small><h3>{u.id}</h3><p>{u.school}<br/>Class {u.cls} • {u.city}</p></div>
   <div className="card peach"><small>YOUR NOVA POINTS</small><h3><Count to={pts}/></h3><p>Participation, not competition.</p></div>
   <div className="card lav"><h3>📚 My learning</h3><p>Notes, courses and science projects.</p><Link className="btn sm" to="/courses">Continue learning</Link></div>
   <div className="card blue"><h3>🗣️ My skills</h3><p>English, personality, communication, leadership.</p><Link className="btn sm" to="/courses">Open courses</Link></div></div>
  <div className="grid g3"><div className="card white"><h3>💼 Business</h3><p>Workshops, resources and industrial visits.</p><a className="btn sm" href="/#business">Explore</a></div>
   <div className="card white"><h3>🌱 Community</h3><p>Food drives, tree plantation, volunteering.</p><Link className="btn sm" to="/community">Open</Link></div>
   <div className="card white"><h3>🎟️ My registrations</h3><p>No registrations yet. Browse events to register.</p><a className="btn sm" href="/#events">See events</a></div></div>
  <h3 className="sub">🏆 My NOVA journey</h3><p>Log what you did to earn points.</p><div className="grid g3">{JR.map(([l,p])=><div key={l} className="card white"><small>+{p} points each</small><h3>{g(l)} <span style={{fontSize:'.9rem'}}>{l}</span></h3><button className="btn sm" onClick={()=>log(l)}>Log one</button></div>)}</div>
  <h3 className="sub">Badges</h3><div className="tabs">{order.map(([b,on])=><span key={b} className={'pill '+(on?'lime':'')} style={on?{}:{opacity:.45}}>{b}</span>)}</div>
  <h3 className="sub">🔔 Notifications</h3>{notes.map(n=><p key={n}>🔔 {n}</p>)}
  <h3 className="sub">NOVA in {u.district||'your city'}</h3><p>Upcoming activities near you:</p>{EVENTS.filter(e=>e[4]===u.city||e[4]===u.district||e[4]==='Online').slice(0,3).map(e=><p key={e[0]}>📍 {e[0]} — {e[4]}, {e[2]}</p>)}
  <p style={{marginTop:'2rem'}}><button className="btn" onClick={()=>{localStorage.removeItem('nova_session');location.href='/'}}>Log out</button> <Link className="btn white" to="/admin">Admin demo</Link></p></div>}
export function Admin(){
 const [users,setU]=useState(()=>ls('nova_users',[])),[q,setQ]=useState(''),[d,setD]=useState(''),[ideas,setI]=useState(()=>ls('nova_ideas',[])),[msg,setM]=useState(''),[notes,setN]=useState(()=>ls('nova_notes',[]))
 const save=(k,v,set)=>{localStorage.setItem(k,JSON.stringify(v));set(v)}
 const list=users.filter(x=>(x.name+x.city+x.school+x.id).toLowerCase().includes(q.toLowerCase())&&(!d||x.district===d))
 const by={};users.forEach(x=>by[x.district]=(by[x.district]||0)+1)
 const st=[['Total members',users.length],['Active members',users.filter(x=>x.active!==false).length],['New registrations',users.length],['Ideas pending',ideas.filter(i=>i.status==='pending').length],['Events',6],['Industrial visits',3]]
 return <div className="dash"><h1>Admin panel</h1><p>Demo only — anyone with this link can open it. Add role-based access (Super Admin, Admin, Content, Event, Community, Volunteer) with a real backend.</p>
  <div className="grid g4">{st.map(([l,v],i)=><div key={l} className={'card '+K[i%4]}><small>{l}</small><h3><Count to={v}/></h3></div>)}</div>
  <h3 className="sub">Students</h3><div className="tabs"><input placeholder="Search name, city, school" value={q} onChange={e=>setQ(e.target.value)} className="inp"/><select className="inp" value={d} onChange={e=>setD(e.target.value)}><option value="">All districts</option>{DISTRICTS.map(x=><option key={x}>{x}</option>)}</select></div>
  <table><thead><tr><th>Name</th><th>ID</th><th>District</th><th>School</th><th>Status</th></tr></thead><tbody>{list.map(x=><tr key={x.id}><td>{x.name}</td><td>{x.id}</td><td>{x.district}</td><td>{x.school}</td><td><button className="btn sm" onClick={()=>save('nova_users',users.map(y=>y.id===x.id?{...y,active:y.active===false}:y),setU)}>{x.active===false?'Inactive · activate':'Active · deactivate'}</button></td></tr>)}</tbody></table>
  <h3 className="sub">District-wise members</h3><div className="tabs">{Object.entries(by).map(([k,v])=><span key={k} className="pill">{k}: {v}</span>)}{!users.length&&<p>No members yet.</p>}</div>
  <h3 className="sub">Community ideas (moderation)</h3>{ideas.map(i=><div key={i.id} className="ev2"><b>{i.idea}</b> — {i.status}<span><button className="btn sm" onClick={()=>save('nova_ideas',ideas.map(y=>y.id===i.id?{...y,status:'approved'}:y),setI)}>Approve</button> <button className="btn sm white" onClick={()=>save('nova_ideas',ideas.map(y=>y.id===i.id?{...y,status:'rejected'}:y),setI)}>Reject</button></span></div>)}{!ideas.length&&<p>No ideas submitted yet.</p>}
  <h3 className="sub">Send announcement</h3><div className="tabs"><input className="inp" placeholder="Announcement text" value={msg} onChange={e=>setM(e.target.value)}/><button className="btn sm" onClick={()=>{if(msg){save('nova_notes',[{text:msg},...notes],setN);setM('')}}}>Send to members</button></div>{notes.map((n,i)=><p key={i}>📣 {n.text}</p>)}
  <h3 className="sub">Also to build with a backend</h3><div className="tabs">{['Courses & video uploads','Notes upload','Science projects','Events & capacity','Workshops','Industrial visits','Social drives'].map(m=><span key={m} className="pill">{m}</span>)}</div></div>}