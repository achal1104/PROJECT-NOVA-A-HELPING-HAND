import {useState,useEffect,Component} from 'react'
import {Routes,Route,Link,useLocation} from 'react-router-dom'
import {motion,useScroll} from 'framer-motion'
import {Cursor} from './ui'
import {NAV} from './data'
import Home from './pages/Home'
import {Register,Login} from './pages/Auth'
import {Dashboard,Admin} from './pages/Panels'
import {About,Courses,Science,Community,Contact} from './pages/More'
// Use react-router's Link even for hash links (e.g. "/#events") so clicking them does an
// in-app navigation instead of a full page reload. A full reload was landing users back at
// the top of the homepage instead of the section they clicked (Events/Business/Helping Hands).
const L=({to,children,...p})=><Link to={to} {...p}>{children}</Link>
// Safety net: if any page ever throws (e.g. bad data), show a recoverable message
// instead of letting the whole app unmount into a blank white screen.
class Boundary extends Component{
 constructor(p){super(p);this.state={err:false}}
 static getDerivedStateFromError(){return {err:true}}
 componentDidCatch(e){console.error(e)}
 componentDidUpdate(p){if(p.pathname!==this.props.pathname&&this.state.err)this.setState({err:false})}
 render(){return this.state.err?<div className="page"><h1>Something went wrong.</h1><p>This page hit an error. Try going back to the homepage.</p><Link className="btn" to="/">Back to Home</Link></div>:this.props.children}}
const MEM=[['Home','/'],['Dashboard','/dashboard'],['Courses','/courses'],['Notes','/courses#notes'],['Science Projects','/science'],['Events','/#events'],['Workshops','/#events'],['Industrial Visits','/#visits'],['Community','/community'],['Business','/#business'],['Helping Hands','/#help'],['My Profile','/dashboard']]
const BOT=[['🏠','Home','/'],['📚','Learn','/courses'],['🌱','Community','/community'],['🎯','Events','/#events'],['👤','Profile','/dashboard']]
const FOOT=[['Quick links',[['About','/about'],['Learning','/courses'],['Events','/#events'],['Community','/community'],['Business','/#business'],['Helping Hands','/#help']]],['Student resources',[['Notes','/courses'],['Courses','/courses'],['Science Projects','/science'],['Workshops','/#events']]],['Community',[['Food Drive','/#help'],['Tree Plantation','/#help'],['Industrial Visits','/#business'],['Volunteer','/community']]],['Support',[['Contact','/contact'],['FAQ','/#faq'],['Terms','/contact'],['Privacy Policy','/contact']]]]
export default function App(){
 const [open,setOpen]=useState(false),loc=useLocation(),{scrollYProgress}=useScroll(),inn=!!localStorage.getItem('nova_session')
 useEffect(()=>{
  if(!loc.hash){window.scrollTo(0,0);return}
  // Wait a tick for the newly routed page's content to mount before trying to scroll to
  // the section, retrying briefly since the element may not exist on the very first tick.
  let tries=0,cancelled=false
  const tryScroll=()=>{
   if(cancelled)return
   const el=document.getElementById(loc.hash.slice(1))
   if(el){el.scrollIntoView({behavior:'smooth',block:'start'})}
   else if(tries++<20){setTimeout(tryScroll,50)}
  }
  const t=setTimeout(tryScroll,50)
  return ()=>{cancelled=true;clearTimeout(t)}
 },[loc.pathname,loc.hash])
 return <>
  <motion.div className="prog" style={{scaleX:scrollYProgress}}/><Cursor/>
  <div className="wrap"><header className="top"><Link to="/" className="logo"><i/>nova<small>A HELPING HAND</small></Link>
   <nav className={open?'open':''}>{(inn?MEM:NAV).map(([n,h])=><L key={n} to={h} onClick={()=>setOpen(false)}>{n}</L>)}</nav>
   <Link className="btn lime" to={inn?'/dashboard':'/register'}>{inn?'My NOVA':'Join NOVA – free'}</Link><button className="burger" aria-label="Menu" onClick={()=>setOpen(!open)}>☰</button></header>
  <main><Boundary pathname={loc.pathname}><Routes><Route path="/" element={<Home/>}/><Route path="/register" element={<Register/>}/><Route path="/login" element={<Login/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/admin" element={<Admin/>}/><Route path="/about" element={<About/>}/><Route path="/courses" element={<Courses/>}/><Route path="/science" element={<Science/>}/><Route path="/community" element={<Community/>}/><Route path="/contact" element={<Contact/>}/></Routes></Boundary></main>
  <footer className="foot"><div><b>PROJECT NOVA</b><br/>A Helping Hand<p>Learn. Grow. Build. Help.</p></div>
   {FOOT.map(([t,ls])=><div key={t}><b>{t}</b>{ls.map(([n,h])=><L key={n} to={h}>{n}</L>)}</div>)}
   <small>© 2026 Project NOVA – A Helping Hand. All Rights Reserved.</small></footer></div>
  {inn&&<div className="bnav">{BOT.map(([e,n,h])=><L key={n} to={h}><span>{e}</span>{n}</L>)}</div>}</>}