import { Link } from "@tanstack/react-router";
import { Calendar, User } from "lucide-react";
import { CATEGORY_LABELS, useLanguage } from "../contexts/LanguageContext";
import { type NewsWithId, formatDate } from "../hooks/useQueries";

interface NewsCardProps {
  article: NewsWithId;
  index?: number;
  featured?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  india: "bg-orange-600",
  gujarat: "bg-green-700",
  world: "bg-blue-700",
  politics: "bg-purple-700",
  sports: "bg-yellow-600",
  business: "bg-teal-700",
  entertainment: "bg-pink-700",
};

const PLACEHOLDER_IMG =
  "/assets/uploads/1774156124339_2-019d1c24-b238-7579-9b21-89e93942a0c7-4.png";

export function NewsCard({
  article,
  index = 0,
  featured = false,
}: NewsCardProps) {
  const { language } = useLanguage();
  const catLabel =
    CATEGORY_LABELS[article.category]?.[language] ?? article.category;
  const catColor = CATEGORY_COLORS[article.category] ?? "bg-muted";
  const articleId = encodeURIComponent(article.id);

  if (featured) {
    return (
      <Link
        to="/news/$id"
        params={{ id: articleId }}
        className="block relative overflow-hidden rounded group news-card-hover"
        data-ocid={`news.item.${index + 1}`}
      >
        <div className="aspect-[16/9] relative">
          <img
            src={article.imageUrl || PLACEHOLDER_IMG}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {article.isBreaking && (
            <span className="inline-block bg-primary text-xs font-bold text-white px-2 py-0.5 mb-2 uppercase tracking-wider">
              Breaking
            </span>
          )}
          <span
            className={`category-badge inline-block text-white px-2 py-0.5 rounded mb-2 ${catColor}`}
          >
            {catLabel}
          </span>
          <h2 className="font-headline text-white text-xl md:text-2xl font-bold leading-tight line-clamp-2">
            {article.title}
          </h2>
          <div className="flex items-center gap-3 mt-2 text-white/70 text-xs">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/news/$id"
      params={{ id: articleId }}
      className="block bg-card rounded overflow-hidden group news-card-hover border border-border"
      data-ocid={`news.item.${index + 1}`}
    >
      <div className="aspect-[16/9] overflow-hidden relative">
        <img
          src={article.imageUrl || PLACEHOLDER_IMG}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {article.isBreaking && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-0.5 uppercase tracking-wider">
            Breaking
          </span>
        )}
      </div>
      <div className="p-4">
        <span
          className={`category-badge text-white px-2 py-0.5 rounded ${catColor}`}
        >
          {catLabel}
        </span>
        <h3 className="font-headline text-foreground text-base font-semibold mt-2 mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <div className="flex items-center gap-3 text-muted-foreground text-xs">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {article.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(article.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
