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
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { LoveQuote, Shayari } from "../backend";
import { ExternalBlob } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddLoveQuote,
  useAddPhotoEntry,
  useAddShayari,
  useDeleteLoveQuote,
  useDeletePhotoEntry,
  useDeleteShayari,
  useEditLoveQuote,
  useEditShayari,
  useGetAllLoveQuotes,
  useGetAllPhotoEntries,
  useGetAllShayari,
  useIsCallerAdmin,
} from "../hooks/useQueries";
import { storeSessionParameter } from "../utils/urlParams";

// ---- Shayari Tab ----
function ShayariTab() {
  const { data: items, isLoading } = useGetAllShayari();
  const addMutation = useAddShayari();
  const editMutation = useEditShayari();
  const deleteMutation = useDeleteShayari();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editOrder, setEditOrder] = useState(1);

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newOrder, setNewOrder] = useState(1);

  const startEdit = (s: Shayari) => {
    setEditingId(s.id);
    setEditTitle(s.title);
    setEditBody(s.body);
    setEditOrder(Number(s.order));
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (!editingId) return;
    await editMutation.mutateAsync({
      id: editingId,
      title: editTitle,
      body: editBody,
      order: BigInt(editOrder),
    });
    toast.success("Shayari updated!");
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!newTitle.trim() || !newBody.trim()) {
      toast.error("Title and body are required.");
      return;
    }
    await addMutation.mutateAsync({
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      body: newBody.trim(),
      order: BigInt(newOrder),
    });
    toast.success("Shayari added!");
    setNewTitle("");
    setNewBody("");
    setNewOrder(1);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    toast.success("Shayari deleted.");
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
          Add New Shayari
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="new-shayari-title">Title</Label>
            <Input
              id="new-shayari-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Dil Ki Baat"
              data-ocid="shayari.input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-shayari-order">Order</Label>
            <Input
              id="new-shayari-order"
              type="number"
              min={1}
              value={newOrder}
              onChange={(e) => setNewOrder(Number(e.target.value))}
              data-ocid="shayari.input"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-shayari-body">
            Body (use Enter for line breaks)
          </Label>
          <Textarea
            id="new-shayari-body"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            rows={4}
            placeholder="Tujhe dekh ke aankhein sharmati hain..."
            data-ocid="shayari.textarea"
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={addMutation.isPending}
          className="rounded-full"
          style={{ background: "oklch(0.58 0.085 10)", color: "white" }}
          data-ocid="shayari.submit_button"
        >
          {addMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Add Shayari
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="shayari.loading_state">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-3">
          {(items ?? []).map((s, idx) => (
            <div
              key={s.id}
              className="rounded-xl p-5"
              style={{
                background: "white",
                border: "1px solid oklch(0.85 0.030 30)",
              }}
              data-ocid={`shayari.item.${idx + 1}`}
            >
              {editingId === s.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                        data-ocid="shayari.input"
                      />
                    </div>
                    <Input
                      type="number"
                      value={editOrder}
                      onChange={(e) => setEditOrder(Number(e.target.value))}
                      placeholder="Order"
                      data-ocid="shayari.input"
                    />
                  </div>
                  <Textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={3}
                    data-ocid="shayari.textarea"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={saveEdit}
                      disabled={editMutation.isPending}
                      data-ocid="shayari.save_button"
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
                      data-ocid="shayari.cancel_button"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-playfair font-semibold text-foreground mb-1">
                      {s.title}
                    </p>
                    <p className="font-lato text-muted-foreground text-sm line-clamp-2">
                      {s.body.split("\n")[0]}
                    </p>
                    <p className="font-lato text-xs text-muted-foreground mt-1">
                      Order: {Number(s.order)}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(s)}
                      data-ocid="shayari.edit_button"
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          data-ocid="shayari.delete_button"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="shayari.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Shayari?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="shayari.cancel_button">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(s.id)}
                            className="bg-destructive text-destructive-foreground"
                            data-ocid="shayari.confirm_button"
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
              data-ocid="shayari.empty_state"
            >
              No shayari yet. Add your first one above!
            </p>
          )}
        </div>
      )}
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
          style={{ background: "oklch(0.58 0.085 10)", color: "white" }}
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
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
      setUploadProgress(0);
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let blob = ExternalBlob.fromBytes(bytes);
      blob = blob.withUploadProgress((pct) => setUploadProgress(pct));

      await addMutation.mutateAsync({
        id: crypto.randomUUID(),
        order: BigInt(order),
        blob,
        caption: caption.trim(),
      });

      toast.success("Photo uploaded!");
      setCaption("");
      setOrder(1);
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setUploadProgress(null);
    } catch {
      toast.error("Upload failed. Please try again.");
      setUploadProgress(null);
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
                ? "oklch(0.58 0.085 10)"
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

        {uploadProgress !== null && (
          <div className="space-y-1" data-ocid="gallery.loading_state">
            <p className="font-lato text-xs text-muted-foreground">
              Uploading... {Math.round(uploadProgress)}%
            </p>
            <div className="h-2 rounded-full overflow-hidden bg-border">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${uploadProgress}%`,
                  background: "oklch(0.58 0.085 10)",
                }}
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={addMutation.isPending || !selectedFile}
          className="rounded-full"
          style={{ background: "oklch(0.58 0.085 10)", color: "white" }}
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
                src={p.blob.getDirectURL()}
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
                      background: "oklch(0.50 0.115 10 / 0.85)",
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

// ---- Token Entry Screen ----
function TokenEntryScreen({ onSignOut }: { onSignOut: () => void }) {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleClaimAccess = async () => {
    if (!token.trim()) {
      toast.error("Please enter the admin token.");
      return;
    }
    setIsSubmitting(true);
    storeSessionParameter("caffeineAdminToken", token.trim());
    await queryClient.invalidateQueries();
    window.location.reload();
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
          "linear-gradient(160deg, oklch(0.94 0.022 40) 0%, oklch(0.97 0.008 20) 100%)",
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
              style={{ color: "oklch(0.58 0.085 10)" }}
            />
          </div>
          <h2 className="font-playfair text-2xl font-semibold text-foreground mb-2">
            Enter Admin Token
          </h2>
          <p className="font-lato text-muted-foreground text-sm">
            Enter the secret token to claim admin access.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-token">Admin Secret Token</Label>
            <Input
              id="admin-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your secret token..."
              className="rounded-xl"
              data-ocid="admin.input"
            />
          </div>

          <Button
            onClick={handleClaimAccess}
            disabled={isSubmitting || !token.trim()}
            className="w-full rounded-full py-3"
            style={{ background: "oklch(0.58 0.085 10)", color: "white" }}
            data-ocid="admin.primary_button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
              </>
            ) : (
              "Claim Admin Access"
            )}
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
            "linear-gradient(160deg, oklch(0.94 0.022 40) 0%, oklch(0.97 0.008 20) 100%)",
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
            style={{ background: "oklch(0.58 0.085 10)", color: "white" }}
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

  if (!isAdmin) {
    return <TokenEntryScreen onSignOut={clear} />;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.94 0.022 40) 0%, oklch(0.97 0.008 20) 100%)",
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
            onClick={clear}
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
            Add, edit, and delete content shown on the site.
          </p>
        </div>

        <Tabs defaultValue="shayari" data-ocid="admin.panel">
          <TabsList
            className="mb-8 rounded-full p-1"
            style={{ background: "oklch(0.94 0.022 40)" }}
          >
            <TabsTrigger
              value="shayari"
              className="rounded-full font-lato"
              data-ocid="admin.tab"
            >
              ✦ Shayari
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

          <TabsContent value="shayari">
            <ShayariTab />
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
