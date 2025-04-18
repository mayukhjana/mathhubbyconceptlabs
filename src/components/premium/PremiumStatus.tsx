
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface PremiumStatusProps {
  formattedExpiryDate: string | null;
  onRefresh: () => void;
}

const PremiumStatus = ({ formattedExpiryDate, onRefresh }: PremiumStatusProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-12 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <h2 className="text-xl font-bold text-green-700">You're on Premium!</h2>
            {formattedExpiryDate ? (
              <p className="text-green-600">Your subscription is active until {formattedExpiryDate}</p>
            ) : (
              <p className="text-green-600">You have lifetime access to premium features</p>
            )}
          </div>
        </div>
        <Button
          variant="outline" 
          className="border-green-500 text-green-700 hover:bg-green-50"
          onClick={onRefresh}
        >
          Refresh Status
        </Button>
      </div>
    </div>
  );
};

export default PremiumStatus;
