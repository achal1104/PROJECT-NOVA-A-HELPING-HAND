import {useState} from 'react'
import {Count} from '../ui'
import * as D from '../data'

/* DEMO ONLY: this gate and the role list live in the browser. Replace with real auth + role rules
   (Supabase / Firebase) before launch. Change or remove this demo passcode. */
const PASS='nova-admin'
const ALL=['overview','students','courses','notes','science','events','workshops','visits','drives','community','announcements']
const ROLES={'Super Admin':[...ALL,'roles'],'Admin':ALL,'Content Manager':['overview','courses','notes','science'],'Event Manager':['overview','events','workshops','visits'],'Community Manager':['overview','students','community','announcements'],'Volunteer Coordinator':['overview','drives','announcements']}
const TITLE={overview:'Overview',students:'Students',courses:'Courses',notes:'Notes',science:'Science projects',events:'Events',workshops:'Workshops',visits:'Industrial visits',drives:'Social drives',community:'Community business',announcements:'Announcements',roles:'Roles'}
const LINES='One per line'
const CFG={
 courses:{fields:[['title','Course title'],['cat','Category','select',['English','Personality Development','Business']],['by','Instructor'],['du','Duration (e.g. 3 weeks)'],['n','Number of lessons','number'],['video','Video link (URL)','url'],['pdf','PDF link (URL)','url']],sub:x=>`${x.cat} • ${x.n||1} lessons`},
 notes:{fields:[['title','Note title'],['subject','Subject','select',D.SUBJECTS],['cls','Class','select',D.CLASSES],['link','File link (Google Drive / PDF URL)','url']],sub:x=>`${x.subject} • Class ${x.cls}`},
 science:{fields:[['name','Project name'],['cat','Category','select',D.SCI_CATS],['diff','Difficulty','select',['Easy','Medium','Hard']],['cost','Estimated cost (e.g. ₹300)'],['mats','Materials (comma separated)','textarea'],['concept','Concept','textarea'],['steps','Steps ('+LINES+')','textarea'],['safety','Safety instructions','textarea'],['result','Expected result','textarea']],sub:x=>`${x.cat} • ${x.diff}`},
 events:{fields:[['name','Event name'],['cat','Category','select',D.CATS.slice(1)],['date','Date (e.g. 12 Oct 2026)'],['time','Time'],['loc','Location'],['seats','Seats / capacity'],['desc','Description','textarea']],sub:x=>`${x.cat} • ${x.date} • ${x.loc}`,regs:'event',built:()=>D.EVENTS.map(e=>e.name)},
 workshops:{fields:[['name','Workshop name'],['date','Date (e.g. 12 Oct 2026)'],['time','Time'],['loc','Location'],['seats','Seats / capacity'],['desc','Description','textarea']],sub:x=>`${x.date} • ${x.loc}`,regs:'event',built:()=>D.EVENTS.filter(D.isWorkshop).map(e=>e.name)},
 visits:{fields:[['name','Company / industry name'],['type','Industry type'],['loc','Location'],['date','Date'],['seats','Available seats'],['el','Eligibility'],['past','Status','select',['Upcoming','Completed']]],sub:x=>`${x.loc} • ${x.date} • ${x.past||'Upcoming'}`,regs:'visit',built:()=>D.VISITS.map(v=>v.name)},
 drives:{fields:[['kind','Type','select',D.DRIVE_KINDS],['name','Drive name'],['desc','Description','textarea'],['date','Date'],['loc','Location'],['cap','Capacity (optional)'],['img','Image link (optional)','url']],sub:x=>`${x.kind} • ${x.date} • ${x.loc}`,regs:'help',built:()=>D.DRIVES.map(d=>d.name)}}

function Crud({k}){
 const c=CFG[k],[items,setItems]=useState(()=>D.adminList(k)),[open,setOpen]=useState(null)
 const add=e=>{e.preventDefault();setItems(D.adminAdd(k,Object.fromEntries(new FormData(e.target))));e.target.reset()}
 const who=name=>D.regUsers(c.regs,name)
 const names=x=>x.name||x.title
 return <div><form className="form2" onSubmit={add}>{c.fields.map(([n,l,t,o])=><label key={n}>{l}{t==='select'?<select name={n}>{o.map(x=><option key={x}>{x}</option>)}</select>:t==='textarea'?<textarea name={n} rows="2"/>:<input name={n} type={t||'text'} required={n==='name'||n==='title'}/>}</label>)}<button className="btn">Add</button></form>
  <h3 className="sub">Added by admin ({items.length})</h3>{!items.length&&<p>Nothing added yet. Items you add here appear on the public site immediately.</p>}
  {items.map(x=><div key={x._id}><div className="ev2"><span><b>{names(x)}</b> — {c.sub(x)}{c.regs&&<> · 👥 {who(names(x)).length} registered</>}</span><span>{c.regs&&<button className="btn sm white" onClick={()=>setOpen(open===x._id?null:x._id)}>Registrations</button>} <button className="btn sm white" onClick={()=>setItems(D.adminRemove(k,x._id))}>Delete</button></span></div>
   {open===x._id&&<Regs list={who(names(x))}/>}</div>)}
  {c.built&&<><h3 className="sub">Built-in items (edit in data.js)</h3>{c.built().map(n=><div key={n}><div className="ev2"><span><b>{n}</b> · 👥 {who(n).length} registered</span><button className="btn sm white" onClick={()=>setOpen(open===n?null:n)}>Registrations</button></div>{open===n&&<Regs list={who(n)}/>}</div>)}</>}</div>}
const Regs=({list})=><div className="regs">{list.length?list.map(u=><p key={u.id}>{u.name} • {u.id} • {u.city} • {u.mobile}</p>):<p>No registrations yet.</p>}</div>

function Overview(){
 const us=D.getUsers(),lib=Object.values(D.allLib()).flat(),ev=D.allEvents(),ws=new Set(ev.filter(D.isWorkshop).map(e=>e.name))
 const completed=us.reduce((a,u)=>{const cp=D.getCP(u.id);return a+lib.filter(c=>D.pct(cp,c.title,c.n)===100).length},0)
 const wp=us.reduce((a,u)=>a+D.getRegs(u.id).filter(r=>r.kind==='event'&&ws.has(r.name)).length+(D.getJ(u.id)['Workshops attended']||0),0)
 const vol=us.filter(u=>{const j=D.getJ(u.id);return (j['Tree plantation drives']||0)+(j['Food drives']||0)>0||D.getRegs(u.id).some(r=>r.kind==='help')}).length
 const st=[['Total members',us.length],['Active members',us.filter(x=>x.active!==false).length],['New registrations (30 days)',us.filter(x=>x.createdAt>Date.now()-30*864e5).length],['Courses completed',completed],['Events',ev.length],['Workshop participants',wp],['Volunteer participants',vol],['Industrial visits',D.allVisits().length]]
 const by={};us.forEach(x=>by[x.district]=(by[x.district]||0)+1)
 return <div><div className="grid g4">{st.map(([l,v],i)=><div key={l} className={'card '+D.K[i%4]} style={{minHeight:120}}><small>{l}</small><h3><Count to={v}/></h3></div>)}</div>
  <h3 className="sub">District-wise members</h3><div className="tabs">{Object.entries(by).sort((a,b)=>b[1]-a[1]).map(([k,v])=><span key={k} className="pill">{k}: {v}</span>)}{!us.length&&<p>No members yet.</p>}</div>
  <p><small>Demo analytics cover members who registered in this browser. With a real backend these become live, site-wide numbers.</small></p>
  <StatsEditor/></div>}

function StatsEditor(){
 const [s,setS]=useState(()=>(D.getStats()||D.STATS).map(x=>[...x])),[m,setM]=useState('')
 const ch=(i,j,v)=>setS(s.map((r,x)=>x===i?r.map((c,y)=>y===j?v:c):r))
 const save=()=>{D.setStats(s.map(([n,x,l])=>[n!==''&&!isNaN(+n)?+n:n,x,l]));setM('Saved — the homepage now shows these numbers ✓')}
 return <><h3 className="sub">Homepage statistics (editable)</h3>{s.map((r,i)=><div key={i} className="tabs"><input className="inp" style={{width:110}} aria-label="Number" value={r[0]} onChange={e=>ch(i,0,e.target.value)}/><input className="inp" style={{width:70}} aria-label="Suffix" value={r[1]} onChange={e=>ch(i,1,e.target.value)}/><input className="inp" aria-label="Label" value={r[2]} onChange={e=>ch(i,2,e.target.value)}/></div>)}
  <div className="tabs"><button className="btn sm" onClick={save}>Save statistics</button><button className="btn sm white" onClick={()=>{D.resetStats();setS(D.STATS.map(x=>[...x]));setM('Reset to defaults ✓')}}>Reset</button></div>{m&&<p role="status">{m}</p>}</>}

function Students(){
 const [users,setU]=useState(D.getUsers()),[q,setQ]=useState(''),[d,setD]=useState('')
 const list=users.filter(x=>[x.name,x.city,x.school,x.id,x.district].join(' ').toLowerCase().includes(q.toLowerCase())&&(!d||x.district===d))
 const toggle=id=>{const n=users.map(y=>y.id===id?{...y,active:y.active===false}:y);D.saveUsers(n);setU(n)}
 const csv=()=>{const h=['id','name','mobile','email','district','city','school','cls','stream','board'],esc=v=>'"'+String(v??'').replace(/"/g,'""')+'"',b=new Blob([[h.join(','),...list.map(x=>h.map(k=>esc(x[k])).join(','))].join('\n')],{type:'text/csv'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='nova-members.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
 return <div><div className="tabs"><input placeholder="Search name, city, school, ID" value={q} onChange={e=>setQ(e.target.value)} className="inp"/><select className="inp" aria-label="District" value={d} onChange={e=>setD(e.target.value)}><option value="">All districts</option>{D.DISTRICTS.map(x=><option key={x}>{x}</option>)}</select><button className="btn sm white" onClick={csv}>Export CSV</button></div>
  <div className="tw"><table><thead><tr><th>Name</th><th>ID</th><th>District / City</th><th>School</th><th>Class</th><th>Status</th></tr></thead><tbody>{list.map(x=><tr key={x.id}><td>{x.name}</td><td>{x.id}</td><td>{x.district} / {x.city}</td><td>{x.school}</td><td>{x.cls}</td><td><button className="btn sm" style={{marginTop:0}} onClick={()=>toggle(x.id)}>{x.active===false?'Inactive · activate':'Active · deactivate'}</button></td></tr>)}</tbody></table></div>{!list.length&&<p>No members match.</p>}</div>}

function Community(){
 const [ideas,setI]=useState(()=>D.ls('nova_ideas',[])),[teams,setT]=useState(()=>D.ls('nova_teams',[]))
 const setStatus=(id,status)=>setI(D.put('nova_ideas',ideas.map(y=>y.id===id?{...y,status}:y)))
 const setReq=(x,status)=>setT(D.put('nova_teams',status?teams.map(y=>y===x?{...y,status}:y):teams.filter(y=>y!==x)))
 return <div><h3 className="sub">Ideas awaiting review</h3>{!ideas.length&&<p>No ideas submitted yet.</p>}
  {ideas.map(i=><div key={i.id}><div className="ev2"><span><b>{i.idea}</b> — {i.status}{i.by?' • by '+i.by:''}</span><span><button className="btn sm" onClick={()=>setStatus(i.id,'approved')}>Approve</button> <button className="btn sm white" onClick={()=>setStatus(i.id,'rejected')}>Reject</button></span></div>
   {teams.filter(x=>x.ideaId===i.id).map((x,k)=><div key={k} className="ev2" style={{paddingLeft:'1.5rem'}}><span>👤 {x.name} wants to join — {x.status}</span><span><button className="btn sm" onClick={()=>setReq(x,'approved')}>Approve</button> <button className="btn sm white" onClick={()=>setReq(x,null)}>Remove</button></span></div>)}</div>)}</div>}

function Announce(){
 const [msg,setM]=useState(''),[notes,setN]=useState(()=>D.ls('nova_notes',[]))
 const send=()=>{if(!msg.trim())return;setN(D.put('nova_notes',[{text:msg.trim()},...notes]));setM('')}
 return <div><div className="tabs"><input className="inp" placeholder="Announcement text" value={msg} onChange={e=>setM(e.target.value)}/><button className="btn sm" onClick={send}>Send to members</button></div>
  {notes.map((n,i)=><div key={i} className="ev2"><span>📣 {n.text}</span><button className="btn sm white" onClick={()=>setN(D.put('nova_notes',notes.filter((_,x)=>x!==i)))}>Delete</button></div>)}</div>}

function RolesTab(){return <div className="tw"><table><thead><tr><th>Role</th><th>Can manage</th></tr></thead><tbody>{Object.entries(ROLES).map(([r,p])=><tr key={r}><td><b>{r}</b></td><td>{p.filter(x=>x!=='roles').map(x=>TITLE[x]).join(', ')}</td></tr>)}</tbody></table></div>}

export function Admin(){
 const [role,setRole]=useState(()=>{try{return sessionStorage.getItem('nova_admin')}catch{return null}}),[tab,setTab]=useState('overview'),[err,setErr]=useState('')
 if(!role||!ROLES[role])return <div className="form"><h1>Admin sign-in</h1><p>Demo gate — replace with real authentication before launch. Demo passcode: <code>{PASS}</code></p>
  <form onSubmit={e=>{e.preventDefault();const d=new FormData(e.target);if(d.get('pass')!==PASS)return setErr('Wrong passcode.');const r=d.get('role');try{sessionStorage.setItem('nova_admin',r)}catch{}setRole(r)}}>
   <label>Role<select name="role">{Object.keys(ROLES).map(r=><option key={r}>{r}</option>)}</select></label><label>Passcode<input name="pass" type="password" required/></label>{err&&<p className="err" role="alert">{err}</p>}<button className="btn">Enter admin panel</button></form></div>
 const tabs=ROLES[role],cur=tabs.includes(tab)?tab:'overview'
 const body={overview:<Overview/>,students:<Students/>,community:<Community/>,announcements:<Announce/>,roles:<RolesTab/>}[cur]||<Crud key={cur} k={cur}/>
 return <div className="dash"><h1>Admin panel</h1><p>Signed in as <b>{role}</b> · <button className="lnk" onClick={()=>{try{sessionStorage.removeItem('nova_admin')}catch{}setRole(null)}}>Sign out</button></p>
  <div className="tabs adm" role="tablist">{tabs.map(t=><button key={t} role="tab" aria-selected={cur===t} className={cur===t?'on':''} onClick={()=>setTab(t)}>{TITLE[t]}</button>)}</div>
  <h3 className="sub" style={{marginTop:'1.5rem'}}>{TITLE[cur]}</h3>{body}</div>}