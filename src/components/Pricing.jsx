import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small fleets",
      features: [
        "Up to 5 vehicles",
        "Real-time GPS tracking",
        "Basic reporting",
        "Email support",
        "Mobile app access"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$59",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 25 vehicles",
        "Advanced analytics",
        "Route optimization",
        "Driver behavior monitoring",
        "24/7 phone support",
        "Custom alerts",
        "Maintenance tracking"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large fleet operations",
      features: [
        "Unlimited vehicles",
        "Custom integrations",
        "Advanced reporting",
        "Dedicated account manager",
        "White-label solution",
        "API access",
        "Priority support"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your fleet size and needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/70 backdrop-blur-sm border rounded-2xl p-8 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg ${
                plan.popular
                  ? "border-blue-300 bg-white/90"
                  : "border-gray-200/50 hover:border-blue-300/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-600">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
                }`}
                size="lg"
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">All plans include 14-day free trial • No setup fees • Cancel anytime</p>
          <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
            Need a custom plan? Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
