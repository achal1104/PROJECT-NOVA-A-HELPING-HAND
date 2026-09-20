import {useState} from 'react'
import {Link} from 'react-router-dom'
import {motion} from 'framer-motion'
import {Reveal,Tilt,Media,Modal,Share,RegBtn} from '../ui'
import {useT} from '../i18n'
import * as D from '../data'
const {K}=D
const Page=({label,title,children})=><div className="page"><Reveal><span className="lab">{label}</span><h1>{title}</h1></Reveal>{children}</div>
const Lock=({what})=><div className="locked">🔒 <span>Join NOVA (it’s free) to unlock {what}.</span> <Link className="btn sm lime" to="/register">Join NOVA – free</Link> <Link className="btn sm white" to="/login">Log in</Link></div>

export function About(){const {t}=useT();return <Page label={t('About NOVA')} title="More than education. A community for the next generation.">
 <div className="grid g3">{[['Our mission','To give students access to opportunities, knowledge, experiences and communities that help them become confident, capable and socially responsible individuals.'],['Our vision','Build a generation that doesn’t only ask what the world can give them, but also asks what they can give back.'],['Our promise','Project NOVA is not just about studying for tomorrow. It is about preparing students for life.']].map(([a,b],i)=><Reveal key={a} d={i*.1}><Tilt className={'card '+K[i]}><h3>{t(a)}</h3><p>{b}</p></Tilt></Reveal>)}</div>
 <h3 className="sub">Your journey</h3><div className="tabs">{['Join','Discover','Learn','Connect','Experience','Help','Grow'].map((s,i)=><motion.span key={s} className="pill lime" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}}>{i+1}. {s}</motion.span>)}</div>
 <Link className="btn" to="/register">{t('Join NOVA – it’s free')}</Link></Page>}

export function Courses(){
 const {t}=useT(),u=D.currentUser(),[cp,setCp]=useState(()=>u?D.getCP(u.id):{}),[open,setOpen]=useState(null),lib=D.allLib()
 const cur=open&&Object.values(lib).flat().find(c=>c.title===open)
 const toggle=(c,i)=>{if(!u)return;const a=cp[c.title]||[],n={...cp,[c.title]:a.includes(i)?a.filter(x=>x!==i):[...a,i]};setCp(n);D.setCP(u.id,n)}
 const pv=c=>D.pct(cp,c.title,c.n)
 return <Page label={t('Course library')} title={t('Free courses. Learn at your pace.')}>
  {Object.entries(lib).map(([cat,list])=><div key={cat}><h3 className="sub">{t(cat)}</h3><div className="grid g4">{list.map((c,i)=>{const v=pv(c);return <Reveal key={c.title} d={i*.08}><Tilt className={'card '+K[i%4]}>
   <Media src={D.IMG.course} emoji={D.CAT_EMOJI[cat]||'📘'} tone={K[(i+1)%4]} className="thumb" alt=""/><span className="pill">{cat}</span><h3>{c.title}</h3><p>{c.by} • {c.du} • {c.n} lessons</p>
   {u&&<><div className="bar"><motion.b animate={{width:v+'%'}}/></div><small>{v}% complete</small></>}
   <button className="btn sm" onClick={()=>setOpen(c.title)}>{u?(v?t('Continue learning'):t('Start free')):'Preview course'}</button></Tilt></Reveal>})}</div></div>)}
  <h3 className="sub">Free notes</h3><p>Looking for study material? <Link to="/notes"><b>Open the notes library →</b></Link></p>
  <Modal open={!!cur} onClose={()=>setOpen(null)} title={cur?.title}>{cur&&<div className="evd"><span className="pill lime">{cur.cat}</span><h2>{cur.title}</h2><p>{cur.by} • {cur.du} • {cur.n} lessons</p>
   {u?<><div className="bar dk"><motion.b animate={{width:pv(cur)+'%'}}/></div><small>{pv(cur)}% complete — tick lessons as you finish them</small>
    <div className="lessons">{Array.from({length:cur.n},(_,i)=><label key={i} className="ls"><input type="checkbox" checked={(cp[cur.title]||[]).includes(i)} onChange={()=>toggle(cur,i)}/> Lesson {i+1}</label>)}</div>
    <div className="row">{cur.video&&<a className="btn sm" href={cur.video} target="_blank" rel="noopener noreferrer">▶ Watch videos</a>}{cur.pdf&&<a className="btn sm white" href={cur.pdf} target="_blank" rel="noopener noreferrer">📄 Course PDF</a>}</div></>
   :<><p>This course has {cur.n} lessons. Here’s a preview of what you’ll get:</p><ul className="prev">{Array.from({length:Math.min(cur.n,3)},(_,i)=><li key={i}>Lesson {i+1}</li>)}<li>…and {Math.max(cur.n-3,0)} more</li></ul><Lock what="the full course and progress tracking"/></>}</div>}</Modal></Page>}

export function Science(){
 const {t}=useT(),u=D.currentUser(),[cat,setCat]=useState('All'),[open,setOpen]=useState(null),all=D.allSci(),list=all.filter(s=>cat==='All'||s.cat===cat)
 const dl=s=>{const b=new Blob([`${s.name}\nDifficulty: ${s.diff} | Cost: ${s.cost}\n\nMaterials: ${s.mats.join(', ')}\n\nConcept: ${s.concept}\n\nSteps:\n${s.steps.map((x,i)=>`${i+1}. ${x}`).join('\n')}\n\nSAFETY: ${s.safety}\n\nExpected result: ${s.result}\n\n— Project NOVA, A Helping Hand`],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=s.name.replace(/\W+/g,'-')+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
 return <Page label={t('Science project hub')} title={t('Build it. Understand it. Stay safe.')}>
  <p className="lead">Every project comes with safety instructions. If a step needs cutting, heat or electricity, ask a teacher or adult to supervise.</p>
  <div className="tabs">{['All',...D.SCI_CATS].map(c=><button key={c} className={c===cat?'on':''} onClick={()=>setCat(c)}>{c}</button>)}</div>
  {!list.length&&<p>No projects in this category yet — the NOVA team is adding more.</p>}
  <div className="grid g3">{list.map((s,i)=><motion.div layout key={s.name} className={'card '+K[i%4]}><Media emoji="🔬" tone={K[(i+1)%4]} className="thumb" src={D.IMG.science} alt=""/><span className="pill">{s.cat}</span><h3>{s.name}</h3><p>{s.diff} • about {s.cost}</p>
   <button className="btn sm" onClick={()=>setOpen(open===s.name?null:s.name)}>{open===s.name?'Hide':'View project'}</button>
   {open===s.name&&<div className="det"><b>Concept</b><p>{s.concept}</p><b>Materials required</b><p>{s.mats.join(', ')}</p><b>⚠ Safety</b><p>{s.safety}</p>
    {u?<><b>Step-by-step</b><ol>{s.steps.map(x=><li key={x}>{x}</li>)}</ol><b>Expected result</b><p>{s.result}</p><button className="btn sm" onClick={()=>dl(s)}>Download guide</button></>:<Lock what="the step-by-step guide, expected result and downloadable guide"/>}</div>}</motion.div>)}</div></Page>}

export function Notes(){
 const {t}=useT(),u=D.currentUser(),[sub,setSub]=useState('All'),[cls,setCls]=useState('All'),notes=D.allNotes().filter(n=>(sub==='All'||n.subject===sub)&&(cls==='All'||n.cls===cls))
 return <Page label={t('Free Notes')} title="Subject-wise notes and study material.">
  <div className="tabs">{['All',...D.SUBJECTS].map(s=><button key={s} className={s===sub?'on':''} onClick={()=>setSub(s)}>{s}</button>)}</div>
  <div className="tabs">{['All',...D.CLASSES].map(c=><button key={c} className={c===cls?'on':''} onClick={()=>setCls(c)}>{c==='All'?'All classes':'Class '+c}</button>)}</div>
  {!notes.length&&<p>No notes here yet — the NOVA team is uploading them soon. Check back or <Link to="/contact"><b>ask for a subject</b></Link>.</p>}
  <div className="grid g3">{notes.map((n,i)=><Reveal key={n._id} d={i*.05}><div className={'card '+K[i%4]}><span className="pill">{n.subject} • {n.cls}</span><h3>{n.title}</h3>{u?<a className="btn sm" href={n.link} target="_blank" rel="noopener noreferrer">Open / download</a>:<Link className="btn sm" to="/register">🔒 Join free to download</Link>}</div></Reveal>)}</div>
  {!u&&<Lock what="full notes downloads"/>}</Page>}

export function Workshops(){
 const {t}=useT(),ws=D.allEvents().filter(D.isWorkshop)
 return <Page label={t('Workshops')} title="Learn by doing.">
  <p className="lead">Offline workshops on business ideas, problem solving, marketing, sales, finance basics, entrepreneurship and leadership — plus science project clinics.</p>
  {!ws.length&&<p>No workshops scheduled yet.</p>}
  <div className="grid g3">{ws.map((e,i)=><Reveal key={e.name+i} d={i*.08}><div className={'card '+K[i%4]}><span className="pill">{e.cat}</span><h3>{e.name}</h3><p>{e.desc}</p><p>📅 {e.date} • {e.time}<br/>📍 {e.loc}<br/>🎟️ {e.seats}</p><div className="row"><RegBtn kind="event" name={e.name}/><Share text={`Workshop: "${e.name}" with Project NOVA`}/></div></div></Reveal>)}</div></Page>}

export function Careers(){return <Page label="Career exploration" title="What can you do after 11th & 12th Science?">
 <p className="lead">Science opens many doors. Here are common paths and the entrance exams usually linked to them. Exams, eligibility and dates change every year — always confirm on the official website.</p>
 <div className="grid g4">{D.CAREERS.map(([e,a,b,x],i)=><Reveal key={a} d={(i%4)*.08}><Tilt className={'card '+K[i%4]}><span className="ico">{e}</span><h3>{a}</h3><p>{b}</p><small><b>Exams:</b> {x}</small></Tilt></Reveal>)}</div></Page>}

export function Community(){
 const {t}=useT(),u=D.currentUser(),[ideas,setIdeas]=useState(()=>D.ls('nova_ideas',[])),[teams,setTeams]=useState(()=>D.ls('nova_teams',[])),[sent,setSent]=useState(false),[gr,setGr]=useState(()=>u?D.getRegs(u.id).filter(r=>r.kind==='group').map(r=>r.name):[])
 const approved=ideas.filter(i=>i.status==='approved')
 const submit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target)),n=[...ideas,{...d,id:Date.now(),status:'pending',by:u?.name,byId:u?.id}];D.put('nova_ideas',n);setIdeas(n);e.target.reset();setSent(true)}
 const join=i=>{if(!u||teams.some(x=>x.ideaId===i.id&&x.memberId===u.id))return;const n=[...teams,{ideaId:i.id,memberId:u.id,name:u.name,status:'pending'}];D.put('nova_teams',n);setTeams(n)}
 const joinGroup=g=>{if(!u)return;D.addReg(u.id,{kind:'group',name:g});setGr([...gr,g])}
 const mine=i=>teams.find(x=>x.ideaId===i.id&&x.memberId===u?.id)
 return <Page label={t('Community')} title={t('Build something together.')}>
  <div className="tabs">{D.COMM.map(c=><span key={c} className="pill lime">{c}</span>)}</div>
  <h3 className="sub">Discussion groups</h3><p>Pick the groups you’d like to be part of. The NOVA team will add you to the group chat.</p>
  <div className="grid g3">{D.GROUPS.concat(u?.district?['NOVA '+u.district]:[]).map((g,i)=><div key={g} className={'card '+K[i%4]} style={{minHeight:120}}><h3>{g}</h3>{u?<button className="btn sm" disabled={gr.includes(g)} onClick={()=>joinGroup(g)}>{gr.includes(g)?'Requested ✓':'Join group'}</button>:<Link className="btn sm" to="/register">Join NOVA to join</Link>}</div>)}</div>
  <h3 className="sub">Volunteer &amp; take part</h3><p>Food drives, tree plantation, movie days and more — <Link to="/#help"><b>see Helping Hand drives →</b></Link> · Related learning: <Link to="/workshops"><b>workshops →</b></Link></p>
  <h3 className="sub">Submit your idea</h3>
  {u?<form className="form2" onSubmit={submit}>{[['idea','Business idea'],['problem','Problem being solved'],['customer','Target customer'],['team','Team members'],['support','What support is needed']].map(([n,l])=><label key={n}>{l}<textarea required name={n} rows="2"/></label>)}<button className="btn">Submit for approval</button>{sent&&<p>Thanks! A moderator will review your idea before it becomes public.</p>}</form>
   :<Lock what="idea submission and team collaboration"/>}
  <h3 className="sub">Ideas from members</h3>{approved.length===0&&<p>No approved ideas yet. Be the first!</p>}
  <div className="grid g3">{approved.map((i,k)=>{const m=mine(i),size=teams.filter(x=>x.ideaId===i.id&&x.status==='approved').length+1;return <div key={i.id} className={'card '+K[k%4]}><h3>{i.idea}</h3><p>{i.problem}</p><small>For: {i.customer} • Needs: {i.support}<br/>👥 Team of {size}{i.by?' • by '+i.by:''}</small>
   {u?(i.byId===u.id?<small>Your idea</small>:<button className="btn sm" disabled={!!m} onClick={()=>join(i)}>{m?(m.status==='approved'?'You’re in the team ✓':'Request sent ✓'):'Join team'}</button>):<Link className="btn sm" to="/register">Join NOVA to collaborate</Link>}</div>})}</div></Page>}

export function Contact(){
 const [ok,setOk]=useState(false)
 return <Page label="Contact" title="Talk to the NOVA team."><form className="form2" onSubmit={e=>{e.preventDefault();setOk(true)}}><label>Name<input required autoComplete="name"/></label><label>Email or mobile<input required/></label><label>Message<textarea required rows="4"/></label><button className="btn">Send message</button>{ok&&<p>Thanks! (Demo form — connect an email service to receive messages.)</p>}</form>
  <p style={{marginTop:'2rem'}}><Share text="Join Project NOVA – free learning, workshops, industrial visits and community drives for students in Maharashtra!" label="Invite a friend on WhatsApp"/></p></Page>}

export function NotFound(){return <Page label="404" title="This page wandered off."><p>The page you’re looking for doesn’t exist.</p><Link className="btn" to="/">Back to Home</Link></Page>}