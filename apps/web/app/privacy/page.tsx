import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ApexOne Fitness',
  description: 'Data protection practices in compliance with DPDPA',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 lg:p-12">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: January 8, 2026</p>

        {/* Section 1: Data Collection */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4 text-gray-700">
            When you sign up for beta access, we collect:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Contact information (phone number and/or email address)</li>
            <li>Device information (browser type, operating system)</li>
            <li>Usage data (how you interact with our website)</li>
          </ul>
        </section>

        {/* Section 2: How We Use Your Data */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Notify you about the app launch and beta updates</li>
            <li>Send fitness tips (only if consented)</li>
            <li>Improve our services</li>
          </ul>
        </section>

        {/* Section 3: DPDPA Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Your Rights Under DPDPA</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Right to Access:</strong> Request a copy of your data</li>
            <li><strong>Right to Correction:</strong> Update inaccurate data</li>
            <li><strong>Right to Deletion:</strong> Request data deletion</li>
            <li><strong>Right to Withdraw Consent:</strong> Opt-out anytime</li>
          </ul>
        </section>

        {/* Section 4: Data Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="text-gray-700">
            We store your data securely using Supabase with industry-standard encryption.
          </p>
        </section>

        {/* Section 5: How to Unsubscribe */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. How to Unsubscribe</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Reply "STOP" to any WhatsApp message or SMS</li>
            <li>Click "Unsubscribe" in any email</li>
            <li>Email us at: privacy@apexone.fitness</li>
          </ul>
        </section>

        {/* Section 6: Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              Email: <a href="mailto:privacy@apexone.fitness" className="text-blue-600">privacy@apexone.fitness</a>
            </p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t">
          <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </a>
        </div>
      </article>
    </div>
  );
}
