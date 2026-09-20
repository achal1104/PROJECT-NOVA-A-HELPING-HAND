import {useState} from 'react'
import {Link} from 'react-router-dom'
import {motion,useScroll,useTransform} from 'framer-motion'
import {Reveal,Tilt,Count,Sec,Magnetic,Marquee,Media,Modal,Share,RegBtn} from '../ui'
import {useT} from '../i18n'
import * as D from '../data'

const HERO='Your Future Starts Beyond the Classroom.'
const STACK=[['Free notes','Study material for every chapter','peach'],['Business workshop','Marketing, sales, leadership','lav'],['Tree plantation','Give back while you learn','lime'],['Industrial visit','See how real companies work','blue']]

export default function Home(){
 const {t}=useT(),u=D.currentUser()
 const {scrollY}=useScroll(),y1=useTransform(scrollY,[0,700],[0,-90]),y2=useTransform(scrollY,[0,700],[0,70])
 const [cat,setCat]=useState('All'),[faq,setFaq]=useState(-1),[ev,setEv]=useState(null)
 const stats=D.getStats()||D.STATS
 const events=D.allEvents(),visits=D.allVisits(),drives=D.allDrives(),lib=D.allLib(),sci=D.allSci()
 const cp=u?D.getCP(u.id):{}
 const homeCourses=D.HOME_COURSES.map(n=>Object.values(lib).flat().find(c=>c.title===n)).filter(Boolean)
 const upcoming=visits.filter(v=>!v.past),past=visits.filter(v=>v.past)
 const words=t(HERO).split(' ')
 const evCard=(e,i)=><motion.div layout key={e.name+i} initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} className={'card '+D.K[i%4]}>
  <span className="pill">{e.cat}</span><h3>{e.name}</h3><p>📅 {e.date} • {e.time}<br/>📍 {e.loc}<br/>🎟️ {e.seats}</p>
  <button type="button" className="btn sm" onClick={()=>setEv(e)}>{t('View event')} →</button></motion.div>
 const driveCard=(d,i)=><div key={d.name+i} className={'help '+D.K[i%4]}>
  <Media src={d.img||D.IMG[d.kind]} emoji={D.DRIVE_EMOJI[d.kind]} tone={D.K[i%4]} alt={d.name}/>
  <h3>{d.name}</h3><p>{d.desc}</p><small>📅 {d.date} • 📍 {d.loc} • 👥 {D.joined(d)}</small>
  <div className="row"><RegBtn kind="help" name={d.name} label="Join →"/><Share text={`Join "${d.name}" with Project NOVA!`}/></div></div>
 const driveSection=(id,label,title,kind,lead,steps)=><Sec id={id} label={label} title={title}>
  <div className="split"><div><Reveal><p className="lead">{lead}</p></Reveal><ol className="steps">{steps.map((s,i)=><li key={s}><b>{i+1}</b>{s}</li>)}</ol></div>
   <div className="stackc">{drives.filter(d=>d.kind===kind).map(driveCard)}</div></div></Sec>
 return <>
 <section className="hero"><div className="blobs"><i/><i/><i/></div><motion.div style={{y:y2}}><motion.span className="pill" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>{t('🌱 Free for 11th Science students in Maharashtra')}</motion.span>
  <h1>{words.map((w,i)=><span key={i} className="w"><motion.span initial={{y:'110%'}} animate={{y:0}} transition={{delay:.2+i*.09,duration:.8,ease:[.2,.8,.2,1]}} className={i===3?'hi':''}>{w}&nbsp;</motion.span></span>)}</h1>
  <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1}}>{t('Project NOVA gives Maharashtra’s students free access to learning resources, skill development, entrepreneurship experiences and opportunities to make a difference in their community.')}</motion.p>
  <motion.div className="ctas" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}}><Magnetic><Link className="btn" to={u?'/dashboard':'/register'}>{u?t('My NOVA')+' →':t('Join Project NOVA – It’s free →')}</Link></Magnetic><Magnetic><Link className="btn white" to="/#about">{t('Explore NOVA ↓')}</Link></Magnetic></motion.div></motion.div>
  <motion.div className="stack" style={{y:y1}}>{D.IMG.hero&&<img className="heroimg" src={D.IMG.hero} alt="NOVA students" onError={e=>e.currentTarget.remove()}/>}
   {STACK.map(([a,b,c],i)=><motion.div key={i} className={'fc '+c} style={{top:i*22+'%',left:(i%2?18:0)+'%'}} initial={{opacity:0,scale:.9,rotate:0}} animate={{opacity:1,scale:1,rotate:i%2?4:-4,y:[0,-10,0]}} transition={{delay:.6+i*.2,y:{repeat:Infinity,duration:5+i,ease:'easeInOut'}}}><span className="pill">{a}</span><p>{b}</p></motion.div>)}</motion.div></section>
 <div className="stats">{stats.map(([n,s,l],i)=><Reveal key={i} d={i*.1}><b><Count to={n} suffix={s}/></b><span>{t(l)}</span></Reveal>)}</div>
 <Marquee items={['Learn','Grow','Build','Help','Free for every student','Made in Maharashtra']}/>

 {/* 2 · Join CTA */}
 {!u&&<Reveal><div className="joinband"><div><b>{t('Join NOVA – it’s free')}</b><span>{t('Create your free NOVA membership and get your member ID.')}</span></div><Link className="btn lime" to="/register">{t('Become a NOVA member →')}</Link></div></Reveal>}

 {/* 3 + 4 · Introduction and Learn / Grow / Build / Help */}
 <Sec id="about" label={t('What is Project NOVA?')} title={t('NOVA is more than a learning platform.')}>
  <Reveal><p className="lead">{t('Project NOVA is a student community created to help young people learn skills beyond textbooks, discover their potential, build meaningful connections and participate in activities that create a positive impact around them.')}</p></Reveal>
  <div className="grid g4">{D.LGBH.map(([a,b],i)=><Reveal key={a} d={i*.12}><Tilt className={'card '+D.K[i]}><em>0{i+1}</em><h3>{t(a)}</h3><p>{t(b)}</p></Tilt></Reveal>)}</div></Sec>

 {/* 5 · Free learning hub */}
 <Sec id="learning" label={t('Free learning hub')} title={t('Everything you need to grow — free.')}>
  <div className="grid g3">{D.HUB.map(([e,a,b,to],i)=><Reveal key={a} d={(i%3)*.1}><Link className="blk" to={to}><Tilt className="card white"><span className="ico">{e}</span><h3>{t(a)}</h3><p>{t(b)}</p></Tilt></Link></Reveal>)}</div>
  <Reveal><Link className="btn" to="/notes">{t('Explore free learning →')}</Link></Reveal></Sec>

 {/* 6 · Courses */}
 <Sec id="courses" label={t('Course library')} title={t('Learn at your pace.')}>
  <div className="grid g4">{homeCourses.map((c,i)=>{const p=D.pct(cp,c.title,c.n);return <Reveal key={c.title} d={i*.1}><Tilt className={'card '+D.K[i]}>
   <Media src={D.IMG.course} emoji={D.CAT_EMOJI[c.cat]} tone={D.K[(i+1)%4]} className="thumb" alt=""/>
   <span className="pill">{c.cat}</span><h3>{c.title}</h3><p>{c.by} • {c.n} lessons • {c.du}</p>
   {u&&<><div className="bar"><motion.b initial={{width:0}} whileInView={{width:p+'%'}} viewport={{once:true}} transition={{duration:1.2}}/></div><small>{p}%</small></>}
   <Link className="btn sm" to="/courses">{u&&p?t('Continue learning'):t('Start free')}</Link></Tilt></Reveal>})}</div></Sec>

 {/* 7 · Science project hub */}
 <Sec id="science" label={t('Science project hub')} title={t('Build it. Understand it. Stay safe.')}>
  <div className="grid g4">{sci.slice(0,4).map((s,i)=><Reveal key={s.name} d={i*.1}><Link className="blk" to="/science"><Tilt className="card white"><Media emoji="🔬" tone={D.K[i]} className="thumb" src={D.IMG.science} alt=""/><span className="pill">{s.cat}</span><h3>{s.name}</h3><p>{s.diff} • about {s.cost}</p><small>Includes safety guidance and a downloadable guide.</small></Tilt></Link></Reveal>)}</div>
  <Reveal><Link className="btn" to="/science">Browse all projects →</Link></Reveal></Sec>

 {/* 8 + 9 · Business & entrepreneurship, industrial visits */}
 <Sec id="business" label={t('Experience')} title={t('Don’t just think about business. Experience it.')}>
  <div className="grid g4">{D.BIZ.map(([e,a,b],i)=><Reveal key={a} d={i*.1}><Tilt className={'card '+D.K[i]}><span className="ico">{e}</span><h3>{a}</h3><p>{b}</p></Tilt></Reveal>)}</div>
  <h3 className="sub">Business building workshops</h3><div className="tabs">{D.WORKSHOP_TOPICS.map(x=><span key={x} className="pill lime">{x}</span>)}</div>
  <Link className="btn" to="/workshops">{t('Explore business programs →')}</Link></Sec>
 <Sec id="visits" label="Industrial visits" title={t('See how the real world works.')}>
  <div className="grid g3">{upcoming.map((v,i)=><Reveal key={v.name+i} d={i*.12} x={i%2?40:-40}><Tilt className="pass"><span className="pill lime">{v.type}</span><h3>{v.name}</h3><p>📍 {v.loc}<br/>📅 {v.date}<br/>👥 {v.seats}<br/>🎓 {v.el}</p><div className="row"><RegBtn kind="visit" name={v.name}/><Share text={`Industrial visit: ${v.name} (${v.loc}) with Project NOVA`}/></div></Tilt></Reveal>)}</div>
  {past.length>0&&<><h3 className="sub">Previous visits</h3><div className="grid g3">{past.map((v,i)=><div key={v.name+i} className="pass done"><span className="pill">{v.type}</span><h3>{v.name}</h3><p>📍 {v.loc}<br/>🎓 {v.el}</p><span className="pill lime">Completed ✓</span></div>)}</div></>}</Sec>

 {/* 10 · Helping hand initiatives */}
 <Sec id="help" label={t('Helping hand')} title={t('Learning is powerful. Helping is priceless.')}>
  <Reveal><p className="lead">{t('Project NOVA believes students can create positive change while they learn.')}</p></Reveal>
  <div className="grid g3">{drives.map((d,i)=><Reveal key={d.name+i} d={(i%3)*.1}>{driveCard(d,i)}</Reveal>)}</div></Sec>

 {/* 11 · Food drive · 12 · Tree plantation */}
 {driveSection('food',t('Food drive'),'Every meal shared matters.','Food Drive','Students collect and distribute food for people who need support — a simple way to turn learning into action.',['Register as a volunteer','Collect and pack food together','Distribute it with your NOVA team'])}
 {driveSection('tree',t('Tree plantation'),'Plant a tree. Grow a habit.','Tree Plantation Drive','Join fellow members to plant trees and learn how to look after them, so the impact keeps growing long after the drive.',['Register for a plantation drive','Plant saplings with your team','Care for them and track their growth'])}

 {/* 13 · Community events */}
 <Sec id="community-events" label="Community events" title="Come together, beyond the classroom.">
  <div className="grid g3">{events.filter(e=>['Social Impact','Community','Entertainment'].includes(e.cat)).map(evCard)}</div></Sec>

 {/* 14 · Upcoming events */}
 <Sec id="events" label={t('Upcoming events')} title={t('There’s always something happening.')}>
  <div className="tabs">{D.CATS.map(c=><button key={c} className={c===cat?'on':''} onClick={()=>setCat(c)}>{c}</button>)}</div>
  <motion.div layout className="grid g3">{events.filter(e=>cat==='All'||e.cat===cat).map(evCard)}</motion.div>
  {!events.some(e=>cat==='All'||e.cat===cat)&&<p>No events in this category yet — check back soon.</p>}</Sec>

 {/* 15 · Why join NOVA */}
 <Sec id="why" label={t('Why join NOVA')} title={t('When you join NOVA, you get more than notes.')}>
  <ul className="ck">{D.WHY.map((w,i)=><motion.li key={w} initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:(i%7)*.07}}><b>✓</b>{w}</motion.li>)}</ul>
  <Link className="btn" to={u?'/dashboard':'/register'}>{t('Join NOVA – it’s free')}</Link></Sec>

 {/* 16 · Student community */}
 <Sec id="community" label={t('Community')} title={t('Learn together. Grow together.')} className="dark">
  <Reveal><p className="lead">NOVA is not just a place to study. It is a community of students who learn, collaborate, experience and grow together.</p></Reveal>
  <div className="net"><motion.div className="core" animate={{rotate:360}} transition={{repeat:Infinity,duration:30,ease:'linear'}}><span>NOVA</span></motion.div>
   {D.COMM.map((c,i)=>{const a=i/D.COMM.length*Math.PI*2;return <motion.span key={c} className="node" style={{left:50+42*Math.cos(a)+'%',top:50+40*Math.sin(a)+'%'}} initial={{opacity:0,scale:0}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:.2+i*.12}}>{c}</motion.span>})}</div>
  <Link className="btn lime" to={u?'/community':'/register'}>{t('Become a NOVA member')}</Link> <Link className="btn white" to="/community">{t('Build something together')}</Link></Sec>

 {/* 17 · Membership CTA */}
 <Reveal><section className="member" id="join"><div><span className="lab">Membership</span><h2>Welcome to NOVA.</h2><p>Free notes, courses, workshops, industrial visits, food and tree drives — one membership, one member ID.</p></div>
  <div className="row">{u?<Link className="btn lime" to="/dashboard">{t('My NOVA')} →</Link>:<><Link className="btn lime" to="/register">{t('Create my NOVA membership')}</Link><Link className="btn white" to="/login">{t('Log in')}</Link></>}</div></section></Reveal>

 {/* 18 · FAQ */}
 <Sec id="faq" label={t('FAQ')} title={t('Questions? Answered.')}>{D.FAQ.map(([q,a],i)=><div key={q} className="faq"><button aria-expanded={faq===i} onClick={()=>setFaq(faq===i?-1:i)}>{q}<span>{faq===i?'−':'+'}</span></button><motion.div initial={false} animate={{height:faq===i?'auto':0}} style={{overflow:'hidden'}}><p>{a}</p></motion.div></div>)}</Sec>

 {/* Final call to action */}
 <motion.section className="final" initial={{scale:.92,opacity:0}} whileInView={{scale:1,opacity:1}} viewport={{once:true}} transition={{duration:1}}><span className="lab">{t('JOIN PROJECT NOVA')}</span><h2>{t('Your journey is just')} <span className="hi">{t('beginning.')}</span></h2>
  <p>{t('Learn something new. Meet new people. Build something meaningful. Help someone. Discover yourself.')}</p><Link className="btn lime" to={u?'/dashboard':'/register'}>{u?t('My NOVA')+' →':t('Become a NOVA member →')}</Link><small>{t('It’s free. It’s your community. It’s your journey.')}</small></motion.section>

 <Modal open={!!ev} onClose={()=>setEv(null)} title={ev?.name}>{ev&&<div className="evd"><span className="pill lime">{ev.cat}</span><h2>{ev.name}</h2><p>{ev.desc||'Details will be shared with registered members.'}</p>
  <p>📅 {ev.date} • {ev.time}<br/>📍 {ev.loc}<br/>🎟️ {ev.seats}<br/>👥 {D.regCount('event',ev.name)} registered</p>
  <div className="row"><RegBtn kind="event" name={ev.name} label="Register →" cls="btn"/><Share text={`Check out "${ev.name}" on Project NOVA`}/></div></div>}</Modal>
 </>}