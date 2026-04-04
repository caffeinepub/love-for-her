import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  KeyRound,
  Loader2,
  Music,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { LoveQuote } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddLoveQuote,
  useAddPhotoEntry,
  useClearHeroPhoto,
  useClearMusicTrack,
  useDeleteLoveQuote,
  useDeletePhotoEntry,
  useEditLoveQuote,
  useGetAllLoveQuotes,
  useGetAllPhotoEntries,
  useGetHeroPhoto,
  useGetMusicTrack,
  useIsCallerAdmin,
  useSetHeroPhoto,
  useSetMusicTrack,
} from "../hooks/useQueries";

const ADMIN_PASSWORD = "qazwsxplmokn123098";

// ---- Shared image compression utility ----
async function compressImage(
  file: File,
  maxWidth = 1920,
  quality = 0.82,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---- Hero Photo Tab ----
function HeroPhotoTab() {
  const { data: heroPhoto, isLoading } = useGetHeroPhoto();
  const setHeroPhoto = useSetHeroPhoto();
  const clearHeroPhoto = useClearHeroPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a photo first.");
      return;
    }
    try {
      toast.loading("Compressing and uploading...", { id: "hero-upload" });
      const dataUrl = await compressImage(selectedFile, 1920, 0.85);
      await setHeroPhoto.mutateAsync({
        dataUrl,
        mimeType: "image/jpeg",
      });
      toast.success("Hero photo updated! ♥", { id: "hero-upload" });
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Upload failed. Please try again.", { id: "hero-upload" });
    }
  };

  const handleClear = async () => {
    await clearHeroPhoto.mutateAsync();
    toast.success("Hero photo removed.");
  };

  return (
    <div className="space-y-8">
      {/* Current hero photo */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "oklch(0.94 0.022 40)",
          border: "1px solid oklch(0.78 0.10 65 / 0.3)",
        }}
      >
        <h3 className="font-playfair font-semibold text-foreground text-lg">
          Current Hero Photo
        </h3>
        {isLoading ? (
          <Skeleton
            className="w-full h-48 rounded-xl"
            data-ocid="hero.loading_state"
          />
        ) : heroPhoto?.dataUrl ? (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={heroPhoto.dataUrl}
                alt="Current hero"
                className="w-full max-h-64 object-cover"
              />
              <div
                className="absolute inset-0 flex items-end p-4"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                }}
              >
                <p className="font-lato text-white text-sm">
                  Current hero photo
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-full"
                  data-ocid="hero.delete_button"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Remove Photo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="hero.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Hero Photo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    The site will show the default background. This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="hero.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClear}
                    className="bg-destructive text-destructive-foreground"
                    data-ocid="hero.confirm_button"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div
            className="rounded-xl p-8 text-center"
            style={{
              background: "oklch(0.92 0.018 30)",
              border: "1.5px dashed oklch(0.78 0.10 65 / 0.4)",
            }}
            data-ocid="hero.empty_state"
          >
            <ImagePlus className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
            <p className="font-lato text-muted-foreground text-sm">
              No hero photo set. Upload one below.
            </p>
          </div>
        )}
      </div>

      {/* Upload new photo */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "oklch(0.94 0.022 40)",
          border: "1px solid oklch(0.78 0.10 65 / 0.3)",
        }}
      >
        <h3 className="font-playfair font-semibold text-foreground text-lg">
          Upload New Hero Photo
        </h3>
        <p className="font-lato text-muted-foreground text-sm">
          This photo will be displayed as the full-screen background on the
          homepage.
        </p>

        <div className="space-y-2">
          <Label htmlFor="hero-photo-file">Choose Photo</Label>
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-rose-custom"
            style={{
              borderColor: previewUrl
                ? "oklch(0.52 0.105 10)"
                : "oklch(0.78 0.10 65 / 0.5)",
            }}
            data-ocid="hero.dropzone"
          >
            {previewUrl ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-lg object-contain"
                />
                <p className="font-lato text-sm text-muted-foreground">
                  {selectedFile?.name}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="rounded-full"
                  data-ocid="hero.cancel_button"
                >
                  <X className="w-3 h-3 mr-1" /> Clear
                </Button>
              </div>
            ) : (
              <label
                htmlFor="hero-photo-file"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <ImagePlus className="w-10 h-10 text-muted-foreground" />
                <p className="font-lato text-sm text-muted-foreground">
                  Click to select her photo
                </p>
              </label>
            )}
            <input
              ref={fileInputRef}
              id="hero-photo-file"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              data-ocid="hero.upload_button"
            />
          </div>
        </div>

        <Button
          onClick={handleUpload}
          disabled={setHeroPhoto.isPending || !selectedFile}
          className="rounded-full"
          style={{ background: "oklch(0.52 0.105 10)", color: "white" }}
          data-ocid="hero.submit_button"
        >
          {setHeroPhoto.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          Set as Hero Photo
        </Button>
      </div>
    </div>
  );
}

// ---- Music Tab ----
function MusicTab() {
  const { data: track, isLoading } = useGetMusicTrack();
  const setMusicTrack = useSetMusicTrack();
  const clearMusicTrack = useClearMusicTrack();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Warn about large files
    if (file.size > 5 * 1024 * 1024) {
      toast.warning(
        "This file is larger than 5MB. Large audio files may take a long time to upload and could affect performance. Consider using a shorter clip.",
      );
    }
    setSelectedFile(file);
    // Auto-fill title from filename if empty
    if (!title) {
      const name = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setTitle(name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an audio file first.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title for the track.");
      return;
    }
    try {
      toast.loading("Uploading music...", { id: "music-upload" });
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });
      await setMusicTrack.mutateAsync({
        dataUrl,
        mimeType: selectedFile.type,
        title: title.trim(),
      });
      toast.success("Music track uploaded! ♪", { id: "music-upload" });
      setTitle("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Upload failed. Please try again.", { id: "music-upload" });
    }
  };

  const handleClear = async () => {
    await clearMusicTrack.mutateAsync();
    toast.success("Music track removed.");
  };

  return (
    <div className="space-y-8">
      {/* Current track */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "oklch(0.94 0.022 40)",
          border: "1px solid oklch(0.78 0.10 65 / 0.3)",
        }}
      >
        <h3 className="font-playfair font-semibold text-foreground text-lg">
          Current Music Track
        </h3>
        {isLoading ? (
          <Skeleton
            className="h-16 rounded-xl"
            data-ocid="music.loading_state"
          />
        ) : track ? (
          <div
            className="flex items-center gap-4 rounded-xl p-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.35 0.095 10 / 0.12) 0%, oklch(0.76 0.11 65 / 0.08) 100%)",
              border: "1px solid oklch(0.52 0.105 10 / 0.3)",
            }}
            data-ocid="music.panel"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.52 0.105 10 / 0.15)" }}
            >
              <Music className="w-5 h-5 text-rose-custom" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="font-dancing text-foreground truncate"
                style={{ fontSize: "1.1rem" }}
              >
                {track.title}
              </p>
              <p className="font-lato text-muted-foreground text-xs mt-0.5">
                {track.mimeType}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-full flex-shrink-0"
                  data-ocid="music.delete_button"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Remove
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="music.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Music Track?</AlertDialogTitle>
                  <AlertDialogDescription>
                    The music player will no longer appear on the site.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="music.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClear}
                    className="bg-destructive text-destructive-foreground"
                    data-ocid="music.confirm_button"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div
            className="rounded-xl p-8 text-center"
            style={{
              background: "oklch(0.92 0.018 30)",
              border: "1.5px dashed oklch(0.78 0.10 65 / 0.4)",
            }}
            data-ocid="music.empty_state"
          >
            <Music className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
            <p className="font-lato text-muted-foreground text-sm">
              No music track set. Upload one below.
            </p>
          </div>
        )}
      </div>

      {/* Upload new track */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "oklch(0.94 0.022 40)",
          border: "1px solid oklch(0.78 0.10 65 / 0.3)",
        }}
      >
        <h3 className="font-playfair font-semibold text-foreground text-lg">
          Upload New Track
        </h3>

        <div
          className="rounded-xl p-4"
          style={{
            background: "oklch(0.88 0.055 65 / 0.25)",
            border: "1px solid oklch(0.76 0.11 65 / 0.4)",
          }}
        >
          <p
            className="font-lato text-sm"
            style={{ color: "oklch(0.50 0.08 45)" }}
          >
            ⚠️ Audio files can be very large. We recommend short clips under 5MB
            for best performance.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="music-title">Track Title</Label>
          <Input
            id="music-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Our Song, Tum Hi Ho..."
            data-ocid="music.input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="music-file">Audio File</Label>
          <div
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors hover:border-rose-custom"
            style={{
              borderColor: selectedFile
                ? "oklch(0.52 0.105 10)"
                : "oklch(0.78 0.10 65 / 0.5)",
            }}
            data-ocid="music.dropzone"
          >
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <Music className="w-8 h-8 text-rose-custom" />
                <p className="font-lato text-sm text-foreground font-medium">
                  {selectedFile.name}
                </p>
                <p className="font-lato text-xs text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="rounded-full mt-1"
                  data-ocid="music.cancel_button"
                >
                  <X className="w-3 h-3 mr-1" /> Clear
                </Button>
              </div>
            ) : (
              <label
                htmlFor="music-file"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Music className="w-10 h-10 text-muted-foreground" />
                <p className="font-lato text-sm text-muted-foreground">
                  Click to select audio (MP3, AAC, OGG...)
                </p>
              </label>
            )}
            <input
              ref={fileInputRef}
              id="music-file"
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={handleFileChange}
              data-ocid="music.upload_button"
            />
          </div>
        </div>

        <Button
          onClick={handleUpload}
          disabled={setMusicTrack.isPending || !selectedFile || !title.trim()}
          className="rounded-full"
          style={{ background: "oklch(0.52 0.105 10)", color: "white" }}
          data-ocid="music.submit_button"
        >
          {setMusicTrack.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Music className="w-4 h-4 mr-2" />
          )}
          Upload Track
        </Button>
      </div>
    </div>
  );
}

// ---- Quotes Tab ----
function QuotesTab() {
  const { data: items, isLoading } = useGetAllLoveQuotes();
  const addMutation = useAddLoveQuote();
  const editMutation = useEditLoveQuote();
  const deleteMutation = useDeleteLoveQuote();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  const [newText, setNewText] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const startEdit = (q: LoveQuote) => {
    setEditingId(q.id);
    setEditText(q.text);
    setEditAuthor(q.author ?? "");
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (!editingId) return;
    await editMutation.mutateAsync({
      id: editingId,
      text: editText,
      author: editAuthor.trim() || undefined,
    });
    toast.success("Quote updated!");
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!newText.trim()) {
      toast.error("Quote text is required.");
      return;
    }
    await addMutation.mutateAsync({
      id: crypto.randomUUID(),
      text: newText.trim(),
      author: newAuthor.trim() || undefined,
    });
    toast.success("Quote added!");
    setNewText("");
    setNewAuthor("");
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    toast.success("Quote deleted.");
  };

  return (
    <div className="space-y-8">
      {/* Add form */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "oklch(0.94 0.022 40)",
          border: "1px solid oklch(0.78 0.10 65 / 0.3)",
        }}
      >
        <h3 className="font-playfair font-semibold text-foreground text-lg">
          Add New Quote
        </h3>
        <div className="space-y-2">
          <Label htmlFor="new-quote-text">Quote Text</Label>
          <Textarea
            id="new-quote-text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={3}
            placeholder="You are every reason, every hope..."
            data-ocid="quotes.textarea"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-quote-author">Author (optional)</Label>
          <Input
            id="new-quote-author"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            placeholder="e.g. Nicholas Sparks"
            data-ocid="quotes.input"
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={addMutation.isPending}
          className="rounded-full"
          style={{ background: "oklch(0.52 0.105 10)", color: "white" }}
          data-ocid="quotes.submit_button"
        >
          {addMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Add Quote
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="quotes.loading_state">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-3">
          {(items ?? []).map((q, idx) => (
            <div
              key={q.id}
              className="rounded-xl p-5"
              style={{
                background: "white",
                border: "1px solid oklch(0.85 0.030 30)",
              }}
              data-ocid={`quotes.item.${idx + 1}`}
            >
              {editingId === q.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    data-ocid="quotes.textarea"
                  />
                  <Input
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    placeholder="Author (optional)"
                    data-ocid="quotes.input"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={saveEdit}
                      disabled={editMutation.isPending}
                      data-ocid="quotes.save_button"
                    >
                      {editMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelEdit}
                      data-ocid="quotes.cancel_button"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-lato text-foreground text-sm line-clamp-2">
                      {q.text}
                    </p>
                    {q.author && (
                      <p className="font-lato text-muted-foreground text-xs mt-1">
                        — {q.author}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(q)}
                      data-ocid="quotes.edit_button"
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          data-ocid="quotes.delete_button"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="quotes.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Quote?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="quotes.cancel_button">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(q.id)}
                            className="bg-destructive text-destructive-foreground"
                            data-ocid="quotes.confirm_button"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </div>
          ))}
          {(items ?? []).length === 0 && (
            <p
              className="text-center text-muted-foreground font-lato py-8"
              data-ocid="quotes.empty_state"
            >
              No quotes yet. Add your first one above!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---- Photos Tab ----
function PhotosTab() {
  const { data: photos, isLoading } = useGetAllPhotoEntries();
  const addMutation = useAddPhotoEntry();
  const deleteMutation = useDeletePhotoEntry();

  const [caption, setCaption] = useState("");
  const [order, setOrder] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a photo first.");
      return;
    }
    try {
      const dataUrl = await compressImage(selectedFile, 1920, 0.82);
      await addMutation.mutateAsync({
        id: crypto.randomUUID(),
        order: BigInt(order),
        dataUrl,
        mimeType: "image/jpeg",
        caption: caption.trim(),
      });
      toast.success("Photo uploaded!");
      setCaption("");
      setOrder(1);
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch {
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    toast.success("Photo deleted.");
  };

  return (
    <div className="space-y-8">
      {/* Upload form */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "oklch(0.94 0.022 40)",
          border: "1px solid oklch(0.78 0.10 65 / 0.3)",
        }}
      >
        <h3 className="font-playfair font-semibold text-foreground text-lg">
          Upload New Photo
        </h3>

        <div className="space-y-2">
          <Label htmlFor="photo-file">Choose Photo</Label>
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-rose-custom"
            style={{
              borderColor: previewUrl
                ? "oklch(0.52 0.105 10)"
                : "oklch(0.78 0.10 65 / 0.5)",
            }}
            data-ocid="gallery.dropzone"
          >
            {previewUrl ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-40 rounded-lg object-contain"
                />
                <p className="font-lato text-sm text-muted-foreground">
                  {selectedFile?.name}
                </p>
              </div>
            ) : (
              <label
                htmlFor="photo-file"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-10 h-10 text-muted-foreground" />
                <p className="font-lato text-sm text-muted-foreground">
                  Click to select a photo
                </p>
              </label>
            )}
            <input
              id="photo-file"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              data-ocid="gallery.upload_button"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="photo-caption">Caption</Label>
            <Input
              id="photo-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="A beautiful memory..."
              data-ocid="gallery.input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo-order">Order</Label>
            <Input
              id="photo-order"
              type="number"
              min={1}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              data-ocid="gallery.input"
            />
          </div>
        </div>

        <Button
          onClick={handleUpload}
          disabled={addMutation.isPending || !selectedFile}
          className="rounded-full"
          style={{ background: "oklch(0.52 0.105 10)", color: "white" }}
          data-ocid="gallery.upload_button"
        >
          {addMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          Upload Photo
        </Button>
      </div>

      {/* Photos grid */}
      {isLoading ? (
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          data-ocid="gallery.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : photos && photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((p, idx) => (
            <div
              key={p.id}
              className="relative rounded-xl overflow-hidden aspect-square group"
              style={{ border: "1px solid oklch(0.85 0.030 30)" }}
              data-ocid={`gallery.item.${idx + 1}`}
            >
              <img
                src={p.dataUrl}
                alt={p.caption || `Photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {p.caption && (
                <div
                  className="absolute inset-x-0 bottom-0 p-2"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  }}
                >
                  <p className="font-dancing text-white text-sm truncate">
                    {p.caption}
                  </p>
                </div>
              )}
              {/* Delete button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0 rounded-full"
                    style={{
                      background: "oklch(0.44 0.125 10 / 0.85)",
                      color: "white",
                    }}
                    data-ocid="gallery.delete_button"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent data-ocid="gallery.dialog">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-ocid="gallery.cancel_button">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(p.id)}
                      className="bg-destructive text-destructive-foreground"
                      data-ocid="gallery.confirm_button"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="gallery.empty_state"
        >
          <p className="font-playfair text-lg">
            No photos yet. Upload your first memory above!
          </p>
        </div>
      )}
    </div>
  );
}

// ---- Password Entry Screen ----
function PasswordEntryScreen({ onSignOut }: { onSignOut: () => void }) {
  const [token, setToken] = useState("");
  const queryClient = useQueryClient();

  const handleClaimAccess = async () => {
    if (!token.trim()) {
      toast.error("Please enter the admin password.");
      return;
    }
    if (token.trim() === ADMIN_PASSWORD) {
      sessionStorage.setItem("localAdminUnlocked", "true");
      await queryClient.invalidateQueries();
      window.location.reload();
    } else {
      toast.error("Incorrect password.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClaimAccess();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.94 0.022 40) 0%, oklch(0.95 0.012 22) 100%)",
      }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-10"
        style={{
          background: "white",
          boxShadow: "0 8px 48px 0 oklch(0.22 0.015 15 / 0.10)",
          border: "1px solid oklch(0.85 0.030 30)",
        }}
        data-ocid="admin.card"
      >
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "oklch(0.94 0.022 40)" }}
          >
            <KeyRound
              className="w-7 h-7"
              style={{ color: "oklch(0.52 0.105 10)" }}
            />
          </div>
          <h2 className="font-playfair text-2xl font-semibold text-foreground mb-2">
            Admin Access
          </h2>
          <p className="font-lato text-muted-foreground text-sm">
            Enter your admin password to continue.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-token">Admin Password</Label>
            <Input
              id="admin-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your admin password..."
              className="rounded-xl"
              data-ocid="admin.input"
            />
          </div>

          <Button
            onClick={handleClaimAccess}
            disabled={!token.trim()}
            className="w-full rounded-full py-3"
            style={{ background: "oklch(0.52 0.105 10)", color: "white" }}
            data-ocid="admin.primary_button"
          >
            Unlock Admin Panel
          </Button>
        </div>

        <div
          className="mt-6 pt-6 flex items-center justify-center gap-4"
          style={{ borderTop: "1px solid oklch(0.92 0.015 30)" }}
        >
          <Button
            onClick={onSignOut}
            variant="outline"
            size="sm"
            className="rounded-full"
            data-ocid="admin.secondary_button"
          >
            Sign Out
          </Button>
          <Link
            to="/"
            className="font-lato text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            data-ocid="admin.link"
          >
            <ArrowLeft className="w-3 h-3" /> Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---- Admin Page ----
export default function AdminPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();
  const [localAdminUnlocked, setLocalAdminUnlocked] = useState(
    () => sessionStorage.getItem("localAdminUnlocked") === "true",
  );

  const handleSignOut = () => {
    sessionStorage.removeItem("localAdminUnlocked");
    setLocalAdminUnlocked(false);
    clear();
  };

  if (isInitializing || isCheckingAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-rose-custom mx-auto mb-4" />
          <p className="font-lato text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.94 0.022 40) 0%, oklch(0.95 0.012 22) 100%)",
        }}
      >
        <div
          className="w-full max-w-md rounded-3xl p-10 text-center"
          style={{
            background: "white",
            boxShadow: "0 8px 48px 0 oklch(0.22 0.015 15 / 0.10)",
            border: "1px solid oklch(0.85 0.030 30)",
          }}
          data-ocid="admin.card"
        >
          <div className="text-5xl mb-4 animate-heartbeat">♥</div>
          <h1 className="font-playfair text-2xl font-semibold text-foreground mb-2">
            Admin Panel
          </h1>
          <p className="font-lato text-muted-foreground text-sm mb-8">
            Sign in to manage your love story content.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="w-full rounded-full py-3"
            style={{ background: "oklch(0.52 0.105 10)", color: "white" }}
            data-ocid="admin.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <div className="mt-6">
            <Link
              to="/"
              className="font-lato text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              data-ocid="admin.link"
            >
              <ArrowLeft className="w-3 h-3" /> Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin && !localAdminUnlocked) {
    return <PasswordEntryScreen onSignOut={handleSignOut} />;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.94 0.022 40) 0%, oklch(0.95 0.012 22) 100%)",
      }}
    >
      {/* Admin header */}
      <header
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border"
        style={{ boxShadow: "0 1px 8px 0 oklch(0.22 0.015 15 / 0.05)" }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="admin.link"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="font-playfair font-semibold text-foreground">
                Admin Panel
              </span>
              <span className="ml-2 text-rose-custom text-sm">♥</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="rounded-full"
            data-ocid="admin.secondary_button"
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-playfair text-3xl font-semibold text-foreground mb-1">
            Manage Your Love Story
          </h1>
          <p className="font-lato text-muted-foreground text-sm">
            Add, edit, and manage content shown on the site.
          </p>
        </div>

        <Tabs defaultValue="hero" data-ocid="admin.panel">
          <TabsList
            className="mb-8 rounded-full p-1 flex-wrap h-auto gap-1"
            style={{ background: "oklch(0.94 0.022 40)" }}
          >
            <TabsTrigger
              value="hero"
              className="rounded-full font-lato"
              data-ocid="admin.tab"
            >
              🖼 Hero Photo
            </TabsTrigger>
            <TabsTrigger
              value="music"
              className="rounded-full font-lato"
              data-ocid="admin.tab"
            >
              🎵 Music
            </TabsTrigger>
            <TabsTrigger
              value="quotes"
              className="rounded-full font-lato"
              data-ocid="admin.tab"
            >
              ❝ Quotes
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="rounded-full font-lato"
              data-ocid="admin.tab"
            >
              📸 Photos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <HeroPhotoTab />
          </TabsContent>
          <TabsContent value="music">
            <MusicTab />
          </TabsContent>
          <TabsContent value="quotes">
            <QuotesTab />
          </TabsContent>
          <TabsContent value="photos">
            <PhotosTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
