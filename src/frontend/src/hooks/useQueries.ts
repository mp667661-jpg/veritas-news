import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ContactMessage,
  Language,
  type NewsArticle,
  NewsCategory,
  type NewsInput,
  type SocialLinks,
} from "../backend";
import { useActor } from "./useActor";

export type NewsWithId = NewsArticle & { id: string };
export type GalleryWithId = { id: string; title: string; imageUrl: string };
export type VideoWithId = { id: string; title: string; url: string };
export type ContactWithId = ContactMessage & { id: string };

const SAMPLE_NEWS: NewsWithId[] = [
  {
    id: "sample-1",
    title: "PM Modi Addresses Nation on India's Economic Progress",
    content:
      "Prime Minister Narendra Modi addressed the nation highlighting India's remarkable economic growth trajectory. The PM spoke about key infrastructure projects, digital India initiatives, and the country's rising global stature. India has emerged as the world's fifth largest economy and is on track to become the third largest by 2027.",
    isPublished: true,
    publishedAt: BigInt(Date.now() * 1_000_000 - 3600_000_000_000),
    isBreaking: true,
    author: "Veritas News Desk",
    language: Language.en,
    imageUrl:
      "/assets/uploads/img-20260323-wa0050-019d1c24-b2ba-7210-8f79-19aad2973260-5.jpg",
    isFeatured: true,
    category: NewsCategory.india,
  },
  {
    id: "sample-2",
    title: "Breaking: Major Policy Decision Shakes Parliament",
    content:
      "In a landmark move, Parliament passed a sweeping policy reform that is set to impact millions of citizens across the country. The bill, which was debated for weeks, passed with a significant majority and is expected to reshape several key sectors of the economy.",
    isPublished: true,
    publishedAt: BigInt(Date.now() * 1_000_000 - 7200_000_000_000),
    isBreaking: true,
    author: "Political Bureau",
    language: Language.en,
    imageUrl:
      "/assets/uploads/img-20260322-wa0002-019d1c24-b420-73b8-b3ef-c7e2306b0253-10.jpg",
    isFeatured: false,
    category: NewsCategory.politics,
  },
  {
    id: "sample-3",
    title: "Gujarat's Vibrant Economy: New Industrial Corridors Announced",
    content:
      "The Gujarat government announced three new industrial corridors that will create over 500,000 jobs in the next five years. The corridors will focus on green energy, electronics manufacturing, and pharmaceutical sectors.",
    isPublished: true,
    publishedAt: BigInt(Date.now() * 1_000_000 - 14400_000_000_000),
    isBreaking: false,
    author: "Gujarat Correspondent",
    language: Language.en,
    imageUrl:
      "/assets/uploads/img-20260320-wa0009-019d1c24-c171-7784-96be-3d64056c34b4-16.jpg",
    isFeatured: false,
    category: NewsCategory.gujarat,
  },
  {
    id: "sample-4",
    title: "ભારત-અમેરિકા વ્યૂહાત્મક ભાગીદારી મજબૂત",
    content:
      "ભારત અને અમેરિકા વચ્ચે નવા સંરક્ષણ કરારો પર હસ્તાક્ષર, બંને દેશો વ્યૂહાત્મક ભાગીદારીને નવી ઊંચાઈ પર લઈ જવા પ્રતિબદ્ધ. આ ઐતિહાસિક સમજૂતીઓ ભારતને ગ્લોબલ સ્ટ્રેટેજિક પ્લેયર તરીકે સ્થાપિત કરે છે.",
    isPublished: true,
    publishedAt: BigInt(Date.now() * 1_000_000 - 21600_000_000_000),
    isBreaking: false,
    author: "Veritas ન્યૂઝ ડેસ્ક",
    language: Language.gu,
    imageUrl:
      "/assets/uploads/img-20260323-wa0050-019d1c24-b2ba-7210-8f79-19aad2973260-5.jpg",
    isFeatured: false,
    category: NewsCategory.world,
  },
  {
    id: "sample-5",
    title: "भारतीय टीम ने वर्ल्ड कप में शानदार जीत दर्ज की",
    content:
      "भारतीय क्रिकेट टीम ने विश्व कप में दमदार प्रदर्शन करते हुए बड़ी जीत दर्ज की। कप्तान रोहित शर्मा ने शानदार शतक जड़ते हुए टीम को जीत दिलाई।",
    isPublished: true,
    publishedAt: BigInt(Date.now() * 1_000_000 - 28800_000_000_000),
    isBreaking: false,
    author: "Sports Desk",
    language: Language.hi,
    imageUrl:
      "/assets/uploads/img-20260322-wa0002-019d1c24-b420-73b8-b3ef-c7e2306b0253-10.jpg",
    isFeatured: false,
    category: NewsCategory.sports,
  },
  {
    id: "sample-6",
    title: "Global Markets Surge Amid Positive Economic Data",
    content:
      "World markets surged to new highs as positive economic data from major economies boosted investor confidence. The Sensex crossed 85,000 points for the first time, driven by strong corporate earnings and foreign institutional investment flows.",
    isPublished: true,
    publishedAt: BigInt(Date.now() * 1_000_000 - 36000_000_000_000),
    isBreaking: false,
    author: "Business Bureau",
    language: Language.en,
    imageUrl:
      "/assets/uploads/img-20260320-wa0009-019d1c24-c171-7784-96be-3d64056c34b4-16.jpg",
    isFeatured: false,
    category: NewsCategory.business,
  },
];

function toNewsWithId(articles: NewsArticle[]): NewsWithId[] {
  return articles.map((a, i) => ({
    ...a,
    id: (a as any).id ?? `article-${i}`,
  }));
}

export function useAllNews() {
  const { actor, isFetching } = useActor();
  return useQuery<NewsWithId[]>({
    queryKey: ["allNews"],
    queryFn: async () => {
      if (!actor) return SAMPLE_NEWS;
      const result = await actor.getAllNews();
      return result.length > 0 ? toNewsWithId(result) : SAMPLE_NEWS;
    },
    enabled: !isFetching,
  });
}

export function useLatestNews(count = 10) {
  const { actor, isFetching } = useActor();
  return useQuery<NewsWithId[]>({
    queryKey: ["latestNews", count],
    queryFn: async () => {
      if (!actor) return SAMPLE_NEWS.slice(0, count);
      const result = await actor.getLatestNews(BigInt(count));
      return result.length > 0
        ? toNewsWithId(result)
        : SAMPLE_NEWS.slice(0, count);
    },
    enabled: !isFetching,
  });
}

export function useFeaturedNews() {
  const { actor, isFetching } = useActor();
  return useQuery<NewsWithId[]>({
    queryKey: ["featuredNews"],
    queryFn: async () => {
      if (!actor) return SAMPLE_NEWS.filter((n) => n.isFeatured);
      const result = await actor.getFeaturedNews();
      return result.length > 0
        ? toNewsWithId(result)
        : SAMPLE_NEWS.filter((n) => n.isFeatured);
    },
    enabled: !isFetching,
  });
}

export function useBreakingNews() {
  const { actor, isFetching } = useActor();
  return useQuery<NewsWithId[]>({
    queryKey: ["breakingNews"],
    queryFn: async () => {
      if (!actor) return SAMPLE_NEWS.filter((n) => n.isBreaking);
      const result = await actor.getPublishedBreakingArticles();
      return result.length > 0
        ? toNewsWithId(result)
        : SAMPLE_NEWS.filter((n) => n.isBreaking);
    },
    enabled: !isFetching,
  });
}

export function useNewsByCategory(category: NewsCategory) {
  const { actor, isFetching } = useActor();
  return useQuery<NewsWithId[]>({
    queryKey: ["newsByCategory", category],
    queryFn: async () => {
      if (!actor) return SAMPLE_NEWS.filter((n) => n.category === category);
      const result = await actor.getNewsByCategory(category);
      return result.length > 0
        ? toNewsWithId(result)
        : SAMPLE_NEWS.filter((n) => n.category === category);
    },
    enabled: !isFetching,
  });
}

export function useNewsById(newsId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<NewsWithId | null>({
    queryKey: ["newsById", newsId],
    queryFn: async () => {
      if (!actor) {
        const found = SAMPLE_NEWS.find(
          (n) => n.id === newsId || encodeURIComponent(n.title) === newsId,
        );
        return found ?? null;
      }
      try {
        const result = await actor.getNewsById(newsId);
        return { ...result, id: newsId } as NewsWithId;
      } catch {
        // Fallback: search in all news by title
        const all = await actor.getAllNews();
        const decoded = decodeURIComponent(newsId);
        const found = all.find((n) => n.title === decoded);
        return found ? { ...found, id: newsId } : null;
      }
    },
    enabled: !isFetching && !!newsId,
  });
}

export function useSearchArticles(term: string) {
  const { actor, isFetching } = useActor();
  return useQuery<NewsWithId[]>({
    queryKey: ["search", term],
    queryFn: async () => {
      if (!actor || !term) return [];
      const result = await actor.searchArticles(term);
      return toNewsWithId(result);
    },
    enabled: !isFetching && term.length > 1,
  });
}

export function useGallery() {
  const { actor, isFetching } = useActor();
  return useQuery<GalleryWithId[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor)
        return [
          {
            id: "g1",
            title: "PM Modi Speech",
            imageUrl:
              "/assets/uploads/img-20260323-wa0050-019d1c24-b2ba-7210-8f79-19aad2973260-5.jpg",
          },
          {
            id: "g2",
            title: "Breaking News",
            imageUrl:
              "/assets/uploads/img-20260322-wa0002-019d1c24-b420-73b8-b3ef-c7e2306b0253-10.jpg",
          },
          {
            id: "g3",
            title: "News Coverage",
            imageUrl:
              "/assets/uploads/img-20260320-wa0009-019d1c24-c171-7784-96be-3d64056c34b4-16.jpg",
          },
          {
            id: "g4",
            title: "Channel Art",
            imageUrl:
              "/assets/uploads/1774009120498-019d1c24-ba98-778d-a31b-3785cc8d2365-12.png",
          },
          {
            id: "g5",
            title: "News Banner",
            imageUrl:
              "/assets/uploads/1774156124339_2-019d1c24-b238-7579-9b21-89e93942a0c7-4.png",
          },
          {
            id: "g6",
            title: "Channel Branding",
            imageUrl:
              "/assets/uploads/1774156124339_1-019d1c24-b109-7791-acc0-fea1fbb0b0f9-1.png",
          },
        ];
      const result = await actor.getAllGalleryItems();
      if (result.length > 0) {
        return result.map((g, i) => ({ ...g, id: (g as any).id ?? `g-${i}` }));
      }
      return [
        {
          id: "g1",
          title: "PM Modi Speech",
          imageUrl:
            "/assets/uploads/img-20260323-wa0050-019d1c24-b2ba-7210-8f79-19aad2973260-5.jpg",
        },
        {
          id: "g2",
          title: "Breaking News",
          imageUrl:
            "/assets/uploads/img-20260322-wa0002-019d1c24-b420-73b8-b3ef-c7e2306b0253-10.jpg",
        },
        {
          id: "g3",
          title: "News Coverage",
          imageUrl:
            "/assets/uploads/img-20260320-wa0009-019d1c24-c171-7784-96be-3d64056c34b4-16.jpg",
        },
      ];
    },
    enabled: !isFetching,
  });
}

export function useVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoWithId[]>({
    queryKey: ["videos"],
    queryFn: async () => {
      if (!actor)
        return [
          {
            id: "v1",
            title: "Veritas News Channel Intro",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
        ];
      const result = await actor.getAllYoutubeVideos();
      if (result.length > 0) {
        return result.map((v, i) => ({ ...v, id: (v as any).id ?? `v-${i}` }));
      }
      return [
        {
          id: "v1",
          title: "Veritas News Channel Intro",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
      ];
    },
    enabled: !isFetching,
  });
}

export function useLiveTvUrl() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["liveTvUrl"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getLiveTvUrl();
    },
    enabled: !isFetching,
  });
}

export function useSocialLinks() {
  const { actor, isFetching } = useActor();
  return useQuery<SocialLinks>({
    queryKey: ["socialLinks"],
    queryFn: async () => {
      if (!actor)
        return {
          facebookPage: "",
          facebookProfile: "",
          youtube: "",
          twitter: "",
          instagram: "",
        };
      return actor.getSocialLinks();
    },
    enabled: !isFetching,
  });
}

export function useCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !isFetching,
  });
}

export function useContactMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactWithId[]>({
    queryKey: ["contactMessages"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getAllContactMessages();
      return result.map((m, i) => ({ ...m, id: (m as any).id ?? `msg-${i}` }));
    },
    enabled: !isFetching,
  });
}

export function useCreateNews() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewsInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createNewsArticle(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allNews"] });
      qc.invalidateQueries({ queryKey: ["latestNews"] });
      qc.invalidateQueries({ queryKey: ["featuredNews"] });
      qc.invalidateQueries({ queryKey: ["breakingNews"] });
    },
  });
}

export function useUpdateNews() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: NewsInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateNewsArticle(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allNews"] });
      qc.invalidateQueries({ queryKey: ["latestNews"] });
    },
  });
}

export function useDeleteNews() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteNewsArticle(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allNews"] });
      qc.invalidateQueries({ queryKey: ["latestNews"] });
    },
  });
}

export function useAddGalleryItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      imageUrl,
    }: { title: string; imageUrl: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addGalleryItem(title, imageUrl);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useDeleteGalleryItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteGalleryItem(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useAddVideo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, url }: { title: string; url: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addYoutubeVideo(title, url);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteYoutubeVideo(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
}

export function useUpdateLiveTv() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (url: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateLiveTvUrl(url);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["liveTvUrl"] }),
  });
}

export function useUpdateSocialLinks() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (links: SocialLinks) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSocialLinks(links);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}

export function useAddContactMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (message: ContactMessage) => {
      if (!actor) throw new Error("Not connected");
      return actor.addContactMessage(message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contactMessages"] }),
  });
}

export function useDeleteContactMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteContactMessage(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contactMessages"] }),
  });
}

export function getYoutubeEmbedUrl(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export function formatDate(publishedAt: bigint): string {
  const ms = Number(publishedAt / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
