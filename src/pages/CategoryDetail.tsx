import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelCard } from "@/components/ModelCard";
import { CategoryChip } from "@/components/CategoryChip";
import { aiModels, categories } from "@/data/models";
import { Navbar } from "@/components/Navbar";

const CategoryDetail = () => {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const category = categories.find((c) => c.slug === slug);

  const filteredModels = useMemo(() => {
    if (!category) return [];

    let models = aiModels.filter((m) => m.category === category.slug);

    switch (sortBy) {
      case "popular":
        models = models.sort((a, b) => (b.installsCount || 0) - (a.installsCount || 0));
        break;
      case "newest":
        models = models.sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
        break;
      case "rating":
        models = models.sort((a, b) => b.rating - a.rating);
        break;
    }

    return models;
  }, [category, sortBy]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Category not found</h1>
          <Link to="/categories">
            <Button variant="outline">Back to Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  const sortOptions = [
    { value: "popular", label: "Popular" },
    { value: "newest", label: "Newest" },
    { value: "rating", label: "Top Rated" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8">
        <Link to="/categories">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Categories
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3 capitalize">
            {category.name}
          </h1>
          <p className="text-lg text-muted-foreground">{category.description}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {filteredModels.length} models available
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
          {sortOptions.map((option) => (
            <CategoryChip
              key={option.value}
              label={option.label}
              isActive={sortBy === option.value}
              onClick={() => setSortBy(option.value)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No models found in this category
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryDetail;
