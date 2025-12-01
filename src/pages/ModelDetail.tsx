import { useParams, Link } from "react-router-dom";
import { Star, ExternalLink, Clock, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { ModelCard } from "@/components/ModelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { modelsAPI, Model } from "@/api/api-methods";
import { useToast } from "@/hooks/use-toast";
import { AiModel } from "@/types/model";

const ModelDetail = () => {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [model, setModel] = useState<Model | null>(null);
  const [similarModels, setSimilarModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;

    const fetchModelDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch the specific model
        const modelResponse = await modelsAPI.getModelById(id);
        setModel(modelResponse.data.model);

        // Fetch similar models from the same category
        const similarResponse = await modelsAPI.getAllModels({
          category: modelResponse.data.model.category,
          limit: 4
        });
        
        // Filter out the current model and limit to 3
        const filtered = similarResponse.data.models
          .filter(m => m._id !== modelResponse.data.model._id)
          .slice(0, 3);
        setSimilarModels(filtered);
      } catch (error: any) {
        setError(error.message);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchModelDetails();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex gap-6">
                <Skeleton className="w-24 h-24 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Model not found</h1>
          <p className="text-muted-foreground mb-4">
            {error || "The requested model could not be found."}
          </p>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Transform Model to AiModel for ModelCard compatibility
  const transformModelForCard = (m: Model): AiModel => ({
    id: m._id,
    slug: m.slug,
    name: m.name,
    shortDescription: m.shortDescription,
    longDescription: m.longDescription || '',
    category: m.category,
    tags: m.tags,
    provider: m.provider,
    pricing: m.pricing,
    rating: m.rating,
    reviewsCount: m.reviewsCount,
    installsCount: m.installsCount,
    capabilities: m.capabilities,
    isApiAvailable: m.isApiAvailable,
    isOpenSource: m.isOpenSource,
    lastUpdated: m.updatedAt,
    modelType: m.modelType || '',
    externalUrl: m.externalUrl || '',
    iconUrl: m.iconUrl,
    screenshots: m.screenshots,
    featured: m.featured,
    trendingScore: m.trendingScore,
    bestFor: m.bestFor,
    features: m.features,
    examplePrompts: m.examplePrompts,
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Store
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/20">
                {model.iconUrl ? (
                  <img src={model.iconUrl} alt={model.name} className="w-20 h-20 rounded-xl object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-primary">
                    {model.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">{model.category}</Badge>
                  {model.pricing === "free" && (
                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                      Free
                    </Badge>
                  )}
                  {model.pricing === "freemium" && (
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                      Freemium
                    </Badge>
                  )}
                  {model.pricing === "paid" && (
                    <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                      Paid
                    </Badge>
                  )}
                  {model.isApiAvailable && (
                    <Badge variant="outline" className="border-primary/50 text-primary">
                      API Available
                    </Badge>
                  )}
                  {model.featured && (
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                      Featured
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {model.name}
                </h1>
                <p className="text-muted-foreground mb-3">
                  by {model.provider}
                  {model.uploadedBy && (
                    <span className="ml-2 text-xs">
                      (uploaded by {model.uploadedBy.firstName} {model.uploadedBy.lastName})
                    </span>
                  )}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{model.rating}</span>
                    <span className="text-muted-foreground">
                      ({model.reviewsCount.toLocaleString()} reviews)
                    </span>
                  </div>
                  {model.installsCount !== undefined && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span>{model.installsCount.toLocaleString()} installs</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Updated {formatDate(model.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {model.externalUrl && (
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href={model.externalUrl} target="_blank" rel="noopener noreferrer">
                    Open Model
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              )}
              <Button size="lg" variant="outline">
                Add to Workspace
              </Button>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {model.longDescription || model.shortDescription}
              </p>
            </div>

            {model.bestFor && model.bestFor.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">Best For</h2>
                <div className="flex flex-wrap gap-2">
                  {model.bestFor.map((item, index) => (
                    <Badge key={index} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {model.features && model.features.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  Key Features
                </h2>
                <div className="grid gap-3">
                  {model.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-muted-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {model.examplePrompts && model.examplePrompts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  Example Prompts
                </h2>
                <div className="space-y-2">
                  {model.examplePrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="p-4 bg-muted/30 border border-border rounded-lg font-mono text-sm text-muted-foreground"
                    >
                      {prompt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {model.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Model Type</div>
                  <div className="text-foreground font-medium">{model.modelType}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Provider</div>
                  <div className="text-foreground font-medium">{model.provider}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Pricing</div>
                  <div className="text-foreground font-medium capitalize">
                    {model.pricing}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Capabilities</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.capabilities.map((cap, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>
                {model.isOpenSource && (
                  <>
                    <Separator />
                    <div>
                      <Badge variant="outline" className="border-green-500/50 text-green-400">
                        Open Source
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {similarModels.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Models</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {similarModels.map((similar) => (
                    <div key={similar._id}>
                      <ModelCard model={transformModelForCard(similar)} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelDetail;
