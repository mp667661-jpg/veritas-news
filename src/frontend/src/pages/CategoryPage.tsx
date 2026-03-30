import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { NewsCategory } from "../backend";
import { NewsCard } from "../components/NewsCard";
import { CATEGORY_LABELS, useLanguage } from "../contexts/LanguageContext";
import { useNewsByCategory } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

export default function CategoryPage() {
  const { cat } = useParams({ from: "/category/$cat" });
  const category = cat as NewsCategory;
  const { language } = useLanguage();
  const { data: articles, isLoading } = useNewsByCategory(category);
  const label = CATEGORY_LABELS[category]?.[language] ?? category;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="section-divider" />
        <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground">
          {label}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {articles?.length ?? 0} articles
        </p>
      </div>

      {isLoading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="category.loading_state"
        >
          {SKELETON_KEYS.map((k) => (
            <div
              key={k}
              className="bg-card rounded overflow-hidden border border-border"
            >
              <Skeleton className="aspect-[16/9] w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && articles?.length === 0 && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="category.empty_state"
        >
          No articles in this category yet.
        </div>
      )}

      {!isLoading && articles && articles.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="category.list"
        >
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <NewsCard article={article} index={i} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
