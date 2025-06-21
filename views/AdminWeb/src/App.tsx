import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Auth } from './pages/Auth';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/DashBoard';
import { Vehicles } from './pages/Vehicles';
import RequestDispatchPage from './pages/RequestDispatchPage';
import './App.css';
import { AnimatePresence, motion } from 'framer-motion';
import { HistoryPage } from './pages/HistoryPage';
import { HandleDispatchPage } from './pages/HandleDispatchPage';
import VehicleInfo from './pages/VehicleInfo';
import { BadVehiclePage } from './pages/BadVehiclePage';
import LandingPage from './pages/LandingPage';
import UserProfile from './pages/UserProfile';
import SuccessfulDispatches from './pages/SuccessfulDispatches';
import FailedDispatches from './pages/FailedDispatches';
import { DispatchView } from './pages/DispatchView';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            <LandingPage />
          </motion.div>
        } />
        <Route path="/auth" element={
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
        <Route path="/requests" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <RequestDispatchPage />
          </motion.div>
        } />
        <Route path="/vehicles" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Vehicles />
          </motion.div>
        } />
        <Route path="/handle-dispatch/:vehicleId" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <HandleDispatchPage />
          </motion.div>
        } />
        <Route path="/historypage" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <HistoryPage />
          </motion.div>
        } />
        <Route path="/vehicle-info/:vehicleId" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <VehicleInfo />
          </motion.div>
        } />
        <Route path="/bad-vehicle/:vehicleId" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <BadVehiclePage />
          </motion.div>
        } />
        <Route path="/profile" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <UserProfile />
          </motion.div>
        } />
        <Route path="/successful-dispatches" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <SuccessfulDispatches />
          </motion.div>
        } />
        <Route path="/failed-dispatches" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <FailedDispatches />
          </motion.div>
        } />
        <Route path="/dispatch-view" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <DispatchView />
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
