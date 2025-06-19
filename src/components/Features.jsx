import { MapPin, Shield, Clock, BarChart3, AlertTriangle, Route } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MapPin,
      title: "Real-Time GPS Tracking",
      description: "Monitor vehicle locations with pinpoint accuracy using advanced GPS technology."
    },
    {
      icon: Route,
      title: "Route Optimization",
      description: "Optimize delivery routes to reduce fuel costs and improve efficiency."
    },
    {
      icon: Shield,
      title: "Driver Safety Monitoring",
      description: "Track driver behavior, speed violations, and ensure compliance with safety standards."
    },
    {
      icon: AlertTriangle,
      title: "Instant Alerts",
      description: "Receive immediate notifications for unauthorized use, maintenance needs, or emergencies."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive reports and insights to optimize your fleet operations."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock monitoring and support to keep your fleet running smoothly."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
              Complete Fleet Control
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage, monitor, and optimize your vehicle fleet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:border-blue-300/50 shadow-sm hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
