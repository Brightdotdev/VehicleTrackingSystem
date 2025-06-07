import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Auth } from './pages/Auth';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/DashBoard';
import { Vehicles } from './pages/Vehicles';
import RequestDispatchPage from './pages/RequestDispatchPage';
import './App.css';
import { AnimatePresence, motion } from 'framer-motion';
import { Dashboard2 } from './pages/DashBoard2';
import HandleDispatchPage from './pages/HandleDispatchPage';
import VehicleInfo from './pages/VehicleInfo';
import BadVehiclePage from './pages/BadVehiclePage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Auth />
          </motion.div>
        } />
        <Route path="/signup" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <SignUp />
          </motion.div>
        } />
        <Route path="/dashboard" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Dashboard />
          </motion.div>
        } />
        <Route path="/vehicles" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Vehicles />
          </motion.div>
        } />
        <Route path="/requests" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <RequestDispatchPage />
          </motion.div>
        } />
        <Route path="/handle-dispatch/:carName" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <HandleDispatchPage />
          </motion.div>
        } />
        <Route path="/dashboard2" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Dashboard2 />
          </motion.div>
        } />
        <Route path="/vehicle-info/:name" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <VehicleInfo />
          </motion.div>
        } />
        <Route path="/bad-vehicle/:vehicleName" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <BadVehiclePage />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
