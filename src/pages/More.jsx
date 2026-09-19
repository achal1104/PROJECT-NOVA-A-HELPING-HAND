import {useState} from 'react'
import {Link} from 'react-router-dom'
import {motion} from 'framer-motion'
import {Reveal,Tilt} from '../ui'
import {K,SCI_CATS,SCI,LIB,COMM,ls,adminList} from '../data'
const Page=({label,title,children})=><div className="page"><Reveal><span className="lab">{label}</span><h1>{title}</h1></Reveal>{children}</div>
export function About(){return <Page label="About NOVA" title="More than education. A community for the next generation.">
 <div className="grid g3">{[['Our mission','To give students access to opportunities, knowledge, experiences and communities that help them become confident, capable and socially responsible individuals.'],['Our vision','Build a generation that doesn’t only ask what the world can give them, but also asks what they can give back.'],['Our promise','Project NOVA is not just about studying for tomorrow. It is about preparing students for life.']].map(([t,d],i)=><Reveal key={t} d={i*.1}><Tilt className={'card '+K[i]}><h3>{t}</h3><p>{d}</p></Tilt></Reveal>)}</div>
 <h3 className="sub">Your journey</h3><div className="tabs">{['Join','Discover','Learn','Connect','Experience','Help','Grow'].map((s,i)=><motion.span key={s} className="pill lime" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}}>{i+1}. {s}</motion.span>)}</div>
 <Link className="btn" to="/register">Join NOVA – it’s free</Link></Page>}
export function Courses(){
 const [p,setP]=useState(()=>ls('nova_cp',{}))
 const bump=t=>{const n={...p,[t]:Math.min(100,(p[t]||0)+10)};setP(n);localStorage.setItem('nova_cp',JSON.stringify(n))}
 return <Page label="Course library" title="Free courses. Learn at your pace.">{Object.entries(LIB).map(([cat,list])=><div key={cat}><h3 className="sub">{cat}</h3><div className="grid g4">{list.map(([t,by,du,ll],i)=>{const v=p[t]||0;return <Reveal key={t} d={i*.08}><Tilt className={'card '+K[i%4]}><span className="pill">{cat}</span><h3>{t}</h3><p>{by} • {du} • {ll} lessons</p><div className="bar"><motion.b animate={{width:v+'%'}}/></div><small>{v}% complete</small><button className="btn sm" onClick={()=>bump(t)}>{v?'Continue learning':'Start free'}</button></Tilt></Reveal>})}</div></div>)}
 <h3 className="sub">Free notes</h3><p>Subject-wise notes for 11th and 12th Science will be listed here by the NOVA team.</p></Page>}
export function Science(){
 const [cat,setCat]=useState('All'),[open,setOpen]=useState(null)
 const dl=s=>{const b=new Blob([`${s[0]}\nDifficulty: ${s[2]} | Cost: ${s[3]}\n\nMaterials: ${s[4].join(', ')}\n\nConcept: ${s[5]}\n\nSteps:\n${s[6].map((x,i)=>`${i+1}. ${x}`).join('\n')}\n\nSAFETY: ${s[7]}\n\nExpected result: ${s[8]}`],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=s[0].replace(/\W+/g,'-')+'.txt';a.click()}
 return <Page label="Science project hub" title="Build it. Understand it. Stay safe.">
  <div className="tabs">{['All',...SCI_CATS].map(c=><button key={c} className={c===cat?'on':''} onClick={()=>setCat(c)}>{c}</button>)}</div>
  <div className="grid g3">{SCI.filter(s=>cat==='All'||s[1]===cat).map((s,i)=><motion.div layout key={s[0]} className={'card '+K[i%4]}><span className="pill">{s[1]}</span><h3>{s[0]}</h3><p>{s[2]} • about {s[3]}</p>
   <button className="btn sm" onClick={()=>setOpen(open===s[0]?null:s[0])}>{open===s[0]?'Hide':'View project'}</button>
   {open===s[0]&&<div className="det"><b>Materials</b><p>{s[4].join(', ')}</p><b>Concept</b><p>{s[5]}</p><b>Steps</b><ol>{s[6].map(x=><li key={x}>{x}</li>)}</ol><b>⚠ Safety</b><p>{s[7]}</p><b>Expected result</b><p>{s[8]}</p><button className="btn sm" onClick={()=>dl(s)}>Download guide</button></div>}</motion.div>)}</div></Page>}
export function Community(){
 const [ideas,setIdeas]=useState(()=>ls('nova_ideas',[])),[sent,setSent]=useState(false),[joined,setJ]=useState({})
 const submit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));const n=[...ideas,{...d,id:Date.now(),status:'pending'}];localStorage.setItem('nova_ideas',JSON.stringify(n));setIdeas(n);e.target.reset();setSent(true)}
 return <Page label="Community" title="Build something together.">
  <div className="tabs">{COMM.map(c=><span key={c} className="pill lime">{c}</span>)}</div>
  <h3 className="sub">Submit your idea</h3><form className="form2" onSubmit={submit}>{[['idea','Business idea'],['problem','Problem being solved'],['customer','Target customer'],['team','Team members'],['support','What support is needed']].map(([n,l])=><label key={n}>{l}<textarea required name={n} rows="2"/></label>)}<button className="btn">Submit for approval</button>{sent&&<p>Thanks! A moderator will review your idea before it becomes public.</p>}</form>
  <h3 className="sub">Ideas from members</h3>{ideas.filter(i=>i.status==='approved').length===0&&<p>No approved ideas yet. Be the first!</p>}
  <div className="grid g3">{ideas.filter(i=>i.status==='approved').map((i,k)=><div key={i.id} className={'card '+K[k%4]}><h3>{i.idea}</h3><p>{i.problem}</p><small>For: {i.customer} • Needs: {i.support}</small><button className="btn sm" onClick={()=>setJ({...joined,[i.id]:1})}>{joined[i.id]?'Request sent ✓':'Join team'}</button></div>)}</div></Page>}
export function Contact(){
 const [ok,setOk]=useState(false)
 return <Page label="Contact" title="Talk to the NOVA team."><form className="form2" onSubmit={e=>{e.preventDefault();setOk(true)}}><label>Name<input required/></label><label>Email or mobile<input required/></label><label>Message<textarea required rows="4"/></label><button className="btn">Send message</button>{ok&&<p>Thanks! (Demo form — connect an email service to receive messages.)</p>}</form></Page>}