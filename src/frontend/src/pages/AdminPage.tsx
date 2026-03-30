import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  Edit,
  Eye,
  EyeOff,
  Image,
  Loader2,
  MessageSquare,
  Newspaper,
  Plus,
  Save,
  Settings,
  Share2,
  Star,
  Trash2,
  Tv,
  UserCog,
  Video,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Language, NewsCategory, UserRole } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type NewsWithId,
  formatDate,
  useAddGalleryItem,
  useAddVideo,
  useAllNews,
  useCallerRole,
  useContactMessages,
  useCreateNews,
  useDeleteContactMessage,
  useDeleteGalleryItem,
  useDeleteNews,
  useDeleteVideo,
  useGallery,
  useIsAdmin,
  useLiveTvUrl,
  useSocialLinks,
  useUpdateLiveTv,
  useUpdateSocialLinks,
  useVideos,
} from "../hooks/useQueries";

function ArticleForm({
  onSuccess,
  editArticle,
}: { onSuccess: () => void; editArticle?: NewsWithId }) {
  const [title, setTitle] = useState(editArticle?.title ?? "");
  const [content, setContent] = useState(editArticle?.content ?? "");
  const [author, setAuthor] = useState(editArticle?.author ?? "");
  const [imageUrl, setImageUrl] = useState(editArticle?.imageUrl ?? "");
  const [language, setLanguage] = useState<Language>(
    editArticle?.language ?? Language.en,
  );
  const [category, setCategory] = useState<NewsCategory>(
    editArticle?.category ?? NewsCategory.india,
  );
  const [isPublished, setIsPublished] = useState(
    editArticle?.isPublished ?? true,
  );
  const [isBreaking, setIsBreaking] = useState(
    editArticle?.isBreaking ?? false,
  );
  const [isFeatured, setIsFeatured] = useState(
    editArticle?.isFeatured ?? false,
  );
  const { mutate: createNews, isPending } = useCreateNews();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) {
      toast.error("Title, content, and author are required");
      return;
    }
    createNews(
      {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        imageUrl: imageUrl.trim() || undefined,
        language,
        category,
        isPublished,
        isBreaking,
        isFeatured,
      },
      {
        onSuccess: (id) => {
          toast.success(`Article created! ID: ${id}`);
          onSuccess();
        },
        onError: (err) => toast.error(`Failed: ${err}`),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-ocid="admin.panel">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-1">
          <Label className="text-foreground">Title *</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            required
            className="bg-input"
            data-ocid="admin.input"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-foreground">Author *</Label>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
            required
            className="bg-input"
            data-ocid="admin.input"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-foreground">Image URL</Label>
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="bg-input"
            data-ocid="admin.input"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-foreground">Language</Label>
          <Select
            value={language}
            onValueChange={(v) => setLanguage(v as Language)}
          >
            <SelectTrigger className="bg-input" data-ocid="admin.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Language.en}>English</SelectItem>
              <SelectItem value={Language.gu}>ગુજરાતી</SelectItem>
              <SelectItem value={Language.hi}>हिंदी</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-foreground">Category</Label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as NewsCategory)}
          >
            <SelectTrigger className="bg-input" data-ocid="admin.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(NewsCategory).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 space-y-1">
          <Label className="text-foreground">Content *</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Article content..."
            rows={6}
            required
            className="bg-input resize-none"
            data-ocid="admin.textarea"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              checked={isPublished}
              onCheckedChange={setIsPublished}
              id="pub"
              data-ocid="admin.switch"
            />
            <Label
              htmlFor="pub"
              className="flex items-center gap-1 cursor-pointer"
            >
              {isPublished ? (
                <Eye className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
              Published
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={isBreaking}
              onCheckedChange={setIsBreaking}
              id="brk"
              data-ocid="admin.switch"
            />
            <Label
              htmlFor="brk"
              className="flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-primary" /> Breaking
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
              id="feat"
              data-ocid="admin.switch"
            />
            <Label
              htmlFor="feat"
              className="flex items-center gap-1 cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 text-yellow-500" /> Featured
            </Label>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-primary/90"
          data-ocid="admin.submit_button"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Create Article
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          data-ocid="admin.cancel_button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: role } = useCallerRole();
  const { identity, login, loginStatus } = useInternetIdentity();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const { data: allNews } = useAllNews();
  const { data: gallery } = useGallery();
  const { data: videos } = useVideos();
  const { data: liveTvUrl } = useLiveTvUrl();
  const { data: socialLinks } = useSocialLinks();
  const { data: messages } = useContactMessages();

  const { mutate: deleteNews, isPending: deletingNews } = useDeleteNews();
  const { mutate: addGallery, isPending: addingGallery } = useAddGalleryItem();
  const { mutate: deleteGallery } = useDeleteGalleryItem();
  const { mutate: addVideo, isPending: addingVideo } = useAddVideo();
  const { mutate: deleteVideo } = useDeleteVideo();
  const { mutate: updateLiveTv, isPending: updatingLive } = useUpdateLiveTv();
  const { mutate: updateSocial, isPending: updatingSocial } =
    useUpdateSocialLinks();
  const { mutate: deleteMsg } = useDeleteContactMessage();

  // Form states
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryUrl, setGalleryUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState(liveTvUrl ?? "");
  const [fbPage, setFbPage] = useState(socialLinks?.facebookPage ?? "");
  const [fbProfile, setFbProfile] = useState(
    socialLinks?.facebookProfile ?? "",
  );
  const [yt, setYt] = useState(socialLinks?.youtube ?? "");
  const [tw, setTw] = useState(socialLinks?.twitter ?? "");
  const [insta, setInsta] = useState(socialLinks?.instagram ?? "");

  useEffect(() => {
    if (liveTvUrl) setLiveUrl(liveTvUrl);
  }, [liveTvUrl]);
  useEffect(() => {
    if (socialLinks) {
      setFbPage(socialLinks.facebookPage);
      setFbProfile(socialLinks.facebookProfile);
      setYt(socialLinks.youtube);
      setTw(socialLinks.twitter);
      setInsta(socialLinks.instagram);
    }
  }, [socialLinks]);

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  // Auth check
  if (!isLoggedIn) {
    return (
      <div
        className="container mx-auto px-4 py-16 max-w-md text-center"
        data-ocid="admin.section"
      >
        <div className="bg-card rounded-xl border border-border p-8">
          <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-headline font-bold text-2xl text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground mb-6">
            Please login to access the admin dashboard.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-primary hover:bg-primary/90 font-semibold"
            data-ocid="admin.primary_button"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div
        className="flex items-center justify-center py-24"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin && role !== UserRole.admin && role !== UserRole.user) {
    navigate({ to: "/" });
    return null;
  }

  const handleDeleteNews = () => {
    if (!deleteId.trim()) {
      toast.error("Please enter article ID");
      return;
    }
    deleteNews(deleteId.trim(), {
      onSuccess: () => {
        toast.success("Article deleted");
        setDeleteId("");
      },
      onError: () => toast.error("Failed to delete"),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8" data-ocid="admin.section">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Role:{" "}
              <Badge variant="secondary" className="ml-1">
                {role ?? "user"}
              </Badge>
            </p>
          </div>
        </div>

        <Tabs defaultValue="news" className="space-y-6" data-ocid="admin.tab">
          <TabsList className="bg-card border border-border flex-wrap h-auto gap-1 p-1">
            <TabsTrigger
              value="news"
              className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-ocid="admin.tab"
            >
              <Newspaper className="w-4 h-4" /> News
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-ocid="admin.tab"
            >
              <Image className="w-4 h-4" /> Gallery
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-ocid="admin.tab"
            >
              <Video className="w-4 h-4" /> Videos
            </TabsTrigger>
            <TabsTrigger
              value="livetv"
              className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-ocid="admin.tab"
            >
              <Tv className="w-4 h-4" /> Live TV
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-ocid="admin.tab"
            >
              <Share2 className="w-4 h-4" /> Social
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-ocid="admin.tab"
            >
              <MessageSquare className="w-4 h-4" /> Messages
            </TabsTrigger>
          </TabsList>

          {/* NEWS TAB */}
          <TabsContent value="news" className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-semibold text-lg text-foreground">
                News Articles ({allNews?.length ?? 0})
              </h2>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-primary hover:bg-primary/90"
                data-ocid="admin.open_modal_button"
              >
                {showCreateForm ? (
                  <X className="w-4 h-4 mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                {showCreateForm ? "Close" : "New Article"}
              </Button>
            </div>

            {showCreateForm && (
              <div className="bg-card rounded-lg border border-border p-5">
                <h3 className="font-headline font-semibold text-foreground mb-4">
                  Create New Article
                </h3>
                <ArticleForm onSuccess={() => setShowCreateForm(false)} />
              </div>
            )}

            {/* Delete by ID */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Delete Article by ID
              </h3>
              <div className="flex gap-3">
                <Input
                  value={deleteId}
                  onChange={(e) => setDeleteId(e.target.value)}
                  placeholder="Article ID (from creation)"
                  className="bg-input"
                  data-ocid="admin.input"
                />
                <Button
                  variant="destructive"
                  onClick={handleDeleteNews}
                  disabled={deletingNews}
                  data-ocid="admin.delete_button"
                >
                  {deletingNews ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Article IDs are shown in the toast after creation.
              </p>
            </div>

            {/* Articles list */}
            <div className="space-y-3" data-ocid="admin.list">
              {allNews?.map((article, i) => (
                <div
                  key={article.id}
                  className="bg-card rounded-lg border border-border p-4 flex items-start gap-4"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-16 h-12 object-cover rounded shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs text-muted-foreground uppercase font-semibold">
                        {article.category}
                      </span>
                      {article.isBreaking && (
                        <Badge className="bg-primary text-white text-xs px-1.5 py-0">
                          Breaking
                        </Badge>
                      )}
                      {article.isFeatured && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0"
                        >
                          Featured
                        </Badge>
                      )}
                      {!article.isPublished && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0"
                        >
                          Draft
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-foreground line-clamp-1">
                      {article.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {article.author} • {formatDate(article.publishedAt)}
                    </p>
                  </div>
                </div>
              ))}
              {(!allNews || allNews.length === 0) && (
                <div
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="admin.empty_state"
                >
                  No articles yet.
                </div>
              )}
            </div>
          </TabsContent>

          {/* GALLERY TAB */}
          <TabsContent value="gallery" className="space-y-5">
            <h2 className="font-headline font-semibold text-lg text-foreground">
              Gallery ({gallery?.length ?? 0})
            </h2>
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Add Image
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  placeholder="Image title"
                  className="bg-input"
                  data-ocid="admin.input"
                />
                <Input
                  value={galleryUrl}
                  onChange={(e) => setGalleryUrl(e.target.value)}
                  placeholder="Image URL (https://...)"
                  className="bg-input sm:col-span-1"
                  data-ocid="admin.input"
                />
                <Button
                  onClick={() => {
                    if (!galleryTitle.trim() || !galleryUrl.trim()) {
                      toast.error("Title and URL required");
                      return;
                    }
                    addGallery(
                      {
                        title: galleryTitle.trim(),
                        imageUrl: galleryUrl.trim(),
                      },
                      {
                        onSuccess: () => {
                          toast.success("Added to gallery");
                          setGalleryTitle("");
                          setGalleryUrl("");
                        },
                        onError: () => toast.error("Failed to add"),
                      },
                    );
                  }}
                  disabled={addingGallery}
                  className="bg-primary hover:bg-primary/90"
                  data-ocid="admin.primary_button"
                >
                  {addingGallery ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              data-ocid="admin.list"
            >
              {gallery?.map((item, i) => (
                <div
                  key={item.id}
                  className="relative group rounded overflow-hidden border border-border"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        deleteGallery(item.id, {
                          onSuccess: () => toast.success("Deleted"),
                          onError: () => toast.error("Failed"),
                        })
                      }
                      data-ocid="admin.delete_button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-foreground p-2 bg-card/80 line-clamp-1">
                    {item.title}
                  </p>
                </div>
              ))}
              {(!gallery || gallery.length === 0) && (
                <div
                  className="col-span-full text-center py-8 text-muted-foreground"
                  data-ocid="admin.empty_state"
                >
                  No gallery items.
                </div>
              )}
            </div>
          </TabsContent>

          {/* VIDEOS TAB */}
          <TabsContent value="videos" className="space-y-5">
            <h2 className="font-headline font-semibold text-lg text-foreground">
              Videos ({videos?.length ?? 0})
            </h2>
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Add Video
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Video title"
                  className="bg-input"
                  data-ocid="admin.input"
                />
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="YouTube URL"
                  className="bg-input"
                  data-ocid="admin.input"
                />
                <Button
                  onClick={() => {
                    if (!videoTitle.trim() || !videoUrl.trim()) {
                      toast.error("Title and URL required");
                      return;
                    }
                    addVideo(
                      { title: videoTitle.trim(), url: videoUrl.trim() },
                      {
                        onSuccess: () => {
                          toast.success("Video added");
                          setVideoTitle("");
                          setVideoUrl("");
                        },
                        onError: () => toast.error("Failed to add"),
                      },
                    );
                  }}
                  disabled={addingVideo}
                  className="bg-primary hover:bg-primary/90"
                  data-ocid="admin.primary_button"
                >
                  {addingVideo ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-3" data-ocid="admin.list">
              {videos?.map((video, i) => (
                <div
                  key={video.id}
                  className="bg-card rounded-lg border border-border p-4 flex items-center justify-between gap-4"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground">
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {video.url}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      deleteVideo(video.id, {
                        onSuccess: () => toast.success("Deleted"),
                        onError: () => toast.error("Failed"),
                      })
                    }
                    data-ocid={`admin.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {(!videos || videos.length === 0) && (
                <div
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="admin.empty_state"
                >
                  No videos yet.
                </div>
              )}
            </div>
          </TabsContent>

          {/* LIVE TV TAB */}
          <TabsContent value="livetv" className="space-y-5">
            <h2 className="font-headline font-semibold text-lg text-foreground">
              Live TV Stream
            </h2>
            <div className="bg-card rounded-lg border border-border p-5">
              <Label className="text-foreground mb-2 block">
                YouTube Live URL
              </Label>
              <div className="flex gap-3">
                <Input
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="bg-input flex-1"
                  data-ocid="admin.input"
                />
                <Button
                  onClick={() => {
                    updateLiveTv(liveUrl, {
                      onSuccess: () => toast.success("Live TV URL updated"),
                      onError: () => toast.error("Failed"),
                    });
                  }}
                  disabled={updatingLive}
                  className="bg-primary hover:bg-primary/90"
                  data-ocid="admin.save_button"
                >
                  {updatingLive ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Current: {liveTvUrl || "Not set"}
              </p>
            </div>
          </TabsContent>

          {/* SOCIAL LINKS TAB */}
          <TabsContent value="social" className="space-y-5">
            <h2 className="font-headline font-semibold text-lg text-foreground">
              Social Media Links
            </h2>
            <div className="bg-card rounded-lg border border-border p-5 space-y-4">
              {[
                { label: "Facebook Page", val: fbPage, set: setFbPage },
                {
                  label: "Facebook Profile",
                  val: fbProfile,
                  set: setFbProfile,
                },
                { label: "YouTube Channel", val: yt, set: setYt },
                { label: "Twitter / X", val: tw, set: setTw },
                { label: "Instagram", val: insta, set: setInsta },
              ].map(({ label, val, set }) => (
                <div key={label} className="space-y-1">
                  <Label className="text-foreground">{label}</Label>
                  <Input
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    placeholder="https://..."
                    className="bg-input"
                    data-ocid="admin.input"
                  />
                </div>
              ))}
              <Button
                onClick={() => {
                  updateSocial(
                    {
                      facebookPage: fbPage,
                      facebookProfile: fbProfile,
                      youtube: yt,
                      twitter: tw,
                      instagram: insta,
                    },
                    {
                      onSuccess: () => toast.success("Social links updated"),
                      onError: () => toast.error("Failed"),
                    },
                  );
                }}
                disabled={updatingSocial}
                className="bg-primary hover:bg-primary/90 w-full"
                data-ocid="admin.save_button"
              >
                {updatingSocial ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Social Links
              </Button>
            </div>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages" className="space-y-5">
            <h2 className="font-headline font-semibold text-lg text-foreground">
              Contact Messages ({messages?.length ?? 0})
            </h2>
            <div className="space-y-3" data-ocid="admin.list">
              {messages?.map((msg, i) => (
                <div
                  key={msg.id}
                  className="bg-card rounded-lg border border-border p-4"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">
                          {msg.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {msg.email}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {msg.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(msg.timestamp)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        deleteMsg(msg.id, {
                          onSuccess: () => toast.success("Message deleted"),
                          onError: () => toast.error("Failed"),
                        })
                      }
                      data-ocid={`admin.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!messages || messages.length === 0) && (
                <div
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="admin.empty_state"
                >
                  No messages yet.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
