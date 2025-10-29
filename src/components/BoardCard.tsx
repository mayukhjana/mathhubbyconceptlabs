
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface BoardCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  paperCount: number;
}

const BoardCard = ({ id, title, description, image, paperCount }: BoardCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 group">
      <div className="h-48 overflow-hidden">
        <img 
          src="/wbbse-logo.png" 
          alt={title} 
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-mathdark dark:text-white group-hover:text-mathprimary transition-colors">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-muted-foreground text-sm">{description}</p>
        <p className="text-sm mt-2 font-medium text-mathdark dark:text-gray-300">{paperCount} Papers Available</p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button asChild className="w-full bg-mathprimary hover:bg-mathprimary/90 dark:bg-blue-600 dark:hover:bg-blue-700">
          <Link to={`/boards/${id}`} className="flex items-center justify-center gap-2">
            <span>View Papers</span>
            <ChevronRight size={16} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BoardCard;
