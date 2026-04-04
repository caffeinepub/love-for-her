import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import type { PhotoEntry } from "../backend";
import { useGetAllPhotoEntries } from "../hooks/useQueries";

function Lightbox({
  photo,
  onClose,
}: {
  photo: PhotoEntry;
  onClose: () => void;
}) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: dismissable overlay
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
      data-ocid="gallery.modal"
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation */}
      <div
        className="relative max-w-4xl max-h-[90vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.dataUrl}
          alt={photo.caption || "Photo"}
          className="rounded-2xl object-contain max-h-[80vh] w-auto mx-auto shadow-2xl"
          style={{ border: "2px solid oklch(0.78 0.10 65 / 0.4)" }}
        />
        {photo.caption && (
          <p
            className="text-center mt-4 font-dancing text-white/90 text-lg"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
          >
            {photo.caption}
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-colors"
          data-ocid="gallery.close_button"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function GallerySection() {
  const { data: photos, isLoading } = useGetAllPhotoEntries();
  const [lightbox, setLightbox] = useState<PhotoEntry | null>(null);

  return (
    <section id="gallery" className="py-20 px-6" data-ocid="gallery.section">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="flex-1 max-w-24 h-px bg-gradient-to-r from-transparent to-gold-custom" />
            <span className="text-gold-custom text-xl">✦</span>
            <span className="flex-1 max-w-24 h-px bg-gradient-to-l from-transparent to-gold-custom" />
          </div>
          <h2
            className="font-playfair text-foreground mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 600 }}
          >
            Photo Gallery
          </h2>
          <p className="font-lato text-muted-foreground text-sm tracking-widest uppercase">
            Memories we cherish
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="flex-1 max-w-24 h-px bg-gradient-to-r from-transparent to-gold-custom" />
            <span className="text-gold-custom text-xl">✦</span>
            <span className="flex-1 max-w-24 h-px bg-gradient-to-l from-transparent to-gold-custom" />
          </div>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-6"
            data-ocid="gallery.loading_state"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((photo, idx) => (
              <button
                type="button"
                key={photo.id}
                onClick={() => setLightbox(photo)}
                className="relative group rounded-2xl overflow-hidden aspect-square cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-left"
                style={{
                  boxShadow: "0 4px 20px 0 oklch(0.22 0.015 15 / 0.10)",
                  border: "1.5px solid oklch(0.85 0.030 30)",
                }}
                data-ocid={`gallery.item.${idx + 1}`}
              >
                <img
                  src={photo.dataUrl}
                  alt={photo.caption || `Photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Caption overlay */}
                {photo.caption && (
                  <div
                    className="absolute inset-x-0 bottom-0 py-3 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                    }}
                  >
                    <p className="font-dancing text-white text-sm truncate">
                      {photo.caption}
                    </p>
                  </div>
                )}

                {/* Heart badge */}
                <div
                  className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{
                    background: "oklch(0.58 0.085 10 / 0.9)",
                    color: "white",
                  }}
                >
                  ♥
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20 rounded-3xl"
            style={{
              background: "oklch(0.94 0.022 40)",
              border: "1.5px dashed oklch(0.78 0.10 65 / 0.4)",
            }}
            data-ocid="gallery.empty_state"
          >
            <div className="text-6xl mb-6 animate-float-heart">📸</div>
            <h3 className="font-playfair text-foreground text-xl mb-2">
              No photos yet
            </h3>
            <p className="font-lato text-muted-foreground text-sm">
              Visit the Admin panel to upload your beautiful memories ♥
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}
