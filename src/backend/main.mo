import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type NewsCategory = {
    #india;
    #world;
    #politics;
    #sports;
    #business;
    #entertainment;
    #gujarat;
  };

  public type Language = {
    #en;
    #gu;
    #hi;
  };

  public type NewsArticle = {
    title : Text;
    content : Text;
    author : Text;
    category : NewsCategory;
    language : Language;
    imageUrl : ?Text;
    publishedAt : Int;
    isPublished : Bool;
    isFeatured : Bool;
    isBreaking : Bool;
  };

  module NewsArticle {
    public func compareByTimestamp(article_1 : NewsArticle, article_2 : NewsArticle) : Order.Order {
      Int.compare(article_2.publishedAt, article_1.publishedAt);
    };
  };

  public type GalleryItem = {
    title : Text;
    imageUrl : Text;
  };

  public type YoutubeVideo = {
    title : Text;
    url : Text;
  };

  public type SocialLinks = {
    facebookPage : Text;
    facebookProfile : Text;
    youtube : Text;
    twitter : Text;
    instagram : Text;
  };

  public type ContactMessage = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  public type NewsInput = {
    title : Text;
    content : Text;
    author : Text;
    category : NewsCategory;
    language : Language;
    imageUrl : ?Text;
    isPublished : Bool;
    isFeatured : Bool;
    isBreaking : Bool;
  };

  var latestGalleryItemId = 0;
  var latestNewsArticleId = 0;
  var latestYouTubeVideoId = 0;

  func getNewGalleryItemId() : Text {
    latestGalleryItemId += 1;
    latestGalleryItemId.toText();
  };

  func getNewNewsId() : Text {
    latestNewsArticleId += 1;
    latestNewsArticleId.toText();
  };

  func getNewYoutubeVideoId() : Text {
    latestYouTubeVideoId += 1;
    latestYouTubeVideoId.toText();
  };

  let galleryItems = Map.empty<Text, GalleryItem>();
  let newsArticles = Map.empty<Text, NewsArticle>();
  let youtubeVideos = Map.empty<Text, YoutubeVideo>();
  let contactMessages = Map.empty<Text, ContactMessage>();

  var liveTvUrl : Text = "";
  var socialLinks : SocialLinks = {
    facebookPage = "";
    facebookProfile = "";
    youtube = "";
    twitter = "";
    instagram = "";
  };

  // NEWS ARTICLES
  // Team (#user) and Admin (#admin) can create
  public shared ({ caller }) func createNewsArticle(input : NewsInput) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create news articles");
    };
    let id = getNewNewsId();
    let article : NewsArticle = {
      input with publishedAt = Time.now();
    };
    newsArticles.add(id, article);
    id;
  };

  // Public read access - no auth needed
  public query func getNewsById(newsId : Text) : async NewsArticle {
    switch (newsArticles.get(newsId)) {
      case (null) { Runtime.trap("News article not found") };
      case (?article) { article };
    };
  };

  // Team (#user) and Admin (#admin) can update
  public shared ({ caller }) func updateNewsArticle(newsId : Text, article : NewsInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update news articles");
    };
    let oldArticle = newsArticles.get(newsId);
    switch (oldArticle) {
      case (null) { Runtime.trap("Article does not exist!") };
      case (?oldArticle) {
        newsArticles.add(
          newsId,
          {
            article with
            publishedAt = Time.now();
          },
        );
      };
    };
  };

  // Only Admin (#admin) can delete
  public shared ({ caller }) func deleteNewsArticle(newsId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete news");
    };
    newsArticles.remove(newsId);
  };

  // Public read access - no auth needed
  public query func getAllNews() : async [NewsArticle] {
    newsArticles.values().toArray();
  };

  // Public read access - no auth needed
  public query func getLatestNews(count : Nat) : async [NewsArticle] {
    newsArticles.values().toArray().sort(NewsArticle.compareByTimestamp).sliceToArray(0, count);
  };

  // Public read access - no auth needed
  public query func getFeaturedNews() : async [NewsArticle] {
    newsArticles.values().toArray().filter(func(article) { article.isFeatured });
  };

  // Public read access - no auth needed
  public query func getNewsByCategory(category : NewsCategory) : async [NewsArticle] {
    newsArticles.values().toArray().filter(func(article) { article.category == category });
  };

  // Public read access - no auth needed
  public query func getBreakingNews() : async [NewsArticle] {
    newsArticles.values().toArray().filter(func(article) { article.isBreaking });
  };

  // Public read access - no auth needed
  public query func getArticlesByLanguage(language : Language) : async [NewsArticle] {
    newsArticles.values().toArray().filter(func(article) { article.language == language });
  };

  // PHOTO GALLERY
  // Team (#user) and Admin (#admin) can create
  public shared ({ caller }) func addGalleryItem(title : Text, imageUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create gallery items");
    };
    let id = getNewGalleryItemId();
    let item : GalleryItem = {
      title;
      imageUrl;
    };
    galleryItems.add(id, item);
    id;
  };

  // Only Admin (#admin) can delete
  public shared ({ caller }) func deleteGalleryItem(galleryId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };
    galleryItems.remove(galleryId);
  };

  // Public read access - no auth needed
  public query func getAllGalleryItems() : async [GalleryItem] {
    galleryItems.values().toArray();
  };

  // YOUTUBE VIDEOS
  // Team (#user) and Admin (#admin) can create
  public shared ({ caller }) func addYoutubeVideo(title : Text, url : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create video entries");
    };
    let id = getNewYoutubeVideoId();
    let video : YoutubeVideo = {
      title;
      url;
    };
    youtubeVideos.add(id, video);
    id;
  };

  // Only Admin (#admin) can delete
  public shared ({ caller }) func deleteYoutubeVideo(videoId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete videos");
    };
    youtubeVideos.remove(videoId);
  };

  // Public read access - no auth needed
  public query func getAllYoutubeVideos() : async [YoutubeVideo] {
    youtubeVideos.values().toArray();
  };

  // LIVE TV
  // Only Admin (#admin) can update settings
  public shared ({ caller }) func updateLiveTvUrl(url : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update Live TV");
    };
    liveTvUrl := url;
  };

  // Public read access - no auth needed
  public query func getLiveTvUrl() : async Text {
    liveTvUrl;
  };

  // SOCIAL LINKS
  // Only Admin (#admin) can update settings
  public shared ({ caller }) func updateSocialLinks(links : SocialLinks) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update social links");
    };
    socialLinks := links;
  };

  // Public read access - no auth needed
  public query func getSocialLinks() : async SocialLinks {
    socialLinks;
  };

  // CONTACT MESSAGES
  // Public access - anyone including guests can submit contact messages
  public shared ({ caller }) func addContactMessage(message : ContactMessage) : async Text {
    let id = Time.now().toText();
    contactMessages.add(id, { message with timestamp = Time.now() });
    id;
  };

  // Only Admin (#admin) can view contact messages
  public query ({ caller }) func getAllContactMessages() : async [ContactMessage] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    contactMessages.values().toArray();
  };

  // Only Admin (#admin) can delete contact messages
  public shared ({ caller }) func deleteContactMessage(messageId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete contact messages");
    };
    contactMessages.remove(messageId);
  };

  // Article Search - Public read access
  public query func searchArticles(searchTerm : Text) : async [NewsArticle] {
    newsArticles.values().toArray().filter(func(article) { article.title.contains(#text searchTerm) });
  };

  // Public read access - no auth needed
  public func countArticlesByCategory(category : NewsCategory) : async Nat {
    newsArticles.values().toArray().filter(func(article) { article.category == category }).size();
  };

  // Public read access - no auth needed
  public query func getPublishedBreakingArticles() : async [NewsArticle] {
    newsArticles.values().toArray().filter(func(article) { article.isPublished and article.isBreaking });
  };
};
