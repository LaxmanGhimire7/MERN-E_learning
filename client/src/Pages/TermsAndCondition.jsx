import { Helmet } from 'react-helmet';
import { IoCall } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";


const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Terms and Conditions - Sipalaya Infotech</title>
        <meta name="description" content="Sipalaya Infotech Terms and Conditions" />
      </Helmet>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-blue-900 text-white">
          <h1 className="text-4xl font-bold">Terms and Conditions</h1>
          <div className="mt-4 flex flex-col sm:flex-row justify-between">
            <p>Effective Date: May 2, 2025</p>
            <p>Updated Date: May 2, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Use of Our Services</h2>
            <p className="mb-4">
              Welcome to Sipalaya Infotech Pvt. Ltd. (“Sipalaya”, “we”, “our”, or “us”)! 
              These Terms govern your use of our website and services located at 
              <a href="https://sipalaya.com" className="text-blue-600 hover:underline"> https://sipalaya.com</a> 
              (the “Service”).
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old</li>
              <li>Use the Service only for lawful purposes</li>
              <li>Do not infringe third-party rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Account Registration</h2>
            <div className="space-y-4">
              <p>▸ Maintain confidentiality of login credentials</p>
              <p>▸ Provide accurate and updated information</p>
              <p>▸ We reserve right to suspend violating accounts</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Payments and Fees</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-bold mb-2">Accepted Payment Methods</h3>
                <ul className="space-y-2">
                  <li>• Esewa</li>
                  <li>• Khalti</li>
                  <li>• Stripe</li>
                  <li>• PayPal</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-bold mb-2">Refund Policy</h3>
                <p>Payments are non-refundable unless specified in our Refund Policy</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Course Access</h2>
            <div className="space-y-2">
              <p>▶ Access limited to enrolled users only</p>
              <p>▶ All materials are copyrighted</p>
              <p>▶ Strictly no sharing/redistribution</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
            <p className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              All content, trademarks, and logos are property of Sipalaya Infotech. 
              Commercial use requires written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Third-Party Services</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded-full">Zoom</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">Google Meet</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">Payment Gateways</span>
            </div>
          </section>

          {/* Add remaining sections following similar patterns */}

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
              <IoMdMail />

                <a href="mailto:infotech@sipalaya.com" className="text-blue-600 hover:underline">
                  infotech@sipalaya.com
                </a>
              </div>
              <div className="flex items-center gap-2">
<IoCall />
    
                <span>9851344071 | 9806393939</span>
              </div>
            </div>
          </section>

          <div className="mt-8 text-sm text-gray-500 border-t pt-4">
            Last updated: May 2, 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
