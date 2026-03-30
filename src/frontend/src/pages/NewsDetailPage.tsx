import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Share2, Tag, User } from "lucide-react";
import { motion } from "motion/react";
import { SiFacebook, SiWhatsapp, SiX } from "react-icons/si";
import { CATEGORY_LABELS } from "../contexts/LanguageContext";
import { useLanguage } from "../contexts/LanguageContext";
import { formatDate, useNewsById } from "../hooks/useQueries";

const PLACEHOLDER_IMG =
  "/assets/uploads/1774156124339_2-019d1c24-b238-7579-9b21-89e93942a0c7-4.png";

export default function NewsDetailPage() {
  const { id } = useParams({ from: "/news/$id" });
  const {
    data: article,
    isLoading,
    isError,
  } = useNewsById(decodeURIComponent(id));
  const { language } = useLanguage();

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = article ? encodeURIComponent(article.title) : "";

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
  };

  return (
    <article
      className="container mx-auto px-4 py-8 max-w-3xl"
      data-ocid="news.section"
    >
      <Link
        to="/"
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-6"
        data-ocid="news.link"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {isLoading && (
        <div className="space-y-4" data-ocid="news.loading_state">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="aspect-[16/9] w-full rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      )}

      {isError && (
        <div className="text-center py-12" data-ocid="news.error_state">
          <p className="text-muted-foreground">Article not found.</p>
          <Link
            to="/"
            className="text-primary hover:underline mt-2 inline-block"
          >
            Back to Home
          </Link>
        </div>
      )}

      {article && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            {article.isBreaking && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 uppercase tracking-wider">
                Breaking
              </span>
            )}
            <span className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {CATEGORY_LABELS[article.category]?.[language] ??
                article.category}
            </span>
          </div>

          <h1 className="font-headline font-bold text-2xl md:text-3xl lg:text-4xl text-foreground leading-tight mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-6 pb-4 border-b border-border">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="uppercase text-xs font-semibold bg-muted px-2 py-0.5 rounded">
              {article.language}
            </span>
          </div>

          <div className="mb-6 rounded overflow-hidden">
            <img
              src={article.imageUrl || PLACEHOLDER_IMG}
              alt={article.title}
              className="w-full object-cover max-h-96"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none mb-8">
            {article.content.split("\n").map((para, i) =>
              para.trim() ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: paragraph index is stable for static content
                <p key={i} className="text-foreground/90 leading-relaxed mb-4">
                  {para}
                </p>
              ) : null,
            )}
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Share this article:
              </span>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="news.button"
              >
                <Button
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-600 text-white gap-1.5"
                >
                  <SiFacebook className="w-3.5 h-3.5" /> Facebook
                </Button>
              </a>
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="news.button"
              >
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-500 text-white gap-1.5"
                >
                  <SiWhatsapp className="w-3.5 h-3.5" /> WhatsApp
                </Button>
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="news.button"
              >
                <Button
                  size="sm"
                  className="bg-black hover:bg-zinc-900 text-white gap-1.5"
                >
                  <SiX className="w-3.5 h-3.5" /> Twitter
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </article>
  );
}
