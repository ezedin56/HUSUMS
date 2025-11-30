import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SystemStatus from './components/SystemStatus';
import AnimatedNetworkBackground from './components/AnimatedNetworkBackground';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import PublicVote from './pages/PublicVote';
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

function App() {
  return (
    <Router>
      <div className="app">
        <Layout />
      </div>
    </Router>
  );
}

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      <AnimatedNetworkBackground color="#16a34a" opacity={0.3} />
      {!isHome && !isDashboard && <Navbar />}
      <main className={!isHome && !isDashboard ? 'container' : ''} style={!isHome && !isDashboard ? { padding: '2rem 0' } : {}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/vote" element={<PublicVote />} />
          <Route path="/login" element={<Login />} />

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
            <Route path="secretary/vote" element={<SecretaryVote />} />

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
        </Routes>
      </main>
      <SystemStatus />
    </>
  );
};

export default App;
