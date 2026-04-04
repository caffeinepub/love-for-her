import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { PhotoEntry } from "../backend";
import { useAddPhotoEntry, useGetAllPhotoEntries } from "../hooks/useQueries";

// Compress image to a data URL, resizing so the longer side is at most maxPx
// and encoding as JPEG at the given quality (0–1).
function compressImage(
  file: File,
  maxPx = 1200,
  quality = 0.82,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width >= height) {
          height = Math.round((height * maxPx) / width);
          width = maxPx;
        } else {
          width = Math.round((width * maxPx) / height);
          height = maxPx;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

function Lightbox({
  photo,
  onClose,
}: {
  photo: { src: string; caption: string };
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
          src={photo.src}
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

function PhotoCard({
  src,
  caption,
  ocid,
  onClick,
}: {
  src: string;
  caption: string;
  ocid: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative group rounded-2xl overflow-hidden aspect-square cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-left w-full"
      style={{
        boxShadow: "0 4px 20px 0 oklch(0.22 0.015 15 / 0.10)",
        border: "1.5px solid oklch(0.85 0.030 30)",
      }}
      data-ocid={ocid}
    >
      <img
        src={src}
        alt={caption || "Photo"}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {caption && (
        <div
          className="absolute inset-x-0 bottom-0 py-3 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          }}
        >
          <p className="font-dancing text-white text-sm truncate">{caption}</p>
        </div>
      )}
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
  );
}

function ShareMemoryForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const addPhoto = useAddPhotoEntry();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept files up to 20MB; we'll compress them down
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Photo too large. Please use a photo under 20MB.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      setPreview(compressed);
    } catch {
      // Fallback: read as-is
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !preview) {
      toast.error("Please select a photo first ♥");
      return;
    }

    try {
      const entry: PhotoEntry = {
        id: crypto.randomUUID(),
        dataUrl: preview,
        mimeType: "image/jpeg",
        caption: caption.trim(),
        order: BigInt(Date.now()),
      };

      await addPhoto.mutateAsync(entry);

      toast.success("Memory shared! ♥");
      setCaption("");
      setSelectedFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error("Failed to share memory. Please try again.");
    }
  };

  const isBusy = compressing || addPhoto.isPending;

  return (
    <Card
      className="mt-12 max-w-md mx-auto"
      style={{
        background: "oklch(0.97 0.012 20)",
        border: "1.5px solid oklch(0.85 0.045 15)",
        boxShadow:
          "0 8px 40px oklch(0.58 0.085 10 / 0.12), 0 2px 8px oklch(0.22 0.015 15 / 0.06)",
      }}
      data-ocid="gallery.panel"
    >
      <CardContent className="pt-6 pb-8 px-6">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2 animate-float-heart">📸</div>
          <h3 className="font-playfair text-foreground text-xl font-semibold mb-1">
            Share Your Memory ♥
          </h3>
          <p className="font-lato text-muted-foreground text-sm">
            Upload a photo and share it with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preview */}
          {(preview || compressing) && (
            <div className="relative rounded-xl overflow-hidden aspect-square w-32 mx-auto mb-2 bg-muted flex items-center justify-center">
              {compressing ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <img
                    src={preview!}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setSelectedFile(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          )}

          {/* File picker */}
          <div className="space-y-1.5">
            <Label
              htmlFor="photo-upload"
              className="font-lato text-xs font-semibold text-foreground/70 uppercase tracking-wider"
            >
              Choose Photo
            </Label>
            <div
              className="relative rounded-xl overflow-hidden"
              style={{ border: "1.5px dashed oklch(0.78 0.10 65 / 0.5)" }}
            >
              <Input
                ref={fileRef}
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border-0 bg-transparent cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:cursor-pointer"
                data-ocid="gallery.upload_button"
              />
            </div>
            <p className="font-lato text-muted-foreground text-xs">
              Max size: 20MB. Photo is automatically compressed before upload.
            </p>
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <Label
              htmlFor="photo-caption"
              className="font-lato text-xs font-semibold text-foreground/70 uppercase tracking-wider"
            >
              Caption (optional)
            </Label>
            <Input
              id="photo-caption"
              type="text"
              placeholder="Write something sweet… ♥"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={120}
              className="font-dancing text-base"
              style={{ border: "1.5px solid oklch(0.85 0.045 15)" }}
              data-ocid="gallery.input"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isBusy || !selectedFile}
            className="w-full font-lato font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.085 10), oklch(0.50 0.115 10))",
              color: "white",
              boxShadow: "0 4px 18px oklch(0.58 0.085 10 / 0.35)",
              border: "none",
            }}
            data-ocid="gallery.submit_button"
          >
            {isBusy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {compressing ? "Preparing…" : "Sharing…"}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Share Memory ♥
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function GallerySection() {
  const { data: dynamicPhotos, isLoading } = useGetAllPhotoEntries();
  const [lightbox, setLightbox] = useState<{
    src: string;
    caption: string;
  } | null>(null);

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

        {/* Photo grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-6"
            data-ocid="gallery.loading_state"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : dynamicPhotos && dynamicPhotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {dynamicPhotos.map((photo, idx) => (
              <PhotoCard
                key={photo.id}
                src={photo.dataUrl}
                caption={photo.caption}
                ocid={`gallery.item.${idx + 1}`}
                onClick={() =>
                  setLightbox({ src: photo.dataUrl, caption: photo.caption })
                }
              />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-10 rounded-2xl"
            style={{
              background: "oklch(0.94 0.022 40)",
              border: "1.5px dashed oklch(0.78 0.10 65 / 0.35)",
            }}
            data-ocid="gallery.empty_state"
          >
            <p className="font-dancing text-foreground/60 text-lg">
              Be the first to share a memory ♥ — use the form below!
            </p>
          </div>
        )}

        {/* Public upload form */}
        <ShareMemoryForm />
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}
