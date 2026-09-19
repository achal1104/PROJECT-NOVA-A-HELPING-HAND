import {useEffect,useRef,useState} from 'react'
import {motion,useInView,useMotionValue,useSpring} from 'framer-motion'
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
