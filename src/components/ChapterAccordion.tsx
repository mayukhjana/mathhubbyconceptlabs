
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PaperCard from "@/components/PaperCard";

export interface Chapter {
  id: string;
  title: string;
  papers: {
    id: string;
    title: string;
    description: string;
    year: string;
    isPremium: boolean;
    downloadUrl?: string;
    practiceUrl?: string;
    examBoard: string;
  }[];
}

interface ChapterAccordionProps {
  chapters: Chapter[];
  userIsPremium?: boolean;
}

const ChapterAccordion = ({ chapters, userIsPremium = false }: ChapterAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {chapters.map((chapter) => (
        <AccordionItem key={chapter.id} value={chapter.id}>
          <AccordionTrigger className="text-left font-medium hover:text-mathprimary">
            {chapter.title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {chapter.papers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  title={paper.title}
                  description={paper.description}
                  year={paper.year}
                  isPremium={paper.isPremium}
                  userIsPremium={userIsPremium}
                  downloadUrl={paper.downloadUrl}
                  practiceUrl={paper.practiceUrl}
                  examBoard={paper.examBoard}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChapterAccordion;
