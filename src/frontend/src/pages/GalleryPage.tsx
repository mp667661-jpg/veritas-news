import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useGallery } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export default function GalleryPage() {
  const { data: items, isLoading } = useGallery();
  const [selected, setSelected] = useState<string | null>(null);

  const selectedItem = items?.find((i) => i.id === selected);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="section-divider" />
        <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground">
          Photo Gallery
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Exclusive coverage and moments
        </p>
      </div>

      {isLoading && (
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          data-ocid="gallery.loading_state"
        >
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="aspect-square w-full rounded" />
          ))}
        </div>
      )}

      {!isLoading && items?.length === 0 && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="gallery.empty_state"
        >
          No gallery items yet.
        </div>
      )}

      {!isLoading && items && items.length > 0 && (
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          data-ocid="gallery.list"
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id)}
              className="aspect-square overflow-hidden rounded group relative cursor-pointer border border-border"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              data-ocid={`gallery.item.${i + 1}`}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                <span className="text-white text-xs font-semibold p-3 line-clamp-2">
                  {item.title}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && selectedItem && (
        <dialog
          open
          className="fixed inset-0 w-full h-full bg-black/90 z-50 flex items-center justify-center p-4 border-0 max-w-none max-h-none m-0"
          onClick={() => setSelected(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelected(null);
          }}
          data-ocid="gallery.modal"
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setSelected(null)}
            aria-label="Close"
            data-ocid="gallery.close_button"
          >
            <X className="w-8 h-8" />
          </button>
          <motion.img
            src={selectedItem.imageUrl}
            alt={selectedItem.title}
            className="max-w-full max-h-full object-contain rounded"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-white/80 text-sm">{selectedItem.title}</p>
          </div>
        </dialog>
      )}
    </div>
  );
}
