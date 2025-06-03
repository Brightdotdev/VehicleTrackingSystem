import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BottomNavBar } from '../components/BottomNavBar';

const mockRequests = [
  {
    carName: 'Toyota Camry',
    status: 'Active',
    inTransit: true,
    healthScore: 64,
    dispatchable: true,
    wildCards: 'NONE',
    imageUrl: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=facearea&w=400&h=200',
    requestedBy: 'User1',
    dispatchReason: 'Transport',
    dispatchEndTime: '12:00 PM',
  },
  {
    carName: 'Honda Accord',
    status: 'Active',
    inTransit: true,
    healthScore: 80,
    dispatchable: false,
    wildCards: 'BAD GPS',
    imageUrl: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=facearea&w=400&h=200',
    requestedBy: 'User2',
    dispatchReason: 'Transport',
    dispatchEndTime: '1:00 PM',
  },
  {
    carName: 'Tesla Model 3',
    status: 'UNHEALTHY',
    inTransit: true,
    healthScore: 34,
    dispatchable: false,
    wildCards: 'BAD GPS',
    imageUrl: 'https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=facearea&w=400&h=200',
    requestedBy: 'User3',
    dispatchReason: 'Transport',
    dispatchEndTime: '2:00 PM',
  },
];

const getHealthColor = (score: number) => {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-600';
};

const HandleDispatchPage: React.FC = () => {
  const { carName } = useParams<{ carName: string }>();
  const navigate = useNavigate();
  const car = mockRequests.find((c) => c.carName === carName) || mockRequests[0];

  return (
    <div className="min-h-screen bg-gray-100 pb-32 font-sans">
      {/* Top bar with back button */}
      <div className="flex items-center p-4 bg-white shadow-sm">
        <button onClick={() => navigate(-1)} className="mr-2 p-2 rounded-full hover:bg-gray-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-semibold text-gray-700">{car.requestedBy}'s Dispatch request</span>
      </div>
      {/* Main Card */}
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-0 overflow-hidden">
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center relative">
          <img src={car.imageUrl} alt="Car" className="object-cover w-full h-full" />
          <span className={`absolute top-4 right-4 px-4 py-1 rounded-full text-sm font-semibold ${car.dispatchable ? 'bg-green-200 text-green-800' : 'bg-gray-300 text-gray-600'}`}>{car.dispatchable ? 'Dispatchable' : 'Not Dispatchable'} {car.dispatchable && <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}</span>
        </div>
        <div className="p-8 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">{car.carName}</h2>
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${car.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{car.status === 'UNHEALTHY' ? 'UNHEALTHY' : 'Active'}
              {car.status === 'Active' && <span className="ml-1"><svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></span>}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-600 text-base">In Transit</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-700 font-medium text-base">Health Score :</span>
            <span className={getHealthColor(car.healthScore) + ' font-semibold text-base'}>{car.healthScore}%</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-700 font-medium text-base">Wild Cards :</span>
            <span className={car.wildCards === 'NONE' ? 'text-green-600' : 'text-red-600'}>{car.wildCards}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-700 font-medium text-base">Dispatch Reason :</span>
            <span className="text-gray-800">{car.dispatchReason}</span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-gray-700 font-medium text-base">Dispatch End time :</span>
            <span className="text-gray-800">{car.dispatchEndTime}</span>
          </div>
          <div className="flex gap-6 mt-6">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition text-lg">Accept Dispatch</button>
            <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg shadow transition text-lg">Reject Dispatch</button>
          </div>
        </div>
      </div>
      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default HandleDispatchPage;
