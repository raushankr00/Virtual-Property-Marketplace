import React from 'react';

export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">About PropertyHub</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <p className="text-gray-700 text-lg mb-4">
          Welcome to <span className="font-semibold">PropertyHub</span>, your trusted platform for buying, selling, and renting properties with ease.
          We connect property seekers with verified listings and real estate professionals to make your property journey seamless.
        </p>
        <h3 className="text-2xl font-semibold mt-6 mb-3">Our Mission</h3>
        <p className="text-gray-700">
          At PropertyHub, our mission is to simplify the real estate process by providing a user-friendly and transparent platform.
          Whether you are looking for your dream home, a rental property, or an investment opportunity, we ensure you have access to the best listings.
        </p>
        <h3 className="text-2xl font-semibold mt-6 mb-3">Why Choose Us?</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Verified and high-quality property listings</li>
          <li>Advanced search filters for finding the perfect home</li>
          <li>Secure and seamless communication between buyers and sellers</li>
          <li>Expert support from real estate professionals</li>
        </ul>
        <h3 className="text-2xl font-semibold mt-6 mb-3">Get in Touch</h3>
        <p className="text-gray-700">
          Have questions? Our team is here to help. Reach out to us through our <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a>
          and let us assist you in finding your ideal property.
        </p>
      </div>
    </div>
  );
}