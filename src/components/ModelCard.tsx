import { Link } from "react-router-dom";
import { Star, ExternalLink } from "lucide-react";
import { AiModel } from "@/types/model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ModelCardProps {
  model: AiModel;
}

export const ModelCard = ({ model }: ModelCardProps) => {
  const formatInstalls = (count?: number) => {
    if (!count) return "New";
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K+`;
    return `${count}+`;
  };

  return (
    <Card className="group overflow-hidden border-card-border bg-card hover:bg-card-hover hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      <Link to={`/model/${model.id}`}>
        <CardContent className="p-4">
          <div className="flex gap-3 mb-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/20">
              <span className="text-2xl font-bold text-primary">
                {model.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {model.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                by {model.provider}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {model.shortDescription}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="secondary" className="text-xs">
              {model.category}
            </Badge>
            {model.pricing === "free" && (
              <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
                Free
              </Badge>
            )}
            {model.pricing === "freemium" && (
              <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                Freemium
              </Badge>
            )}
            {model.isApiAvailable && (
              <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                API
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span className="font-medium text-foreground">{model.rating}</span>
              <span>({model.reviewsCount.toLocaleString()})</span>
            </div>
            <div>{formatInstalls(model.installsCount)} uses</div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
          >
            View Details
            <ExternalLink className="w-3.5 h-3.5 ml-2" />
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};
