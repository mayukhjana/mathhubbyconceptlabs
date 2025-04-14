
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Upload {
  id: string;
  name: string;
  board: string;
  class: string;
  year: string;
}

interface RecentUploadsProps {
  uploads: Upload[];
  title?: string;
  description?: string;
}

const RecentUploads = ({ uploads, title = "Recent Uploads", description = "Recently uploaded exam papers" }: RecentUploadsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {uploads.length > 0 ? (
          <ul className="space-y-3">
            {uploads.map(upload => (
              <li key={upload.id} className="border rounded-md p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{upload.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {upload.board} Class {upload.class}
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 p-1 rounded">
                    <Check size={14} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">No recent uploads</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentUploads;
