import { MapPin, Car, Route, Navigation } from "lucide-react";

const Dashboard = () => {
  const vehicles = [
    { id: "V001", status: "active", location: "Downtown", speed: "45 mph" },
    { id: "V002", status: "idle", location: "Warehouse", speed: "0 mph" },
    { id: "V003", status: "active", location: "Highway 101", speed: "65 mph" },
    { id: "V004", status: "maintenance", location: "Service Center", speed: "0 mph" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Live Fleet Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor all your vehicles in real-time with our intuitive dashboard
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2 bg-gray-50/50 rounded-xl p-6 border border-gray-200/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                  Live Map View
                </h3>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">4 Active</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">1 Idle</span>
                </div>
              </div>
              
              <div className="h-64 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDIzNywgMjQyLCAyNDcsIDAuOCkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')] opacity-50"></div>
                
                {/* Vehicle markers */}
                <div className="absolute top-8 left-12 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute top-16 right-20 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute bottom-12 left-1/3 w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="absolute bottom-8 right-16 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>

                {/* Route lines */}
                <svg className="absolute inset-0 w-full h-full">
                  <path d="M 48 32 Q 120 80 180 120" stroke="rgb(59, 130, 246)" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse" />
                  <path d="M 280 64 Q 200 100 120 180" stroke="rgb(59, 130, 246)" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse" />
                </svg>
              </div>
            </div>

            {/* Vehicle List */}
            <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200/30">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Car className="mr-2 h-5 w-5 text-blue-600" />
                Active Vehicles
              </h3>

              <div className="space-y-3">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white/50 rounded-lg p-3 border border-gray-200/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{vehicle.id}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        vehicle.status === 'active' ? 'bg-green-100 text-green-700' :
                        vehicle.status === 'idle' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <Navigation className="h-3 w-3 mr-1" />
                        {vehicle.location}
                      </div>
                      <div className="flex items-center mt-1">
                        <Route className="h-3 w-3 mr-1" />
                        {vehicle.speed}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
