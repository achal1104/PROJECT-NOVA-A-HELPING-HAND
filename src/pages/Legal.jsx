import {Link} from 'react-router-dom'
import {Reveal} from '../ui'
const Doc=({label,title,children})=><div className="page legal"><Reveal><span className="lab">{label}</span><h1>{title}</h1></Reveal>{children}<p className="note">Draft text for the Project NOVA team. Have it reviewed by a legal professional before launch.</p></div>

export function Terms(){return <Doc label="Terms" title="Terms & community guidelines">
 <h3>Membership</h3><p>Project NOVA membership is free. You agree to give correct details when you register and to keep your password private. If you are under 18, joining means your parent or guardian knows about and agrees to your membership.</p>
 <h3>Community guidelines</h3><ul><li>Be respectful — no bullying, hate speech or harassment.</li><li>Keep it safe — never share other people’s personal details or private photos.</li><li>Be honest — share only your own work and give credit to others.</li><li>Follow safety instructions on every science project, workshop and drive. Ask a teacher or adult when in doubt.</li><li>Follow organiser and volunteer-coordinator instructions at events, visits and drives.</li></ul>
 <h3>Events, visits and drives</h3><p>Seats may be limited. Registration does not guarantee a seat, and the NOVA team may change or cancel an activity. Students take part in offline activities responsibly and follow venue rules.</p>
 <h3>Content</h3><p>Notes, courses and guides are shared for learning. Please do not copy or resell them. Ideas you submit to Community Business may be shown to other members after moderator approval.</p>
 <h3>Removal</h3><p>The NOVA team may deactivate accounts that break these guidelines.</p>
 <p><Link to="/privacy">Read the Privacy Policy →</Link></p></Doc>}

export function Privacy(){return <Doc label="Privacy" title="Privacy policy">
 <h3>What we collect</h3><p>When you join we ask for your name, date of birth, gender, mobile number, email, district, city, school or college, class, stream, board, interests and an optional profile photo. We also record what you register for and your learning progress.</p>
 <h3>Why we collect it</h3><p>To create your membership and member ID, run events and visits, show activities near you, track your learning and NOVA journey, and send announcements.</p>
 <h3>Who can see it</h3><p>Your details are visible to authorised NOVA team members only, according to their role. We do not sell your data. Your name may be shown next to ideas you submit.</p>
 <h3>Students under 18</h3><p>Many NOVA members are under 18. We collect only what is needed to run the programme, and a parent or guardian may ask us to review or delete a child’s data.</p>
 <h3>Your choices</h3><p>You can edit your profile any time and ask the NOVA team to delete your account. Use the <Link to="/contact">Contact page</Link> to reach us.</p>
 <p><Link to="/terms">Read the Terms →</Link></p></Doc>}