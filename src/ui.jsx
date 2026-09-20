import {useEffect,useRef,useState} from 'react'
import {createPortal} from 'react-dom'
import {Link} from 'react-router-dom'
import {motion,useInView,useMotionValue,useSpring} from 'framer-motion'
import {currentUser,getRegs,addReg} from './data'
import {useT} from './i18n'

export const Reveal=({children,d=0,className='',x=0})=>(
 <motion.div className={className} initial={{opacity:0,y:50,x,filter:'blur(8px)'}} whileInView={{opacity:1,y:0,x:0,filter:'blur(0px)'}} viewport={{once:true,margin:'-60px'}} transition={{duration:.8,delay:d,ease:[.2,.8,.2,1]}}>{children}</motion.div>)
export function Tilt({children,className=''}){
 const rx=useSpring(useMotionValue(0),{stiffness:150,damping:15}),ry=useSpring(useMotionValue(0),{stiffness:150,damping:15})
 const mv=e=>{const r=e.currentTarget.getBoundingClientRect();ry.set(((e.clientX-r.left)/r.width-.5)*10);rx.set(-((e.clientY-r.top)/r.height-.5)*10)}
 return <motion.div className={className} style={{rotateX:rx,rotateY:ry,transformPerspective:900}} onMouseMove={mv} onMouseLeave={()=>{rx.set(0);ry.set(0)}} whileHover={{y:-6}}>{children}</motion.div>}
export function Count({to,suffix=''}){
 const ref=useRef(),on=useInView(ref,{once:true}),[v,setV]=useState(0)
 useEffect(()=>{if(!on||typeof to!=='number')return;let s;const f=t=>{s??=t;const p=Math.min((t-s)/1600,1);setV(Math.round(to*(1-(1-p)**3)));p<1&&requestAnimationFrame(f)};requestAnimationFrame(f)},[on,to])
 return <span ref={ref}>{typeof to==='number'?v:to}{suffix}</span>}
export const Sec=({id,label,title,children,className=''})=>(
 <section id={id} className={'sec '+className}><Reveal><span className="lab">{label}</span><h2>{title}</h2></Reveal>{children}</section>)

export function Magnetic({children}){
 const x=useSpring(useMotionValue(0),{stiffness:200,damping:15}),y=useSpring(useMotionValue(0),{stiffness:200,damping:15})
 return <motion.span style={{x,y,display:'inline-block'}} onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();x.set((e.clientX-r.left-r.width/2)*.3);y.set((e.clientY-r.top-r.height/2)*.3)}} onMouseLeave={()=>{x.set(0);y.set(0)}}>{children}</motion.span>}
export function Cursor(){
 const x=useSpring(useMotionValue(-200),{stiffness:250,damping:28}),y=useSpring(useMotionValue(-200),{stiffness:250,damping:28}),[h,setH]=useState(false)
 useEffect(()=>{if(matchMedia('(hover:none)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return
  const m=e=>{x.set(e.clientX);y.set(e.clientY);setH(!!e.target.closest('a,button,.card'))};addEventListener('mousemove',m);return()=>removeEventListener('mousemove',m)},[])
 return <><motion.div className="cglow" style={{x,y}}/><motion.div className={'cdot'+(h?' h':'')} style={{x,y}}/></>}
export const Marquee=({items})=><div className="marq" aria-hidden="true"><div>{[...items,...items].map((t,i)=><span key={i}>{t}<b>✦</b></span>)}</div></div>

/* Image slot: shows the photo if a path is given (and loads), otherwise a coloured illustration. */
export function Media({src,emoji='✨',tone='lime',alt='',className=''}){
 const [bad,setBad]=useState(false)
 return <div className={'media '+tone+' '+className}>{src&&!bad?<img src={src} alt={alt} loading="lazy" onError={()=>setBad(true)}/>:<span aria-hidden="true">{emoji}</span>}</div>}

/* Accessible modal: Esc / backdrop click closes, page scroll is locked while open. */
export function Modal({open,onClose,title,children}){
 useEffect(()=>{if(!open)return;const k=e=>e.key==='Escape'&&onClose();addEventListener('keydown',k);const o=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{removeEventListener('keydown',k);document.body.style.overflow=o}},[open,onClose])
 if(!open)return null
 return createPortal(<div className="ov" onClick={onClose}><motion.div className="modal" role="dialog" aria-modal="true" aria-label={title} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} onClick={e=>e.stopPropagation()}><button type="button" className="x" aria-label="Close" onClick={onClose}>✕</button>{children}</motion.div></div>,document.body)}

/* WhatsApp share (works on phones and WhatsApp Web) */
export const waLink=text=>'https://wa.me/?text='+encodeURIComponent(text)
export function Share({text,label}){
 const {t}=useT()
 return <a className="btn sm wa" href={waLink(text+' '+location.origin)} target="_blank" rel="noopener noreferrer">💬 {label||t('Share on WhatsApp')}</a>}

/* Register / Join button. Signed-out visitors go to /register; members are registered instantly
   and it shows up under "My registrations" on their dashboard. */
export function RegBtn({kind,name,label='Register →',cls='btn sm'}){
 const {t}=useT(),u=currentUser()
 const [done,setDone]=useState(()=>!!(u&&getRegs(u.id).some(r=>r.name===name&&r.kind===kind)))
 if(!u)return <Link className={cls} to="/register">{t(label)}</Link>
 return <button type="button" className={cls} disabled={done} onClick={()=>{addReg(u.id,{kind,name});setDone(true)}}>{done?t('Registered ✓'):t(label)}</button>}

/* Resize a chosen profile photo to a small JPEG so it can be stored safely. */
export const shrinkPhoto=file=>new Promise((res,rej)=>{
 if(!file)return res('')
 if(!file.type.startsWith('image/'))return rej(new Error('Please choose an image file.'))
 if(file.size>4*1024*1024)return rej(new Error('Photo must be under 4 MB.'))
 const r=new FileReader();r.onerror=()=>rej(new Error('Could not read the photo.'))
 r.onload=()=>{const im=new Image();im.onerror=()=>rej(new Error('Could not read the photo.'))
  im.onload=()=>{const k=Math.min(1,256/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.8))}
  im.src=r.result}
 r.readAsDataURL(file)})