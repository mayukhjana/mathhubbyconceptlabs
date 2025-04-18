
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Privacy Policy - MathHub</title>
        <meta name="description" content="MathHub privacy policy - Learn how we protect and manage your personal information." />
      </Helmet>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-4">We collect and process the following information:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Usage data (practice patterns, test scores, performance metrics)</li>
              <li>Technical data (device info, IP address, browser type)</li>
              <li>Payment information (processed securely through our payment provider)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-4">Your information helps us:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Personalize your learning experience</li>
              <li>Improve our educational content and services</li>
              <li>Send important updates about your account</li>
              <li>Process payments and maintain your subscription</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
            <p className="mb-4">We implement strict security measures to protect your data:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Encryption of sensitive information</li>
              <li>Regular security audits and updates</li>
              <li>Secure data storage and transmission</li>
              <li>Limited employee access to personal data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>For privacy-related inquiries, please contact our data protection officer at privacy@mathhub.online</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
