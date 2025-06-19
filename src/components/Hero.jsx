import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Track Your Fleet
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
              In Real-Time
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Monitor your vehicles, optimize routes, and ensure driver safety with our cutting-edge 
            GPS tracking system. Get complete visibility into your fleet operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-3"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              No Setup Fees
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              14-Day Free Trial
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Cancel Anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
