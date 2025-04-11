import Footer from "./containers/footer";
import Header from "./containers/header";
import About from "./containers/home/about";
import HowSection from "./containers/home/howsection";
import Main from "./containers/home/main";
import Review from "./containers/home/review";
import WhySection from "./containers/home/whysection";
import Login from "./containers/auth/login";
import SignUp from "./containers/auth/signup";
import { ProtectedRoute } from "./components/protectedRoute";   
import UnAuthorized from "./containers/unAuthorized";   
import AdminDashboard from "./containers/dashboard/superAdmin/dashboard";
import AdminLayout from "./containers/dashboard/superAdmin/adminLayout";
import SubscriberLayout from "./containers/dashboard/subscriber/subscriberLayout";
import GuestLayout from "./containers/dashboard/guest/guestLayout";
import AdminCRUDDashboard from "./containers/dashboard/superAdmin/crud/userRead";
import GuestDashboard from "./containers/dashboard/guest/dashboard";
import SubscriberDashboard from "./containers/dashboard/subscriber/dashboard";  
import './config/firebase';

//Speech components
import Dashboard from "./containers/speech/dashboard";
import History from "./containers/speech/history";
import AnalysisDetails from "./containers/speech/analysisDetails";
import Navbar from "./containers/speech/navbar";
import HomePage from "./containers/speech/homePageSpeech";

import { Route, Routes } from "react-router-dom";
import QuizMain from "./containers/quiz/QuizMain";
import SpeechShadowingPractice from "./containers/speechShadow/speechShadowPractice";
import PricingPage from "./containers/subscription/stripe/pricingPage";
import SubscriptionSuccessPage from "./containers/subscription/stripe/subscriptionSuccess";
import AccountSettings from "./containers/subscription/stripe/accountSettings";
import SubscribePage from "./containers/subscription/stripe/subscribePage";

// Public components grouped into a single page layout
const PublicPage = () => {
  return (
    <>
      <Header />
      <Main />
      <About />
      <WhySection />
      <HowSection />
      <Review />
      <Footer />
      <QuizMain />
      <Login />
      <SignUp />
      <Navbar />
      <HomePage />
      <SpeechShadowingPractice />
      <PricingPage />
      <SubscriptionSuccessPage />
      <AccountSettings />
      <SubscribePage />
    </>
  );
};

function App() {

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicPage />} />
        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />

        {/* Protected Routes */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="Admin"><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<AdminCRUDDashboard />} />            
        </Route>

        <Route path="/subscriber" element={<ProtectedRoute requiredRole="Subscriber"><SubscriberLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<SubscriberDashboard />} />
        </Route>

        <Route path="/guest" element={<ProtectedRoute requiredRole="Guest"><GuestLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<GuestDashboard />} />
          <Route path="speech" element={<Dashboard />} />

        </Route>

        // Routes for Speech
        <Route path="speech/dashboard" element={<Dashboard />} />
        <Route path="speech/history" element={<History />} />
        <Route path="speech/analysis/:id" element={<AnalysisDetails />} />

      </Routes>
    </div>
  );
}

export default App;
