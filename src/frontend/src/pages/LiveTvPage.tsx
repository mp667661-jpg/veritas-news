import { Radio, Tv } from "lucide-react";
import { getYoutubeEmbedUrl, useLiveTvUrl } from "../hooks/useQueries";

export default function LiveTvPage() {
  const { data: liveTvUrl, isLoading } = useLiveTvUrl();

  const embedUrl = liveTvUrl ? getYoutubeEmbedUrl(liveTvUrl) : "";

  return (
    <div data-ocid="live.section">
      {/* Header banner */}
      <div className="bg-primary/10 border-b border-primary/30 py-4 px-4">
        <div className="container mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Radio className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="font-headline font-bold text-xl text-foreground">
              Live TV
            </h1>
            <p className="text-muted-foreground text-sm">
              Veritas News — The Untold Indian
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Player */}
      <div className="w-full bg-black" style={{ minHeight: "60vh" }}>
        {isLoading && (
          <div
            className="flex items-center justify-center h-96 text-muted-foreground"
            data-ocid="live.loading_state"
          >
            <Tv className="w-12 h-12 opacity-30 animate-pulse" />
          </div>
        )}

        {!isLoading && !embedUrl && (
          <div
            className="flex flex-col items-center justify-center h-96 text-muted-foreground gap-4"
            data-ocid="live.empty_state"
          >
            <Tv className="w-16 h-16 opacity-30" />
            <p className="text-lg font-semibold">Live stream coming soon</p>
            <p className="text-sm">
              The live TV stream will be available shortly.
            </p>
          </div>
        )}

        {!isLoading && embedUrl && (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title="Veritas News Live"
            className="w-full"
            style={{ height: "75vh", minHeight: "400px" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            data-ocid="live.canvas_target"
          />
        )}
      </div>

      {/* Info */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-card rounded-lg border border-border p-5">
          <h2 className="font-headline font-bold text-lg text-foreground mb-2">
            About Veritas News Live
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Watch Veritas News live 24/7 for breaking news, in-depth analysis,
            and exclusive coverage from across India and the world. Our team of
            dedicated journalists brings you the stories that matter, the truth
            that needs to be told.
          </p>
        </div>
      </div>
    </div>
  );
}
