import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, MessageSquare, Image, Code, Zap, Mic, BookOpen, Bot, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/data/models";
import { Navbar } from "@/components/Navbar";

const iconMap: { [key: string]: any } = {
  MessageSquare,
  Image,
  Code,
  Zap,
  Mic,
  BookOpen,
  Bot,
  Palette,
};

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Browse by Category
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore AI models organized by their primary use case
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon];
            return (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <Card className="group h-full border-card-border bg-card hover:bg-card-hover hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                        {IconComponent && (
                          <IconComponent className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-xs font-medium text-primary">
                          {category.modelCount} models
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Categories;
