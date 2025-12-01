import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/data/models";

interface FilterSidebarProps {
  selectedCategories: string[];
  selectedPricing: string[];
  selectedCapabilities: string[];
  onCategoryChange: (category: string) => void;
  onPricingChange: (pricing: string) => void;
  onCapabilityChange: (capability: string) => void;
  onClearAll: () => void;
}

export const FilterSidebar = ({
  selectedCategories,
  selectedPricing,
  selectedCapabilities,
  onCategoryChange,
  onPricingChange,
  onCapabilityChange,
  onClearAll,
}: FilterSidebarProps) => {
  const pricingOptions = ["free", "freemium", "paid"];
  const capabilityOptions = ["text", "image", "audio", "video", "code", "agent"];

  return (
    <div className="w-64 flex-shrink-0 sticky top-4 h-fit">
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-auto p-0 text-xs text-primary hover:text-primary/80"
          >
            Clear all
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.slug)}
                    onCheckedChange={() => onCategoryChange(category.slug)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm text-muted-foreground cursor-pointer flex-1"
                  >
                    {category.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {category.modelCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Pricing</h4>
            <div className="space-y-2">
              {pricingOptions.map((pricing) => (
                <div key={pricing} className="flex items-center space-x-2">
                  <Checkbox
                    id={`pricing-${pricing}`}
                    checked={selectedPricing.includes(pricing)}
                    onCheckedChange={() => onPricingChange(pricing)}
                  />
                  <Label
                    htmlFor={`pricing-${pricing}`}
                    className="text-sm text-muted-foreground cursor-pointer capitalize"
                  >
                    {pricing}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Capabilities</h4>
            <div className="space-y-2">
              {capabilityOptions.map((capability) => (
                <div key={capability} className="flex items-center space-x-2">
                  <Checkbox
                    id={`capability-${capability}`}
                    checked={selectedCapabilities.includes(capability)}
                    onCheckedChange={() => onCapabilityChange(capability)}
                  />
                  <Label
                    htmlFor={`capability-${capability}`}
                    className="text-sm text-muted-foreground cursor-pointer capitalize"
                  >
                    {capability}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
