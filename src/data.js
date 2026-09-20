export const K=['peach','lav','lime','blue']

/* ---------- safe localStorage helpers (never crash the app) ---------- */
export const ls=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch{return d}}
export const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){console.warn('Storage full or blocked',e)}return v}

/* ---------- images ----------
   Drop photos in /public/images and put the path here, e.g. hero:'/images/hero.jpg'.
   Empty = a coloured illustration is shown instead. */
export const IMG={hero:'',course:'',science:'','Food Drive':'','Tree Plantation Drive':'','NOVA Movie Drive':'','Community Support':'','Helping Hand Campaign':'',visit:''}

/* ---------- members / session ---------- */
export const getUsers=()=>ls('nova_users',[])
export const saveUsers=u=>put('nova_users',u)
export const currentUser=()=>{let s=null;try{s=localStorage.getItem('nova_session')}catch{}if(!s)return null;const u=getUsers().find(x=>x.id===s);return u&&u.active!==false?u:null}
export const startSession=id=>{try{localStorage.setItem('nova_session',id)}catch{}}
export const endSession=()=>{try{localStorage.removeItem('nova_session')}catch{}}
export const nextMemberId=()=>'NOVA-MH-'+String(getUsers().reduce((m,u)=>Math.max(m,parseInt(String(u.id).split('-').pop(),10)||0),0)+1).padStart(6,'0')
export const updateUser=(id,patch)=>{const us=getUsers().map(u=>u.id===id?{...u,...patch}:u);saveUsers(us);return us.find(u=>u.id===id)}

/* ---------- admin-managed content (frontend-only, stored per-browser) ---------- */
export const adminList=k=>ls('admin_'+k,[])
export const adminAdd=(k,item)=>put('admin_'+k,[...adminList(k),{...item,_id:Date.now()+'-'+Math.random().toString(36).slice(2)}])
export const adminRemove=(k,id)=>put('admin_'+k,adminList(k).filter(x=>x._id!==id))
export const getStats=()=>ls('admin_stats',null)
export const setStats=v=>put('admin_stats',v)
export const resetStats=()=>{try{localStorage.removeItem('admin_stats')}catch{}}

/* ---------- per-member registrations, course progress, journey log ---------- */
export const getRegs=id=>ls('nova_regs_'+id,[])
export const addReg=(id,item)=>{const l=getRegs(id);if(l.some(x=>x.name===item.name&&x.kind===item.kind))return l;return put('nova_regs_'+id,[...l,{...item,at:Date.now()}])}
export const removeReg=(id,kind,name)=>put('nova_regs_'+id,getRegs(id).filter(x=>!(x.kind===kind&&x.name===name)))
export const regUsers=(kind,name)=>getUsers().filter(u=>getRegs(u.id).some(r=>r.kind===kind&&r.name===name))
export const regCount=(kind,name)=>regUsers(kind,name).length
export const getCP=id=>ls('nova_cp2_'+id,{})            // { courseTitle:[completed lesson numbers] }
export const setCP=(id,v)=>put('nova_cp2_'+id,v)
export const pct=(cp,title,n)=>n?Math.min(100,Math.round(((cp[title]||[]).length/n)*100)):0
export const getJ=id=>ls('nova_j2_'+id,{})              // self-logged activities
export const setJ=(id,v)=>put('nova_j2_'+id,v)

/* ---------- static copy ---------- */
export const NAV=[['Home','/'],['About NOVA','/about'],['Learning','/courses'],['Community','/community'],['Events','/#events'],['Business','/#business'],['Helping Hands','/#help'],['Contact','/contact']]
export const LGBH=[['Learn','Free educational resources and study support.'],['Grow','Communication, personality development and practical skills.'],['Build','Entrepreneurship, business workshops and real-world exposure.'],['Help','Community initiatives that allow students to give back to society.']]
export const HUB=[['📚','Free Notes','Subject-wise notes and study materials.','/notes'],['🗣️','English Speaking','Free English communication courses.','/courses'],['🔬','Science Projects','Project ideas, explanations and guidance.','/science'],['🧠','Personality Development','Confidence, communication and leadership.','/courses'],['💼','Business Basics','Introduction to entrepreneurship and business thinking.','/courses'],['🎯','Career Exploration','Explore career paths after 11th and 12th Science.','/careers']]
export const BIZ=[['💡','Business Building Workshops','Offline workshops on problem solving, marketing, sales, finance basics and leadership.'],['🏭','Industrial Visits','Visit companies, factories, startups and businesses.'],['🚀','Startup Exposure','Understand how real businesses are created.'],['🤝','Community Business','Collaborate on small community-based business ideas.']]
export const WORKSHOP_TOPICS=['Business ideas','Problem solving','Marketing','Sales','Finance basics','Entrepreneurship','Leadership']
export const COMM=['Student community','Discussion groups','Events','Workshops','Team activities','Project collaboration','Volunteer opportunities','Networking','Community challenges']
export const WHY=['Free Notes','Free English Speaking Course','Free Personality Development Programs','Free Science Project Guidance','Free Business Workshops','Industrial Visit Opportunities','Community Activities','Food Drives','Tree Plantation Drives','Student Networking','Entrepreneurship Exposure','Events & Experiences','Opportunities to Volunteer']
export const STATS=[[100,'%','Free learning resources'],[10,'+','Learning & development programs'],[1000,'+','Students goal'],['∞','','Opportunities to learn & help']]
export const FAQ=[['Is Project NOVA really free?','Yes. Membership and all learning resources are completely free.'],['Who can join?','Mainly 11th Science students in Maharashtra. 12th and college students are welcome too.'],['Do I need to attend everything?','No. Join what interests you: learning, workshops, visits or drives.'],['How do I register for a visit?','Become a member, then register from the Events section.'],['Which languages are supported?','English and Marathi today, with Hindi planned.']]

/* ---------- courses ---------- */
export const CAT_EMOJI={English:'🗣️','Personality Development':'🧠',Business:'💼'}
export const LIB={English:[['Spoken English – Beginner','NOVA Mentors','4 weeks',12],['Conversation Practice','NOVA Mentors','3 weeks',10],['Vocabulary Builder','NOVA Mentors','3 weeks',9],['Public Speaking','Guest Mentor','3 weeks',8]],'Personality Development':[['Confidence','NOVA Mentors','2 weeks',6],['Communication','NOVA Mentors','3 weeks',8],['Leadership','Guest Mentor','3 weeks',8],['Time Management','NOVA Mentors','2 weeks',6],['Presentation Skills','NOVA Mentors','2 weeks',7],['Teamwork','NOVA Mentors','2 weeks',6]],Business:[['Business Basics','Guest Mentor','2 weeks',8],['Marketing','Guest Mentor','3 weeks',9],['Sales','Guest Mentor','2 weeks',7],['Finance Basics','Guest Mentor','3 weeks',8],['Entrepreneurship','Guest Mentor','4 weeks',12]]}
export const allLib=()=>{const m={};Object.entries(LIB).forEach(([cat,l])=>{m[cat]=l.map(([title,by,du,n])=>({title,by,du,n,cat}))});adminList('courses').forEach(c=>{(m[c.cat]=m[c.cat]||[]).push({title:c.title,by:c.by||'NOVA Mentors',du:c.du||'—',n:Math.max(1,+c.n||1),cat:c.cat,video:c.video,pdf:c.pdf})});return m}
export const HOME_COURSES=['Spoken English – Beginner','Confidence','Business Basics','Public Speaking']

/* ---------- notes ---------- */
export const SUBJECTS=['Physics','Chemistry','Biology','Mathematics','English']
export const CLASSES=['11th','12th']
export const allNotes=()=>adminList('notes')

/* ---------- science projects ---------- */
export const SCI_CATS=['Physics','Chemistry','Biology','Environmental Science','Technology','Innovation','Electronics','Computer Science']
const S=(name,cat,diff,cost,mats,concept,steps,safety,result)=>({name,cat,diff,cost,mats,concept,steps,safety,result})
export const SCI=[
S('Solar Water Heater','Physics','Easy','₹300',['Plastic bottle','Black paint','Foil'],'Dark surfaces absorb sunlight and warm the water inside.',['Paint the bottle black','Add a foil reflector','Place in sunlight','Note the temperature every 15 minutes'],'Hot water can burn. Use gloves and adult supervision.','Water warms several degrees in an hour of sun.'),
S('Natural pH Indicator','Chemistry','Easy','₹100',['Red cabbage','Warm water','Lemon juice','Baking soda'],'Cabbage pigment changes colour with acidity.',['Soak chopped cabbage in warm water','Strain the liquid','Add drops of lemon juice and baking-soda water','Compare colours'],'Use only kitchen items. Do not taste test liquids.','Acids turn it pink-red, bases turn it green-blue.'),
S('Seed Germination Study','Biology','Easy','₹50',['Beans','Cotton','Cups','Water'],'Seeds need water, air and warmth to sprout.',['Place beans on wet cotton in cups','Keep one in light and one in dark','Water daily','Record growth'],'Wash hands after handling soil.','Seeds in light and dark grow differently.'),
S('Rainwater Harvesting Model','Environmental Science','Medium','₹200',['Cardboard','Plastic sheet','Bottles','Sand'],'Collected rain can recharge groundwater.',['Build a roof from plastic sheet','Direct water into a bottle','Filter with sand layers','Measure collected water'],'Use blunt tools and supervision for cutting.','Measurable volume of collected water.'),
S('Paper Bridge Load Test','Technology','Easy','₹50',['Paper','Tape','Coins'],'Shape and folds change how much load a structure holds.',['Make flat, folded and tube bridges','Add coins one by one','Record the load at failure'],'Keep hands clear when a bridge collapses.','Folded or tube shapes hold more.'),
S('Foot-Pedal Hand-Wash Station','Innovation','Medium','₹400',['Bucket','Tap','Pedal lever','Rope'],'Hands-free design reduces touching shared surfaces.',['Fix tap to bucket','Connect pedal with rope','Test water flow','Improve the design'],'Secure the bucket so it cannot tip.','Water flows only while the pedal is pressed.'),
S('Water-Level Alarm','Electronics','Medium','₹250',['9V battery','Buzzer','Wires','Container'],'Water completes a low-voltage circuit and sounds a buzzer.',['Connect buzzer and battery with two open wire ends','Place ends at the desired level','Fill with water slowly'],'Low-voltage only. Never use mains electricity.','Buzzer sounds when water touches both wires.'),
S('Python Quiz Game','Computer Science','Easy','₹0',['Computer','Python'],'Loops and conditions turn questions into a game.',['Write 5 questions in a list','Loop through and check answers','Show the score'],'Take screen breaks.','A working quiz with a final score.')]
const lines=s=>String(s||'').split(/\r?\n|,/).map(x=>x.trim()).filter(Boolean)
export const allSci=()=>[...SCI,...adminList('science').map(x=>({name:x.name,cat:x.cat||'Innovation',diff:x.diff||'Easy',cost:x.cost||'—',mats:lines(x.mats),concept:x.concept||'',steps:String(x.steps||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean),safety:x.safety||'Ask an adult or teacher before you start.',result:x.result||''}))]

/* ---------- events, visits, drives ---------- */
export const CATS=['All','Education','Business','Industrial Visit','Social Impact','Entertainment','Community','Workshops']
const E=(name,cat,date,time,loc,seats,desc)=>({name,cat,date,time,loc,seats,desc})
export const EVENTS=[
E('Business Building Workshop','Business','Date TBA','10:30 AM','Pune','Seats available','Offline workshop on business ideas, problem solving, marketing, sales and finance basics.'),
E('Spoken English Kickoff','Education','Date TBA','4:00 PM','Online','Open','Meet your mentors and start the free Spoken English course together.'),
E('Tree Plantation Drive','Social Impact','Date TBA','7:30 AM','Satara','60 seats','Plant trees with fellow NOVA members and learn how to look after them.'),
E('Industrial Visit – Manufacturing','Industrial Visit','Coming soon','9:00 AM','Pune','Limited','See how a real manufacturing unit works, from raw material to finished product.'),
E('NOVA Movie Day','Entertainment','Date TBA','5:00 PM','Kolhapur','Open','A community movie experience where NOVA members come together.'),
E('Science Project Clinic','Workshops','Date TBA','11:00 AM','Sangli','30 seats','Bring your project idea and get hands-on guidance from mentors.')]
export const allEvents=()=>[...EVENTS,...adminList('events'),...adminList('workshops').map(w=>({...w,cat:'Workshops'}))]
export const isWorkshop=e=>e.cat==='Workshops'||/workshop/i.test(e.name)
export const VISITS=[
{name:'Manufacturing Industry',type:'Industrial Visit',loc:'Pune',date:'Coming soon',seats:'Limited student seats',el:'11th–12th Science',past:false},
{name:'Food Processing Unit',type:'Industrial Visit',loc:'Satara',date:'Coming soon',seats:'40 seats',el:'11th–12th Science',past:false},
{name:'Local Startup Studio',type:'Startup Visit',loc:'Kolhapur',date:'Previous visit',seats:'Completed',el:'All members',past:true}]
export const allVisits=()=>[...VISITS,...adminList('visits').map(v=>({...v,type:v.type||'Industrial Visit',past:v.past===true||v.past==='Completed'}))]
export const DRIVE_KINDS=['Food Drive','Tree Plantation Drive','NOVA Movie Drive','Community Support','Helping Hand Campaign']
export const DRIVE_EMOJI={'Food Drive':'🍱','Tree Plantation Drive':'🌱','NOVA Movie Drive':'🎬','Community Support':'🤝','Helping Hand Campaign':'❤️'}
export const DRIVES=[
{kind:'Food Drive',name:'Food Drive',desc:'Organise food collection and distribution for people who need support.',date:'Date TBA',loc:'Maharashtra',cap:''},
{kind:'Tree Plantation Drive',name:'Tree Plantation Drive',desc:'Plant trees and join environmental activities.',date:'Date TBA',loc:'Maharashtra',cap:''},
{kind:'NOVA Movie Drive',name:'NOVA Movie Drive',desc:'Community movie experiences where members come together.',date:'Date TBA',loc:'Maharashtra',cap:''},
{kind:'Community Support',name:'Community Support',desc:'Student-led initiatives to help people and communities.',date:'Date TBA',loc:'Maharashtra',cap:''},
{kind:'Helping Hand Campaign',name:'Helping Hand Campaigns',desc:'Special campaigns and volunteering activities.',date:'Date TBA',loc:'Maharashtra',cap:''}]
export const allDrives=()=>[...DRIVES,...adminList('drives').map(d=>({...d,kind:d.kind||'Community Support'}))]
export const joined=d=>`${regCount('help',d.name)} joined${d.cap?' / '+d.cap+' spots':''}`

/* ---------- careers ---------- */
export const CAREERS=[
['🛠️','Engineering & Technology','B.E. / B.Tech in Computer, Mechanical, Electrical, Civil, Electronics and more.','JEE Main / Advanced, MHT-CET'],
['🩺','Medicine & Health Sciences','MBBS, BDS, BAMS, BHMS, nursing and allied health courses.','NEET-UG'],
['🔬','Pure & Research Sciences','B.Sc and integrated programmes in Physics, Chemistry, Biology and Maths — a path into research.','CUET-UG, IISER Aptitude Test, NEST'],
['💊','Pharmacy','B.Pharm and D.Pharm leading to pharma industry, research and healthcare.','MHT-CET and state pharmacy admissions'],
['🏛️','Architecture & Design','B.Arch and design programmes for people who love drawing, maths and creativity.','NATA, JEE Main Paper 2, UCEED / NID DAT'],
['🌾','Agriculture & Environment','B.Sc Agriculture, forestry, food technology and environmental science.','MHT-CET, CUET-UG, state admissions'],
['💼','Business & Management','Science students can also move into BBA, BMS, economics and entrepreneurship.','CUET-UG, IPMAT and institute tests'],
['🛡️','Defence & Public Service','NDA, technical entry schemes, and civil services after graduation.','NDA (UPSC), later UPSC / MPSC']]

/* ---------- points, journey, badges ---------- */
export const POINTS=[['Complete course',10],['Attend workshop',20],['Join tree plantation',30],['Food drive',30],['Industrial visit',25],['Help organise an event',50]]
export const JR=[['Courses completed',10],['Workshops attended',20],['Tree plantation drives',30],['Food drives',30],['Industrial visits',25],['Events organised',50]]
export const BADGES=[
['🌱 Environment Champion',m=>m.cnt('Tree plantation drives')>0],
['🤝 Helping Hand',m=>m.cnt('Food drives')>0],
['💡 Young Entrepreneur',m=>m.cnt('Workshops attended')>0],
['📚 Learning Star',m=>m.cnt('Courses completed')>0],
['🎯 Active Member',m=>m.pts>=50],
['🚀 NOVA Leader',m=>m.pts>=150]]

/* ---------- registration options ---------- */
export const CLASS_OPTS=['11th','12th','College','Other']
export const STREAM_OPTS=['Science','Commerce','Arts','Other']
export const BOARD_OPTS=['Maharashtra State Board','CBSE','ICSE','Other']
export const INTERESTS=['Free notes','English speaking','Personality development','Science projects','Business & startups','Industrial visits','Tree plantation','Food drives','Volunteering','Career guidance']
export const DISTRICTS=['Ahilyanagar','Akola','Amravati','Beed','Bhandara','Buldhana','Chandrapur','Chhatrapati Sambhajinagar','Dharashiv','Dhule','Gadchiroli','Gondia','Hingoli','Jalgaon','Jalna','Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded','Nandurbar','Nashik','Palghar','Parbhani','Pune','Raigad','Ratnagiri','Sangli','Satara','Sindhudurg','Solapur','Thane','Wardha','Washim','Yavatmal']
export const GROUPS=['Science Projects Circle','English Speaking Club','Young Entrepreneurs','Green Team (trees & food drives)','Career Talk']