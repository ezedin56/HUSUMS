import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import PublicVote from './pages/PublicVote';
import './overflowFix.css';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Broadcast from './pages/dashboard/president/Broadcast';
import Events from './pages/dashboard/president/Events';
import PresidentMembers from './pages/dashboard/president/Members';
import Elections from './pages/dashboard/president/Elections';
import Analytics from './pages/dashboard/president/Analytics';
import Departments from './pages/dashboard/president/Departments';
import PresidentInbox from './pages/dashboard/president/PresidentInbox';
import SystemAdmin from './pages/dashboard/president/SystemAdmin';
import LiveResults from './pages/dashboard/president/LiveResults';
import PresidentVote from './pages/dashboard/president/Vote';
import SecretaryMembers from './pages/dashboard/secretary/Members';
import Records from './pages/dashboard/secretary/Records';
import SecretaryVote from './pages/dashboard/secretary/Vote';
import AttendanceSchedule from './pages/dashboard/secretary/AttendanceSchedule';
import Inbox from './pages/dashboard/deptHead/Inbox';
import ActionPlan from './pages/dashboard/deptHead/ActionPlan';
import Vote from './pages/dashboard/member/Vote';
import Attendance from './pages/dashboard/member/Attendance';
import DepartmentSelection from './pages/dashboard/member/DepartmentSelection';
import Profile from './pages/dashboard/member/Profile';
import Tasks from './pages/dashboard/member/Tasks';
import MemberEvents from './pages/dashboard/member/Events';
import Resources from './pages/dashboard/member/Resources';
import Support from './pages/dashboard/member/Support';
import ActiveElections from './pages/dashboard/member/ActiveElections';
import VotingBooth from './pages/dashboard/member/VotingBooth';
import VoteConfirmation from './pages/dashboard/member/VoteConfirmation';
import AdminLayout from './pages/admin/AdminLayout';
import ElectionManager from './pages/admin/ElectionManager';
import CandidateManager from './pages/admin/CandidateManager';
import ResultsManager from './pages/admin/ResultsManager';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="app" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        minHeight: '100vh',
        width: '100%'
      }}>
        <Layout />
      </div>
    </Router>
  );
}

import backgroundImage from './assets/background.png';

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/forgot-password' || location.pathname.startsWith('/reset-password');
  const isVotePage = location.pathname === '/vote' || location.pathname === '/public-vote';
  const showBackground = location.pathname === '/login' || location.pathname === '/forgot-password';

  return (
    <>
      {/* Background image on login and forgot password pages */}
      {showBackground && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />
      )}

      {!isHome && !isDashboard && !isAuthPage && !isVotePage && <Navbar />}
      <main className={!isHome && !isDashboard && !isAuthPage && !isVotePage ? 'container' : ''} style={!isHome && !isDashboard && !isAuthPage && !isVotePage ? { padding: '2rem 0' } : {}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/vote" element={<PublicVote />} />
          <Route path="/public-vote" element={<PublicVote />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            {/* President Routes */}
            <Route path="president/broadcast" element={<Broadcast />} />
            <Route path="president/members" element={<PresidentMembers />} />
            <Route path="president/events" element={<Events />} />
            <Route path="president/elections" element={<Elections />} />
            <Route path="president/analytics" element={<Analytics />} />
            <Route path="president/departments" element={<Departments />} />
            <Route path="president/inbox" element={<PresidentInbox />} />
            <Route path="president/system" element={<SystemAdmin />} />
            <Route path="president/results/:electionId" element={<LiveResults />} />
            <Route path="president/vote" element={<PresidentVote />} />

            {/* Secretary Routes */}
            <Route path="secretary/members" element={<SecretaryMembers />} />
            <Route path="secretary/records" element={<Records />} />
            <Route path="secretary/attendance" element={<AttendanceSchedule />} />
            <Route path="secretary/elections" element={<SecretaryVote />} />

            {/* Dept Head Routes */}
            <Route path="dept-head/inbox" element={<Inbox />} />
            <Route path="dept-head/action-plan" element={<ActionPlan />} />

            {/* Member Routes */}
            <Route path="member/vote" element={<Vote />} />
            <Route path="member/attendance" element={<Attendance />} />
            <Route path="member/department" element={<DepartmentSelection />} />
            <Route path="member/profile" element={<Profile />} />
            <Route path="member/tasks" element={<Tasks />} />
            <Route path="member/events" element={<MemberEvents />} />
            <Route path="member/resources" element={<Resources />} />
            <Route path="member/support" element={<Support />} />
            <Route path="member/elections" element={<ActiveElections />} />
            <Route path="member/vote/:electionId" element={<VotingBooth />} />
            <Route path="member/vote-confirmation/:electionId" element={<VoteConfirmation />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<ElectionManager />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="elections" element={<ElectionManager />} />
            <Route path="candidates" element={<CandidateManager />} />
            <Route path="results" element={<ResultsManager />} />
          </Route>
        </Routes>
      </main>
    </>
  );
};

export default App;
