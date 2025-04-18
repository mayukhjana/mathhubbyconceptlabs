
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Refund Policy - MathHub</title>
        <meta name="description" content="MathHub refund policy - Learn about our refund terms and conditions for premium subscriptions and services." />
      </Helmet>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Premium Subscription Refunds</h2>
            <p className="mb-4">At MathHub, we want you to be completely satisfied with your premium subscription. Here's what you need to know about our refund policy:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>You can request a full refund within 7 days of your initial premium subscription purchase.</li>
              <li>Refund requests must be submitted through our support system with your account details.</li>
              <li>Refunds will be processed using your original payment method.</li>
              <li>Processing time for refunds may take 5-10 business days depending on your payment provider.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Eligibility for Refunds</h2>
            <p className="mb-4">Refunds are eligible under the following conditions:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Technical issues preventing access to premium features</li>
              <li>Service unavailability during the subscription period</li>
              <li>Accidental or duplicate purchases</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>If you have any questions about our refund policy, please contact our support team at support@mathhub.online</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
