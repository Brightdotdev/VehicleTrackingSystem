import { Car, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50/50 border-t border-gray-200/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">FleetTracker</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              The most advanced vehicle tracking system for modern fleets. 
              Monitor, optimize, and secure your vehicles with real-time insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">API</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 FleetTracker. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
