import Footer from "./containers/footer";
import Header from "./containers/header";
import About from "./containers/home/about";
import HowSection from "./containers/home/howsection";
import Main from "./containers/home/main";
import Review from "./containers/home/review";
import WhySection from "./containers/home/whysection";
import Login from "./containers/auth/login";
import SignUp from "./containers/auth/signup";

import { Route, Routes } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Header />
      <Main />
      <About />
      <WhySection />
      <HowSection />
      <Review />
      <Footer />
      <Login />
      <SignUp />
      
      <Routes>
        <Route path="/service" element={<Footer />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
      

    </div>
  );
}

export default App;

