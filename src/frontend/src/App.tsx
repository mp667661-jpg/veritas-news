import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { BreakingTicker } from "./components/BreakingTicker";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LanguageProvider } from "./contexts/LanguageContext";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import LiveTvPage from "./pages/LiveTvPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import VideosPage from "./pages/VideosPage";

function RootLayout() {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <BreakingTicker />
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster position="bottom-right" richColors />
    </LanguageProvider>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news/$id",
  component: NewsDetailPage,
});
const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/category/$cat",
  component: CategoryPage,
});
const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: GalleryPage,
});
const videosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/videos",
  component: VideosPage,
});
const liveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live",
  component: LiveTvPage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  newsRoute,
  categoryRoute,
  galleryRoute,
  videosRoute,
  liveRoute,
  aboutRoute,
  contactRoute,
  adminRoute,
]);

const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
