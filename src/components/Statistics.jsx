import { TrendingUp, Users, Car, Clock } from "lucide-react";

const Statistics = () => {
  const stats = [
    {
      icon: Car,
      number: "50,000+",
      label: "Vehicles Tracked",
      description: "Across 25 countries"
    },
    {
      icon: Users,
      number: "2,500+",
      label: "Happy Customers",
      description: "Trust our platform"
    },
    {
      icon: TrendingUp,
      number: "30%",
      label: "Cost Reduction",
      description: "Average savings"
    },
    {
      icon: Clock,
      number: "99.9%",
      label: "Uptime",
      description: "Reliable service"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Fleet Managers Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of businesses that have transformed their fleet operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-lg font-medium text-gray-700 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
