import { ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HorizontalCarouselProps {
  title: string;
  description?: string;
  viewAllLink?: string;
  children: ReactNode;
}

export const HorizontalCarousel = ({
  title,
  description,
  viewAllLink,
  children,
}: HorizontalCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
              View all
            </Button>
          )}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto horizontal-scroll pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "thin" }}
      >
        {children}
      </div>
    </div>
  );
};
