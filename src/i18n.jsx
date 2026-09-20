import {createContext,useContext,useState,useCallback,useEffect} from 'react'

/* How it works: wrap any English text in t('...'). If a translation exists in the
   dictionary for the chosen language it is shown, otherwise the English text is used.
   To translate more of the site, just add more 'English text': 'translation' pairs. */
export const LANGS=[['en','EN'],['mr','मराठी']]   // add ['hi','हिन्दी'] and a DICT.hi block for Hindi

const DICT={
 mr:{
  'Home':'मुख्यपृष्ठ','About NOVA':'नोव्हाबद्दल','Learning':'शिक्षण','Community':'समुदाय','Events':'कार्यक्रम','Business':'व्यवसाय','Helping Hands':'मदतीचे हात','Contact':'संपर्क',
  'Dashboard':'डॅशबोर्ड','Courses':'अभ्यासक्रम','Notes':'नोट्स','Science Projects':'विज्ञान प्रकल्प','Workshops':'कार्यशाळा','Industrial Visits':'औद्योगिक भेटी','My Profile':'माझी प्रोफाइल','Learn':'शिका','Profile':'प्रोफाइल',
  'Join NOVA – free':'नोव्हामध्ये सामील व्हा – मोफत','Log in':'लॉग इन','My NOVA':'माझे नोव्हा',
  '🌱 Free for 11th Science students in Maharashtra':'🌱 महाराष्ट्रातील ११वी विज्ञान विद्यार्थ्यांसाठी मोफत',
  'Your Future Starts Beyond the Classroom.':'तुमचं भविष्य वर्गाच्या पलीकडे सुरू होतं.',
  'Project NOVA gives Maharashtra’s students free access to learning resources, skill development, entrepreneurship experiences and opportunities to make a difference in their community.':'प्रोजेक्ट नोव्हा महाराष्ट्रातील विद्यार्थ्यांना मोफत शिक्षण साहित्य, कौशल्य विकास, उद्योजकतेचे अनुभव आणि आपल्या समाजात बदल घडवण्याच्या संधी देतो.',
  'Join Project NOVA – It’s free →':'प्रोजेक्ट नोव्हामध्ये सामील व्हा – मोफत →','Explore NOVA ↓':'नोव्हा एक्सप्लोर करा ↓',
  'Free learning resources':'मोफत शिक्षण साहित्य','Learning & development programs':'शिक्षण व विकास कार्यक्रम','Students goal':'विद्यार्थ्यांचे ध्येय','Opportunities to learn & help':'शिकण्याच्या व मदतीच्या संधी',
  'Create your free NOVA membership and get your member ID.':'तुमची मोफत नोव्हा सदस्यता तयार करा आणि तुमचा सदस्य क्रमांक मिळवा.',
  'What is Project NOVA?':'प्रोजेक्ट नोव्हा म्हणजे काय?','NOVA is more than a learning platform.':'नोव्हा फक्त शिकण्याचं व्यासपीठ नाही.',
  'Project NOVA is a student community created to help young people learn skills beyond textbooks, discover their potential, build meaningful connections and participate in activities that create a positive impact around them.':'प्रोजेक्ट नोव्हा हा विद्यार्थ्यांचा समुदाय आहे. पाठ्यपुस्तकांपलीकडची कौशल्ये शिकणे, स्वतःची क्षमता ओळखणे, अर्थपूर्ण नाती जोडणे आणि आजूबाजूला सकारात्मक बदल घडवणाऱ्या उपक्रमांत सहभागी होणे यासाठी तो तयार केला आहे.',
  'Grow':'वाढा','Build':'घडवा','Help':'मदत करा',
  'Free educational resources and study support.':'मोफत शैक्षणिक साहित्य आणि अभ्यासासाठी मदत.',
  'Communication, personality development and practical skills.':'संवाद, व्यक्तिमत्त्व विकास आणि व्यावहारिक कौशल्ये.',
  'Entrepreneurship, business workshops and real-world exposure.':'उद्योजकता, व्यवसाय कार्यशाळा आणि प्रत्यक्ष जगाचा अनुभव.',
  'Community initiatives that allow students to give back to society.':'विद्यार्थ्यांना समाजाला परत देण्याची संधी देणारे सामाजिक उपक्रम.',
  'Free learning hub':'मोफत शिक्षण केंद्र','Everything you need to grow — free.':'वाढण्यासाठी हवं ते सगळं — मोफत.','Explore free learning →':'मोफत शिक्षण पहा →',
  'Free Notes':'मोफत नोट्स','English Speaking':'इंग्रजी संभाषण','Personality Development':'व्यक्तिमत्त्व विकास','Business Basics':'व्यवसायाची मूलतत्त्वे','Career Exploration':'करिअर शोध',
  'Course library':'अभ्यासक्रम','Learn at your pace.':'तुमच्या गतीने शिका.','Science project hub':'विज्ञान प्रकल्प केंद्र','Build it. Understand it. Stay safe.':'बनवा. समजून घ्या. सुरक्षित राहा.',
  'Learn together. Grow together.':'एकत्र शिका. एकत्र वाढा.','Become a NOVA member':'नोव्हा सदस्य व्हा','Build something together':'एकत्र काहीतरी घडवा',
  'Experience':'अनुभव','Don’t just think about business. Experience it.':'व्यवसाय फक्त विचार करू नका. अनुभवा.','Explore business programs →':'व्यवसाय कार्यक्रम पहा →','See how the real world works.':'प्रत्यक्ष जग कसं चालतं ते पाहा.',
  'Helping hand':'मदतीचा हात','Learning is powerful. Helping is priceless.':'शिकणं शक्तिशाली आहे. मदत करणं अमूल्य आहे.','Project NOVA believes students can create positive change while they learn.':'शिकता शिकता विद्यार्थी सकारात्मक बदल घडवू शकतात, असा प्रोजेक्ट नोव्हाचा विश्वास आहे.',
  'Food drive':'अन्नदान उपक्रम','Tree plantation':'वृक्षारोपण','Upcoming events':'आगामी कार्यक्रम','There’s always something happening.':'नेहमी काहीतरी घडत असतं.',
  'Why join NOVA':'नोव्हामध्ये का सामील व्हावं','When you join NOVA, you get more than notes.':'नोव्हामध्ये सामील झालात की नोट्सपेक्षा खूप काही मिळतं.','Join NOVA – it’s free':'नोव्हामध्ये सामील व्हा – मोफत',
  'Questions? Answered.':'प्रश्न? उत्तरं इथे.','JOIN PROJECT NOVA':'प्रोजेक्ट नोव्हामध्ये सामील व्हा',
  'Your journey is just':'तुमचा प्रवास','beginning.':'आत्ता सुरू होतोय.',
  'Learn something new. Meet new people. Build something meaningful. Help someone. Discover yourself.':'काहीतरी नवं शिका. नवीन माणसं भेटा. अर्थपूर्ण काहीतरी घडवा. कोणाला तरी मदत करा. स्वतःला शोधा.',
  'Become a NOVA member →':'नोव्हा सदस्य व्हा →','It’s free. It’s your community. It’s your journey.':'हे मोफत आहे. हा तुमचा समुदाय आहे. हा तुमचा प्रवास आहे.',
  'Register →':'नोंदणी करा →','Registered ✓':'नोंदणी झाली ✓','Join →':'सामील व्हा →','View event':'कार्यक्रम पहा','Start free':'मोफत सुरू करा','Continue learning':'शिकणं सुरू ठेवा',
  'Quick links':'जलद दुवे','Student resources':'विद्यार्थी साधने','Support':'मदत','Terms':'अटी','Privacy Policy':'गोपनीयता धोरण','FAQ':'नेहमीचे प्रश्न','Volunteer':'स्वयंसेवक','Food Drive':'अन्नदान','Tree Plantation':'वृक्षारोपण',
  'Welcome to NOVA.':'नोव्हामध्ये स्वागत.','Membership is completely free.':'सदस्यत्व पूर्णपणे मोफत आहे.','Create my NOVA membership':'माझी नोव्हा सदस्यता तयार करा','Already a member? Log in':'आधीच सदस्य आहात? लॉग इन करा',
  'Full name':'पूर्ण नाव','Date of birth':'जन्मतारीख','Gender':'लिंग','Mobile number':'मोबाईल क्रमांक','Email':'ईमेल','District':'जिल्हा','City':'शहर','School / College':'शाळा / महाविद्यालय','Class':'इयत्ता','Stream':'शाखा','Board':'बोर्ड','Areas of interest':'आवडीची क्षेत्रे','Profile photo':'प्रोफाइल फोटो','Password':'पासवर्ड',
  'Welcome back.':'पुन्हा स्वागत.','Mobile / Email':'मोबाईल / ईमेल','Login':'लॉग इन','Forgot password':'पासवर्ड विसरलात?','New to NOVA? Join free':'नोव्हामध्ये नवीन? मोफत सामील व्हा',
  'Free courses. Learn at your pace.':'मोफत अभ्यासक्रम. तुमच्या गतीने शिका.','Free notes':'मोफत नोट्स','Build something together.':'एकत्र काहीतरी घडवा.',
  'Our mission':'आमचे ध्येय','Our vision':'आमची दृष्टी','Log out':'लॉग आउट','Install NOVA app':'नोव्हा अ‍ॅप इन्स्टॉल करा','Share on WhatsApp':'व्हॉट्सअ‍ॅपवर शेअर करा'
 }
}

const Ctx=createContext({lang:'en',setLang(){},t:s=>s})
export function LangProvider({children}){
 const [lang,set]=useState(()=>{try{return localStorage.getItem('nova_lang')||'en'}catch{return 'en'}})
 useEffect(()=>{document.documentElement.lang=lang},[lang])
 const setLang=l=>{set(l);try{localStorage.setItem('nova_lang',l)}catch{}}
 const t=useCallback(s=>lang==='en'?s:(DICT[lang]&&DICT[lang][s])||s,[lang])
 return <Ctx.Provider value={{lang,setLang,t}}>{children}</Ctx.Provider>}
export const useT=()=>useContext(Ctx)