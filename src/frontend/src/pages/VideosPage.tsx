import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";
import { motion } from "motion/react";
import { getYoutubeEmbedUrl, useVideos } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

export default function VideosPage() {
  const { data: videos, isLoading } = useVideos();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="section-divider" />
        <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground">
          Videos
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Watch our latest news coverage
        </p>
      </div>

      {isLoading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="videos.loading_state"
        >
          {SKELETON_KEYS.map((k) => (
            <div
              key={k}
              className="bg-card rounded border border-border overflow-hidden"
            >
              <Skeleton className="aspect-video w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && videos?.length === 0 && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="videos.empty_state"
        >
          No videos yet.
        </div>
      )}

      {!isLoading && videos && videos.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="videos.list"
        >
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              className="bg-card rounded overflow-hidden border border-border group"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              data-ocid={`videos.item.${i + 1}`}
            >
              <div className="aspect-video relative">
                <iframe
                  src={getYoutubeEmbedUrl(video.url)}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Play className="w-4 h-4 text-primary fill-primary" />
                </div>
                <h3 className="font-headline text-sm font-semibold text-foreground leading-snug">
                  {video.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
