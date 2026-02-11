import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Privacy() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen radiant-background">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Privacy Policy</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            Back
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Privacy Policy</h2>
            <p className="text-slate-600 mb-4">
              Last Updated: February 2026
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Introduction</h3>
            <p className="text-slate-600">
              Radiant Torus ("we", "us", "our", or "Company") operates the Service. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">2. Information Collection and Use</h3>
            <p className="text-slate-600 mb-2">
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
              <li><strong>Account Information:</strong> Name, email address, and authentication credentials</li>
              <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, and time spent on pages</li>
              <li><strong>Business Data:</strong> Lead information, niche selections, and audit records</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store card details)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Use of Data</h3>
            <p className="text-slate-600">
              Radiant Torus uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">4. Security of Data</h3>
            <p className="text-slate-600">
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">5. Changes to This Privacy Policy</h3>
            <p className="text-slate-600">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">6. Contact Us</h3>
            <p className="text-slate-600">
              If you have any questions about this Privacy Policy, please contact us through the Service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">7. Data Retention</h3>
            <p className="text-slate-600">
              We retain your personal data for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. You may request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">8. Your Rights</h3>
            <p className="text-slate-600">
              You have the right to access, update, or delete your personal information at any time. You may also opt-out of certain communications from us. Please contact us to exercise these rights.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
