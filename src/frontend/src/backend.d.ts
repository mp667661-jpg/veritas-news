import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GalleryItem {
    title: string;
    imageUrl: string;
}
export interface ContactMessage {
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface SocialLinks {
    twitter: string;
    instagram: string;
    youtube: string;
    facebookPage: string;
    facebookProfile: string;
}
export interface NewsArticle {
    title: string;
    content: string;
    isPublished: boolean;
    publishedAt: bigint;
    isBreaking: boolean;
    author: string;
    language: Language;
    imageUrl?: string;
    isFeatured: boolean;
    category: NewsCategory;
}
export interface YoutubeVideo {
    url: string;
    title: string;
}
export interface NewsInput {
    title: string;
    content: string;
    isPublished: boolean;
    isBreaking: boolean;
    author: string;
    language: Language;
    imageUrl?: string;
    isFeatured: boolean;
    category: NewsCategory;
}
export enum Language {
    en = "en",
    gu = "gu",
    hi = "hi"
}
export enum NewsCategory {
    entertainment = "entertainment",
    business = "business",
    india = "india",
    sports = "sports",
    gujarat = "gujarat",
    world = "world",
    politics = "politics"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addContactMessage(message: ContactMessage): Promise<string>;
    addGalleryItem(title: string, imageUrl: string): Promise<string>;
    addYoutubeVideo(title: string, url: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    countArticlesByCategory(category: NewsCategory): Promise<bigint>;
    createNewsArticle(input: NewsInput): Promise<string>;
    deleteContactMessage(messageId: string): Promise<void>;
    deleteGalleryItem(galleryId: string): Promise<void>;
    deleteNewsArticle(newsId: string): Promise<void>;
    deleteYoutubeVideo(videoId: string): Promise<void>;
    getAllContactMessages(): Promise<Array<ContactMessage>>;
    getAllGalleryItems(): Promise<Array<GalleryItem>>;
    getAllNews(): Promise<Array<NewsArticle>>;
    getAllYoutubeVideos(): Promise<Array<YoutubeVideo>>;
    getArticlesByLanguage(language: Language): Promise<Array<NewsArticle>>;
    getBreakingNews(): Promise<Array<NewsArticle>>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedNews(): Promise<Array<NewsArticle>>;
    getLatestNews(count: bigint): Promise<Array<NewsArticle>>;
    getLiveTvUrl(): Promise<string>;
    getNewsByCategory(category: NewsCategory): Promise<Array<NewsArticle>>;
    getNewsById(newsId: string): Promise<NewsArticle>;
    getPublishedBreakingArticles(): Promise<Array<NewsArticle>>;
    getSocialLinks(): Promise<SocialLinks>;
    isCallerAdmin(): Promise<boolean>;
    searchArticles(searchTerm: string): Promise<Array<NewsArticle>>;
    updateLiveTvUrl(url: string): Promise<void>;
    updateNewsArticle(newsId: string, article: NewsInput): Promise<void>;
    updateSocialLinks(links: SocialLinks): Promise<void>;
}
