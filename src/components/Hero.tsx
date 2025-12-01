import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroProps {
  onSearch: (query: string) => void;
}

export const Hero = ({ onSearch }: HeroProps) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-hero-gradient-start to-hero-gradient-end border border-border mb-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,217,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,217,255,0.1),transparent_50%)]" />
      
      <div className="relative px-8 py-16 lg:px-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">120+ AI Models Available</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              Discover the world's smartest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                AI models
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Soch AI Store brings together chatbots, agents, copilots and generative models in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Exploring
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
                Submit Your Model
              </Button>
            </div>

            <div className="flex gap-8 text-sm">
              <div>
                <div className="text-2xl font-bold text-foreground">120+</div>
                <div className="text-muted-foreground">AI Models</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">24</div>
                <div className="text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">500K+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl bg-card border border-card-border p-4 flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
