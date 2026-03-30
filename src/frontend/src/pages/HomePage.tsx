import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Play, Tv } from "lucide-react";
import { motion } from "motion/react";
import { NewsCategory } from "../backend";
import { NewsCard } from "../components/NewsCard";
import { CATEGORY_LABELS, useLanguage } from "../contexts/LanguageContext";
import {
  getYoutubeEmbedUrl,
  useFeaturedNews,
  useLatestNews,
  useNewsByCategory,
  useVideos,
} from "../hooks/useQueries";

const SKELETON_KEYS_3 = ["sk1", "sk2", "sk3"];
const SKELETON_KEYS_4 = ["sk1", "sk2", "sk3", "sk4"];

function NewsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {SKELETON_KEYS_3.map((k) => (
        <div
          key={k}
          className="bg-card rounded overflow-hidden border border-border"
        >
          <Skeleton className="aspect-[16/9] w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CategorySection({ category }: { category: NewsCategory }) {
  const { data: articles, isLoading } = useNewsByCategory(category);
  const { language } = useLanguage();
  const label = CATEGORY_LABELS[category]?.[language] ?? category;

  if (isLoading) return null;
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="section-divider" />
          <h2 className="font-headline font-bold text-xl text-foreground">
            {label}
          </h2>
        </div>
        <Link
          to="/category/$cat"
          params={{ cat: category }}
          className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
          data-ocid="home.link"
        >
          More <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.slice(0, 3).map((article, i) => (
          <NewsCard key={article.id} article={article} index={i} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { data: latestNews, isLoading: loadingLatest } = useLatestNews(9);
  const { data: featuredNews, isLoading: loadingFeatured } = useFeaturedNews();
  const { data: videos } = useVideos();

  const heroArticle = featuredNews?.[0] ?? latestNews?.[0];
  const sideArticles = latestNews?.slice(0, 5) ?? [];
  const gridArticles = latestNews?.slice(0, 9) ?? [];

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-10" data-ocid="home.section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            {loadingFeatured || loadingLatest ? (
              <Skeleton className="aspect-[16/9] w-full rounded" />
            ) : heroArticle ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <NewsCard article={heroArticle} index={0} featured />
              </motion.div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            {loadingLatest
              ? SKELETON_KEYS_4.map((k) => (
                  <Skeleton key={k} className="h-20 w-full rounded" />
                ))
              : sideArticles.slice(1, 5).map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <Link
                      to="/news/$id"
                      params={{ id: encodeURIComponent(article.id) }}
                      className="flex gap-3 bg-card rounded p-3 border border-border group hover:border-primary/50 transition-colors"
                      data-ocid={`home.item.${i + 1}`}
                    >
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-20 h-14 object-cover rounded shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="min-w-0">
                        <span className="text-primary text-xs font-bold uppercase tracking-wider">
                          {CATEGORY_LABELS[article.category]?.en ??
                            article.category}
                        </span>
                        <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
                          {article.title}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="section-divider" />
            <h2 className="font-headline font-bold text-xl text-foreground">
              Latest News
            </h2>
          </div>
        </div>
        {loadingLatest ? (
          <NewsGridSkeleton />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="home.list"
          >
            {gridArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <NewsCard article={article} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {(
        [
          NewsCategory.gujarat,
          NewsCategory.india,
          NewsCategory.politics,
          NewsCategory.sports,
        ] as NewsCategory[]
      ).map((cat) => (
        <CategorySection key={cat} category={cat} />
      ))}

      {videos && videos.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-divider" />
              <h2 className="font-headline font-bold text-xl text-foreground">
                Videos
              </h2>
            </div>
            <Link
              to="/videos"
              className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
              data-ocid="home.link"
            >
              All Videos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.slice(0, 3).map((video, i) => (
              <div
                key={video.id}
                className="bg-card rounded overflow-hidden border border-border"
                data-ocid={`home.item.${i + 1}`}
              >
                <div className="aspect-video">
                  <iframe
                    src={getYoutubeEmbedUrl(video.url)}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <Link
          to="/live"
          className="flex items-center justify-between bg-gradient-to-r from-primary/90 to-primary/60 rounded-lg p-6 group hover:from-primary hover:to-primary/80 transition-all"
          data-ocid="home.button"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Play className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <div className="text-white font-headline font-bold text-xl">
                Watch Live TV
              </div>
              <div className="text-white/80 text-sm">
                Stream Veritas News live, anytime
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Tv className="w-6 h-6" />
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </section>
    </div>
  );
}
