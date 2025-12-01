import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const CategoryChip = ({ label, isActive, onClick }: CategoryChipProps) => {
  return (
    <Badge
      variant={isActive ? "default" : "outline"}
      className={cn(
        "cursor-pointer px-4 py-2 text-sm font-medium transition-all hover:scale-105",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border hover:border-primary/50 hover:bg-primary/10"
      )}
      onClick={onClick}
    >
      {label}
    </Badge>
  );
};
