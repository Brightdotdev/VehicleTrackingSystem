import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Contact us today for a personalized demo and see how we can transform your fleet operations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="First Name"
                  className="bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500"
                />
                <Input 
                  placeholder="Last Name"
                  className="bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <Input 
                type="email"
                placeholder="Email Address"
                className="bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500"
              />
              
              <Input 
                placeholder="Company Name"
                className="bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500"
              />
              
              <Textarea 
                placeholder="Tell us about your fleet and how we can help..."
                className="bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 min-h-[120px]"
              />
              
              <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in touch</h3>
              <p className="text-gray-600 mb-8">
                Have questions? We'd love to hear from you. Our team is here to help you 
                make the most of your fleet tracking experience.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-gray-900 font-medium">Call us</div>
                  <div className="text-gray-600">+1 (555) 123-4567</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-gray-900 font-medium">Email us</div>
                  <div className="text-gray-600">contact@fleettracker.com</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-gray-900 font-medium">Visit us</div>
                  <div className="text-gray-600">123 Tech Street, San Francisco, CA 94105</div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Schedule a Demo</h4>
              <p className="text-gray-600 mb-4">
                See our platform in action with a personalized demonstration
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Book Demo Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
