import {useState} from 'react'
import {Link} from 'react-router-dom'
import {motion,useScroll,useTransform} from 'framer-motion'
import {Reveal,Tilt,Count,Sec,Magnetic,Marquee} from '../ui'
import * as D from '../data'
const words='Your Future Starts Beyond the Classroom.'.split(' ')
// Register/Join button: for a logged-in member this records the registration (via
// D.addReg) instead of bouncing back to the sign-up form, so Dashboard "My registrations"
// shows real data. Signed-out visitors still go through /register as before.
function RegBtn({kind,name,label='Register →',cls='btn sm'}){
 const u=D.ls('nova_user',null),sess=!!localStorage.getItem('nova_session')
 const [done,setDone]=useState(()=>!!(sess&&u&&D.getRegs(u.id).some(r=>r.name===name)))
 if(!sess||!u)return <Link className={cls} to="/register">{label}</Link>
 return <button type="button" className={cls} disabled={done} onClick={()=>{D.addReg(u.id,{kind,name});setDone(true)}}>{done?'Registered ✓':label}</button>}
export default function Home(){
 const {scrollY}=useScroll(),y1=useTransform(scrollY,[0,700],[0,-90]),y2=useTransform(scrollY,[0,700],[0,70])
 const [cat,setCat]=useState('All'),[faq,setFaq]=useState(-1)
 const stats=D.getStats()||D.STATS
 const events=[...D.EVENTS,...D.adminList('events').map(x=>[x.name,x.category||'Education',x.date,x.time,x.location,x.seats])]
 const visits=[...D.VISITS,...D.adminList('visits').map(x=>({n:x.name,type:x.type||'Industrial Visit',loc:x.location,date:x.date,seats:x.seats,el:x.eligibility}))]
 return <>
 <section className="hero"><div className="blobs"><i/><i/><i/></div><motion.div style={{y:y2}}><motion.span className="pill" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>🌱 Free for 11th Science students in Maharashtra</motion.span>
  <h1>{words.map((w,i)=><span key={i} className="w"><motion.span initial={{y:'110%'}} animate={{y:0}} transition={{delay:.2+i*.09,duration:.8,ease:[.2,.8,.2,1]}} className={w==='Beyond'?'hi':''}>{w}&nbsp;</motion.span></span>)}</h1>
  <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1}}>Project NOVA gives Maharashtra’s students free access to learning resources, skill development, entrepreneurship experiences and opportunities to make a difference in their community.</motion.p>
  <motion.div className="ctas" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}}><Magnetic><Link className="btn" to="/register">Join Project NOVA – It’s free →</Link></Magnetic><Magnetic><a className="btn white" href="#about">Explore NOVA ↓</a></Magnetic></motion.div></motion.div>
  <motion.div className="stack" style={{y:y1}}>{['Free notes|Study material for every chapter|peach','Business workshop|Marketing, sales, leadership|lav','Tree plantation|Give back while you learn|lime','Industrial visit|See how real companies work|blue'].map((s,i)=>{const [t,p,c]=s.split('|');return <motion.div key={i} className={'fc '+c} style={{top:i*22+'%',left:(i%2?18:0)+'%'}} initial={{opacity:0,scale:.9,rotate:0}} animate={{opacity:1,scale:1,rotate:i%2?4:-4,y:[0,-10,0]}} transition={{delay:.6+i*.2,y:{repeat:Infinity,duration:5+i,ease:'easeInOut'}}}><span className="pill">{t}</span><p>{p}</p></motion.div>})}</motion.div></section>
 <div className="stats">{stats.map(([n,s,l],i)=><Reveal key={i} d={i*.1}><b><Count to={n} suffix={s}/></b><span>{l}</span></Reveal>)}</div>
 <Marquee items={['Learn','Grow','Build','Help','Free for every student','Made in Maharashtra']}/>
 <Sec id="about" label="What is Project NOVA?" title={<>NOVA is more than a learning platform.</>}>
  <Reveal><p className="lead">Project NOVA is a student community created to help young people learn skills beyond textbooks, discover their potential, build meaningful connections and participate in activities that create a positive impact around them.</p></Reveal>
  <div className="grid g4">{D.LGBH.map(([t,d],i)=><Reveal key={t} d={i*.12}><Tilt className={'card '+D.K[i]}><em>0{i+1}</em><h3>{t}</h3><p>{d}</p></Tilt></Reveal>)}</div></Sec>
 <Sec id="learning" label="Free learning hub" title="Everything you need to grow — free.">
  <div className="grid g3">{D.HUB.map(([e,t,d],i)=><Reveal key={t} d={(i%3)*.1}><Tilt className="card white"><span className="ico">{e}</span><h3>{t}</h3><p>{d}</p></Tilt></Reveal>)}</div>
  <h3 className="sub">Courses</h3><div className="grid g4">{D.COURSES.map(([t,c,l,du,p],i)=><Reveal key={t} d={i*.1}><Tilt className={'card '+D.K[i]}><span className="pill">{c}</span><h3>{t}</h3><p>{l} lessons • {du}</p><div className="bar"><motion.b initial={{width:0}} whileInView={{width:p+'%'}} viewport={{once:true}} transition={{duration:1.2}}/></div><small>{p}%</small><Link className="btn sm" to="/register">{p?'Continue learning':'Start free'}</Link></Tilt></Reveal>)}</div>
  <h3 className="sub">Science project hub</h3><div className="grid g4">{D.PROJECTS.map(([t,c,df,co],i)=><Reveal key={t} d={i*.1}><Tilt className="card white"><span className="pill">{c}</span><h3>{t}</h3><p>{df} • about {co}</p><small>Includes safety guidance and a downloadable guide.</small></Tilt></Reveal>)}</div>
  <Reveal><Link className="btn" to="/register">Explore free learning →</Link></Reveal></Sec>
 <Sec id="community" label="Community" title="Learn together. Grow together." className="dark">
  <Reveal><p className="lead">NOVA is not just a place to study. It is a community of students who learn, collaborate, experience and grow together.</p></Reveal>
  <div className="net"><motion.div className="core" animate={{rotate:360}} transition={{repeat:Infinity,duration:30,ease:'linear'}}><span>NOVA</span></motion.div>
   {D.COMM.map((c,i)=>{const a=i/D.COMM.length*Math.PI*2;return <motion.span key={c} className="node" style={{left:50+42*Math.cos(a)+'%',top:50+40*Math.sin(a)+'%'}} initial={{opacity:0,scale:0}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:.2+i*.12}}>{c}</motion.span>})}</div>
  <Link className="btn lime" to="/register">Become a NOVA member</Link> <Link className="btn white" to="/community">Build something together</Link></Sec>
 <Sec id="business" label="Experience" title="Don’t just think about business. Experience it.">
  <div className="grid g4">{D.BIZ.map(([e,t,d],i)=><Reveal key={t} d={i*.1}><Tilt className={'card '+D.K[i]}><span className="ico">{e}</span><h3>{t}</h3><p>{d}</p></Tilt></Reveal>)}</div>
  <h3 className="sub">Business building workshops</h3><div className="tabs">{['Business ideas','Problem solving','Marketing','Sales','Finance basics','Entrepreneurship','Leadership'].map(t=><span key={t} className="pill lime">{t}</span>)}</div><Link className="btn" to="/courses">Explore business programs →</Link>
  <h3 className="sub" id="visits">See how the real world works.</h3>
  <div className="grid g3">{visits.map((v,i)=><Reveal key={v.n+i} d={i*.12} x={i%2?40:-40}><Tilt className="pass"><span className="pill lime">{v.type}</span><h3>{v.n}</h3><p>📍 {v.loc}<br/>📅 {v.date}<br/>👥 {v.seats}<br/>🎓 {v.el}</p><RegBtn kind="visit" name={v.n}/></Tilt></Reveal>)}</div></Sec>
 <Sec id="help" label="Helping hand" title="Learning is powerful. Helping is priceless.">
  <Reveal><p className="lead">Project NOVA believes students can create positive change while they learn.</p></Reveal>
  <div className="grid g3">{D.HELP.map(([e,t,d],i)=><Reveal key={t} d={i*.1}><motion.div className={'help '+D.K[i%4]} whileHover={{scale:1.02}}><span className="ico">{e}</span><h3>{t}</h3><p>{d}</p><small>📅 Date TBA • 📍 Maharashtra • 👥 Open to members</small><RegBtn kind="help" name={t}/></motion.div></Reveal>)}</div></Sec>
 <Sec id="events" label="Events" title="There’s always something happening.">
  <div className="tabs">{D.CATS.map(c=><button key={c} className={c===cat?'on':''} onClick={()=>setCat(c)}>{c}</button>)}</div>
  <motion.div layout className="grid g3">{events.filter(e=>cat==='All'||e[1]===cat).map((e,i)=><motion.div layout key={e[0]+i} initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} className={'card '+D.K[i%4]}><span className="pill">{e[1]}</span><h3>{e[0]}</h3><p>📅 {e[2]} • {e[3]}<br/>📍 {e[4]}<br/>🎟️ {e[5]}</p><RegBtn kind="event" name={e[0]} label="Register →"/></motion.div>)}</motion.div></Sec>
 <Sec id="why" label="Why join NOVA" title="When you join NOVA, you get more than notes.">
  <ul className="ck">{D.WHY.map((w,i)=><motion.li key={w} initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:(i%7)*.07}}><b>✓</b>{w}</motion.li>)}</ul>
  <Link className="btn" to="/register">Join NOVA – it’s free</Link></Sec>
 <Sec id="faq" label="FAQ" title="Questions? Answered.">{D.FAQ.map(([q,a],i)=><div key={q} className="faq"><button onClick={()=>setFaq(faq===i?-1:i)}>{q}<span>{faq===i?'−':'+'}</span></button><motion.div animate={{height:faq===i?'auto':0}} style={{overflow:'hidden'}}><p>{a}</p></motion.div></div>)}</Sec>
 <motion.section className="final" initial={{scale:.92,opacity:0}} whileInView={{scale:1,opacity:1}} viewport={{once:true}} transition={{duration:1}}><h2>Your journey is just <span className="hi">beginning.</span></h2>
  <p>Learn something new. Meet new people. Build something meaningful. Help someone. Discover yourself.</p><Link className="btn lime" to="/register">Become a NOVA member →</Link><small>It’s free. It’s your community. It’s your journey.</small></motion.section></>}