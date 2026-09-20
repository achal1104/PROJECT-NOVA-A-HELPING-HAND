import {useState,useEffect,Component} from 'react'
import {Routes,Route,Link,useLocation} from 'react-router-dom'
import {motion,useScroll} from 'framer-motion'
import {Cursor,waLink} from './ui'
import {NAV,currentUser} from './data'
import {useT,LANGS} from './i18n'
import Home from './pages/Home'
import {Register,Login} from './pages/Auth'
import {Dashboard,Profile} from './pages/Panels'
import {Admin} from './pages/Admin'
import {About,Courses,Science,Notes,Workshops,Careers,Community,Contact,NotFound} from './pages/More'
import {Terms,Privacy} from './pages/Legal'

// Use react-router's Link even for hash links (e.g. "/#events") so clicking them does an
// in-app navigation instead of a full page reload.
const L=({to,children,...p})=><Link to={to} {...p}>{children}</Link>
// Safety net: if any page ever throws, show a recoverable message instead of a blank white screen.
class Boundary extends Component{
 constructor(p){super(p);this.state={err:false}}
 static getDerivedStateFromError(){return {err:true}}
 componentDidCatch(e){console.error(e)}
 componentDidUpdate(p){if(p.pathname!==this.props.pathname&&this.state.err)this.setState({err:false})}
 render(){return this.state.err?<div className="page"><h1>Something went wrong.</h1><p>This page hit an error. Try going back to the homepage.</p><Link className="btn" to="/">Back to Home</Link></div>:this.props.children}}

// Logged-in navigation (section 27 of the brief)
const MEM=[['Dashboard','/dashboard'],['Learning','/#learning'],['Courses','/courses'],['Notes','/notes'],['Science Projects','/science'],['Events','/#events'],['Workshops','/workshops'],['Industrial Visits','/#visits'],['Community','/community'],['Helping Hands','/#help'],['Business','/#business'],['My Profile','/profile']]
const BOT=[['🏠','Home','/'],['📚','Learn','/courses'],['🌱','Community','/community'],['🎯','Events','/#events'],['👤','Profile','/profile']]
const FOOT=[['Quick links',[['About','/about'],['Learning','/courses'],['Events','/#events'],['Community','/community'],['Business','/#business'],['Helping Hands','/#help']]],['Student resources',[['Notes','/notes'],['Courses','/courses'],['Science Projects','/science'],['Workshops','/workshops']]],['Community',[['Food Drive','/#food'],['Tree Plantation','/#tree'],['Industrial Visits','/#visits'],['Volunteer','/#help']]],['Support',[['Contact','/contact'],['FAQ','/#faq'],['Terms','/terms'],['Privacy Policy','/privacy']]]]

export default function App(){
 const {t,lang,setLang}=useT(),[open,setOpen]=useState(false),[ip,setIp]=useState(null),loc=useLocation(),{scrollYProgress}=useScroll(),inn=!!currentUser()
 useEffect(()=>{const h=e=>{e.preventDefault();setIp(e)};addEventListener('beforeinstallprompt',h);return()=>removeEventListener('beforeinstallprompt',h)},[])
 useEffect(()=>{
  if(!loc.hash){window.scrollTo(0,0);return}
  // Wait for the newly routed page to mount, retrying briefly until the target section exists.
  let tries=0,cancelled=false
  const tryScroll=()=>{
   if(cancelled)return
   const el=document.getElementById(decodeURIComponent(loc.hash.slice(1)))
   if(el){el.scrollIntoView({behavior:'smooth',block:'start'})}
   else if(tries++<20){setTimeout(tryScroll,50)}
  }
  const tm=setTimeout(tryScroll,50)
  return ()=>{cancelled=true;clearTimeout(tm)}
 },[loc.pathname,loc.hash])
 const close=()=>setOpen(false)
 return <>
  <motion.div className="prog" style={{scaleX:scrollYProgress}}/><Cursor/>
  <div className="wrap"><header className={'top'+(inn?' many':'')}><Link to="/" className="logo" onClick={close}><i/>nova<small>A HELPING HAND</small></Link>
   <nav className={open?'open':''} aria-label="Main">{(inn?MEM:NAV).map(([n,h])=><L key={n} to={h} onClick={close}>{t(n)}</L>)}
    {!inn&&<><L className="mob navjoin" to="/register" onClick={close}>{t('Join NOVA – free')}</L><L className="mob" to="/login" onClick={close}>{t('Log in')}</L></>}</nav>
   <div className="acts"><div className="lang" role="group" aria-label="Language">{LANGS.map(([c,l])=><button key={c} className={lang===c?'on':''} aria-pressed={lang===c} onClick={()=>setLang(c)}>{l}</button>)}</div>
    {!inn&&<Link className="login" to="/login">{t('Log in')}</Link>}
    <Link className="btn lime" to={inn?'/dashboard':'/register'}>{inn?t('My NOVA'):t('Join NOVA – free')}</Link>
    <button className="burger" aria-label="Menu" aria-expanded={open} onClick={()=>setOpen(!open)}>☰</button></div></header>
  <main><Boundary pathname={loc.pathname}><motion.div key={loc.pathname} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.35}}>
   <Routes><Route path="/" element={<Home/>}/><Route path="/register" element={<Register/>}/><Route path="/login" element={<Login/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/profile" element={<Profile/>}/><Route path="/admin" element={<Admin/>}/><Route path="/about" element={<About/>}/><Route path="/courses" element={<Courses/>}/><Route path="/notes" element={<Notes/>}/><Route path="/science" element={<Science/>}/><Route path="/workshops" element={<Workshops/>}/><Route path="/careers" element={<Careers/>}/><Route path="/community" element={<Community/>}/><Route path="/contact" element={<Contact/>}/><Route path="/terms" element={<Terms/>}/><Route path="/privacy" element={<Privacy/>}/><Route path="*" element={<NotFound/>}/></Routes></motion.div></Boundary></main>
  <footer className="foot"><div><b>PROJECT NOVA</b><br/>A Helping Hand<p>Learn. Grow. Build. Help.</p>
    <a href={waLink('Join Project NOVA – free learning, workshops, industrial visits and community drives for students in Maharashtra! '+location.origin)} target="_blank" rel="noopener noreferrer">💬 {t('Share on WhatsApp')}</a>
    {ip&&<button className="btn sm" onClick={()=>{ip.prompt();setIp(null)}}>📲 {t('Install NOVA app')}</button>}</div>
   {FOOT.map(([h,ls])=><div key={h}><b>{t(h)}</b>{ls.map(([n,to])=><L key={n} to={to}>{t(n)}</L>)}</div>)}
   <small>© 2026 Project NOVA – A Helping Hand. All Rights Reserved.</small></footer></div>
  {inn&&<div className="bnav" role="navigation" aria-label="Quick">{BOT.map(([e,n,h])=><L key={n} to={h}><span>{e}</span>{t(n)}</L>)}</div>}</>}