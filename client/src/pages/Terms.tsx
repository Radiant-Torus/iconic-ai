import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Terms() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen radiant-background">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Terms of Service</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            Back
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms of Service</h2>
            <p className="text-slate-600 mb-4">
              Last Updated: February 2026
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h3>
            <p className="text-slate-600">
              By accessing and using Radiant Torus ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">2. Use License</h3>
            <p className="text-slate-600 mb-2">
              Permission is granted to temporarily download one copy of the materials (information or software) on Radiant Torus for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Disclaimer</h3>
            <p className="text-slate-600">
              The materials on Radiant Torus are provided on an 'as is' basis. Radiant Torus makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">4. Limitations</h3>
            <p className="text-slate-600">
              In no event shall Radiant Torus or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Radiant Torus, even if Radiant Torus or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">5. Accuracy of Materials</h3>
            <p className="text-slate-600">
              The materials appearing on Radiant Torus could include technical, typographical, or photographic errors. Radiant Torus does not warrant that any of the materials on the Service are accurate, complete, or current. Radiant Torus may make changes to the materials contained on the Service at any time without notice.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">6. Links</h3>
            <p className="text-slate-600">
              Radiant Torus has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Radiant Torus of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">7. Modifications</h3>
            <p className="text-slate-600">
              Radiant Torus may revise these terms of service for the Service at any time without notice. By using the Service, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">8. Governing Law</h3>
            <p className="text-slate-600">
              These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">9. Contact Information</h3>
            <p className="text-slate-600">
              If you have any questions about these Terms of Service, please contact us through the Service.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
