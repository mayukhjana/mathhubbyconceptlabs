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
    description?: string;
    year: string;
    isPremium: boolean;
    downloadUrl?: string;
    solutionUrl?: string;
    practiceUrl?: string;
    examBoard: string;
    isAttempted?: boolean;
  }[];
}

interface ChapterAccordionProps {
  chapters: Chapter[];
  userIsPremium?: boolean;
}

const ChapterAccordion = ({ chapters, userIsPremium = false }: ChapterAccordionProps) => {
  console.log("Rendering ChapterAccordion with chapters:", chapters);
  
  return (
    <Accordion type="single" collapsible className="w-full">
      {chapters.map((chapter) => (
        <AccordionItem key={chapter.id} value={chapter.id}>
          <AccordionTrigger className="text-left font-medium hover:text-mathprimary">
            {chapter.title}
            <span className="text-sm text-muted-foreground font-normal ml-2">
              ({chapter.papers.length} {chapter.papers.length === 1 ? 'paper' : 'papers'})
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {chapter.papers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {chapter.papers.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    title={paper.title}
                    description={paper.description || `${paper.examBoard} ${paper.year}`}
                    year={paper.year}
                    isPremium={paper.isPremium}
                    userIsPremium={userIsPremium}
                    downloadUrl={paper.downloadUrl}
                    solutionUrl={paper.solutionUrl}
                    practiceUrl={paper.practiceUrl}
                    examBoard={paper.examBoard}
                    isAttempted={paper.isAttempted}
                  />
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No papers available for this chapter yet
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChapterAccordion;
