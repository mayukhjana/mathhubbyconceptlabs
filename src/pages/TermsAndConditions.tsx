
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Terms and Conditions - MathHub</title>
        <meta
          name="description"
          content="Read MathHub's terms and conditions for using our educational platform and services."
        />
      </Helmet>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using MathHub, you agree to be bound by these Terms and Conditions.
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>You must be at least 13 years old to use our services</li>
              <li>You agree to provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Conduct</h2>
            <p className="mb-4">When using MathHub, you agree not to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Share your account credentials with others</li>
              <li>Engage in any unauthorized copying of content</li>
              <li>Attempt to interfere with the proper working of the platform</li>
              <li>Use the service for any unlawful purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Premium Subscriptions</h2>
            <p className="mb-4">
              Premium subscriptions are governed by the following terms:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Subscription fees are charged in advance</li>
              <li>Automatic renewal unless cancelled</li>
              <li>No sharing of premium accounts</li>
              <li>Refunds as per our refund policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p>
              MathHub reserves the right to modify these terms at any time. Users will be notified of any changes via email or platform notifications.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
