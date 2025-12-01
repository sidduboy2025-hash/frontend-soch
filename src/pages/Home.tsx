import { useState, useMemo, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { HorizontalCarousel } from "@/components/HorizontalCarousel";
import { ModelCard } from "@/components/ModelCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { CategoryChip } from "@/components/CategoryChip";
import { categories } from "@/data/models";
import { Navbar } from "@/components/Navbar";
import { modelsAPI, Model } from "@/api/api-methods";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChip, setSelectedChip] = useState("All");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chips = ["All", "Chatbots", "Agents", "Image", "Code", "Productivity", "Voice", "Research"];

  // Fetch models from API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await modelsAPI.getAllModels({ limit: 100 }); // Get more models initially
        setModels(response.data.models);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch models');
        console.error('Error fetching models:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Transform Model to match AiModel structure
  const transformModel = (model: Model) => ({
    id: model._id,
    slug: model.slug,
    name: model.name,
    shortDescription: model.shortDescription,
    longDescription: model.longDescription || '',
    category: model.category,
    tags: model.tags || [],
    provider: model.provider,
    pricing: model.pricing,
    rating: model.rating,
    reviewsCount: model.reviewsCount,
    installsCount: model.installsCount,
    capabilities: model.capabilities,
    isApiAvailable: model.isApiAvailable,
    isOpenSource: model.isOpenSource,
    lastUpdated: model.updatedAt,
    modelType: model.modelType || '',
    externalUrl: model.externalUrl || '',
    iconUrl: model.iconUrl,
    screenshots: model.screenshots,
    featured: model.featured,
    trendingScore: model.trendingScore,
    bestFor: model.bestFor,
    features: model.features,
    examplePrompts: model.examplePrompts
  });

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      const matchesSearch =
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesChip =
        selectedChip === "All" ||
        model.category.toLowerCase() === selectedChip.toLowerCase();

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(model.category);

      const matchesPricing =
        selectedPricing.length === 0 || selectedPricing.includes(model.pricing);

      const matchesCapabilities =
        selectedCapabilities.length === 0 ||
        selectedCapabilities.some((cap) => model.capabilities.includes(cap as any));

      return (
        matchesSearch &&
        matchesChip &&
        matchesCategory &&
        matchesPricing &&
        matchesCapabilities
      );
    });
  }, [searchQuery, selectedChip, selectedCategories, selectedPricing, selectedCapabilities]);

  const trendingModels = useMemo(
    () =>
      [...models]
        .filter((m) => m.trendingScore)
        .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
        .slice(0, 6)
        .map(transformModel),
    [models]
  );

  const newModels = useMemo(
    () =>
      [...models]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 6)
        .map(transformModel),
    [models]
  );

  const featuredModels = useMemo(
    () => models.filter((m) => m.featured).slice(0, 6).map(transformModel),
    [models]
  );

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPricing([]);
    setSelectedCapabilities([]);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const togglePricing = (pricing: string) => {
    setSelectedPricing((prev) =>
      prev.includes(pricing) ? prev.filter((p) => p !== pricing) : [...prev, pricing]
    );
  };

  const toggleCapability = (capability: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(capability)
        ? prev.filter((c) => c !== capability)
        : [...prev, capability]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8">
        <Hero onSearch={setSearchQuery} />

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {chips.map((chip) => (
              <CategoryChip
                key={chip}
                label={chip}
                isActive={selectedChip === chip}
                onClick={() => setSelectedChip(chip)}
              />
            ))}
          </div>
        </div>

        {!searchQuery && selectedChip === "All" && (
          <div className="mb-12 space-y-8">
            {loading ? (
              // Loading skeletons
              <div className="space-y-8">
                <div>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-40 mb-4" />
                  <div className="flex gap-4 overflow-x-hidden">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-80 flex-shrink-0">
                        <Skeleton className="h-48 w-full rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-40 mb-4" />
                  <div className="flex gap-4 overflow-x-hidden">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-80 flex-shrink-0">
                        <Skeleton className="h-48 w-full rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-40 mb-4" />
                  <div className="flex gap-4 overflow-x-hidden">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-80 flex-shrink-0">
                        <Skeleton className="h-48 w-full rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <HorizontalCarousel
                  title="🔥 Trending AI Models"
                  description="Most popular models this week"
                >
                  {trendingModels.map((model) => (
                    <div key={model._id} className="w-80 flex-shrink-0 snap-start">
                      <ModelCard model={model} />
                    </div>
                  ))}
                </HorizontalCarousel>

                <HorizontalCarousel
                  title="✨ New & Noteworthy"
                  description="Recently added and updated"
                >
                  {newModels.map((model) => (
                    <div key={model._id} className="w-80 flex-shrink-0 snap-start">
                      <ModelCard model={model} />
                    </div>
                  ))}
                </HorizontalCarousel>

                <HorizontalCarousel
                  title="⭐ Featured Models"
                  description="Hand-picked by our team"
                >
                  {featuredModels.map((model) => (
                    <div key={model._id} className="w-80 flex-shrink-0 snap-start">
                      <ModelCard model={model} />
                    </div>
                  ))}
                </HorizontalCarousel>
              </>
            )}
          </div>
        )}

        <div className="flex gap-6">
          <div className="hidden lg:block">
            <FilterSidebar
              selectedCategories={selectedCategories}
              selectedPricing={selectedPricing}
              selectedCapabilities={selectedCapabilities}
              onCategoryChange={toggleCategory}
              onPricingChange={togglePricing}
              onCapabilityChange={toggleCapability}
              onClearAll={handleClearFilters}
            />
          </div>

          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {searchQuery
                  ? `Search Results (${filteredModels.length})`
                  : "All Models"}
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {filteredModels.map((model) => (
                    <ModelCard key={model._id} model={transformModel(model)} />
                  ))}
                </div>

                {filteredModels.length === 0 && !loading && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg mb-2">
                      No models found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
