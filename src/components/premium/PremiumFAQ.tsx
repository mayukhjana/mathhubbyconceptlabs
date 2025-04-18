
const PremiumFAQ = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-xl font-semibold mb-2">How does the premium subscription work?</h3>
          <p className="text-muted-foreground">Our premium subscription gives you unlimited access to all our premium content. You can choose either a monthly or annual plan, and cancel anytime.</p>
        </div>
        
        <div className="border-b pb-4">
          <h3 className="text-xl font-semibold mb-2">Can I cancel my subscription?</h3>
          <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. You'll still have access to premium content until the end of your billing period.</p>
        </div>
        
        <div className="border-b pb-4">
          <h3 className="text-xl font-semibold mb-2">How do I access premium content?</h3>
          <p className="text-muted-foreground">Once subscribed, all premium content will be automatically unlocked throughout the website. You'll see the premium badge disappear from locked items.</p>
        </div>
        
        <div className="border-b pb-4">
          <h3 className="text-xl font-semibold mb-2">Is there a student discount?</h3>
          <p className="text-muted-foreground">We offer special discounts for educational institutions. Please contact us for more information.</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumFAQ;
