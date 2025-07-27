import React from 'react';

export default function Terms() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        Terms & Conditions
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <p className="text-gray-700 text-lg mb-4">
          Welcome to <span className="font-semibold">PropertyHub</span>. By
          using our platform, you agree to the following terms and conditions.
          Please read them carefully.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-3">
          1. User Responsibilities
        </h3>
        <p className="text-gray-700">
          Users must provide accurate information when listing properties or
          making inquiries. Any misleading or false information may result in
          account suspension.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-3">2. Privacy Policy</h3>
        <p className="text-gray-700">
          We respect your privacy. Your personal information will not be shared
          with third parties without your consent, except as required by law.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-3">
          3. Prohibited Activities
        </h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Posting fake or misleading property listings</li>
          <li>Engaging in fraudulent transactions</li>
          <li>Using the platform for illegal purposes</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-6 mb-3">
          4. Liability Disclaimer
        </h3>
        <p className="text-gray-700">
          PropertyHub is a listing platform and does not take responsibility for
          any direct transactions between buyers and sellers. Users should
          conduct their own due diligence before making any commitments.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-3">
          5. Changes to Terms
        </h3>
        <p className="text-gray-700">
          We reserve the right to update these terms at any time. Continued use
          of our platform indicates acceptance of any changes.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-3">6. Contact Us</h3>
        <p className="text-gray-700">
          If you have any questions about these terms, please{' '}
          <a href="/contact" className="text-blue-600 hover:underline">
            contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
}