import Hero from "../components/Hero";
import Features from "../components/Features";
import Dashboard from "../components/Dashboard";
import Statistics from "../components/Statistics";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <Navigation />
      <Hero />
      <Dashboard />
      <Features />
      <Statistics />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
