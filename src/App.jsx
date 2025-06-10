import Header from './Components/Header';
import UserProfile from './Components/UserProfile';
import HistorySection from './Components/HistorySection';
import FooterNav from './Components/FooterNav';

import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <UserProfile />
      <HistorySection />
      <FooterNav />
    </div>
  );
}

export default App;
