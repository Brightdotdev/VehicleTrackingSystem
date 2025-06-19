import { useState } from "react";
import { Menu, X, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">FleetTracker</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              Login
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white rounded-lg mt-2 p-4 shadow-lg border border-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                Login
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
