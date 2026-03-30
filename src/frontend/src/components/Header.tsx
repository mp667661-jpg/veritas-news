import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, Search, Settings, Tv, X } from "lucide-react";
import { useState } from "react";
import {
  SiFacebook,
  SiInstagram,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { Language } from "../backend";
import {
  CATEGORY_LABELS,
  LANG_LABELS,
  NAV_LABELS,
  useLanguage,
} from "../contexts/LanguageContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin, useSocialLinks } from "../hooks/useQueries";

const CATEGORIES = [
  "gujarat",
  "india",
  "world",
  "politics",
  "sports",
  "business",
  "entertainment",
] as const;

const WHATSAPP_CHANNELS = [
  {
    href: "https://whatsapp.com/channel/0029Vb7gHiRInlqJP1vySx3g",
    label: "WhatsApp Channel 1",
  },
  {
    href: "https://whatsapp.com/channel/0029VaxXnP33WHTc9kTFQi2O",
    label: "WhatsApp Channel 2",
  },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { language, setLanguage } = useLanguage();
  const { data: socialLinks } = useSocialLinks();
  const { data: isAdmin } = useIsAdmin();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const location = useLocation();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const navItems = [
    { to: "/", label: NAV_LABELS.home[language] },
    ...CATEGORIES.map((cat) => ({
      to: `/category/${cat}`,
      label: CATEGORY_LABELS[cat][language],
    })),
    { to: "/videos", label: NAV_LABELS.videos[language] },
    { to: "/gallery", label: NAV_LABELS.gallery[language] },
    { to: "/live", label: NAV_LABELS.live[language] },
  ];

  return (
    <header
      className="bg-card border-b border-border sticky top-0 z-50"
      data-ocid="header.section"
    >
      {/* Top bar */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Tv className="w-3 h-3 text-primary" />
            <span className="hidden sm:inline">
              VERITAS NEWS — THE UNTOLD INDIAN
            </span>
            <span className="sm:hidden">VERITAS NEWS</span>
          </div>
          <div className="flex items-center gap-3">
            {[
              {
                href: socialLinks?.facebookPage,
                icon: SiFacebook,
                label: "Facebook",
              },
              { href: socialLinks?.youtube, icon: SiYoutube, label: "YouTube" },
              { href: socialLinks?.twitter, icon: SiX, label: "Twitter" },
              {
                href: socialLinks?.instagram,
                icon: SiInstagram,
                label: "Instagram",
              },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={label}
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
            {WHATSAPP_CHANNELS.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#25D366] transition-colors"
                aria-label={label}
              >
                <SiWhatsapp className="w-3.5 h-3.5" />
              </a>
            ))}
            <div
              className="flex items-center gap-1 ml-2"
              data-ocid="header.toggle"
            >
              {([Language.en, Language.gu, Language.hi] as Language[]).map(
                (lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`text-xs px-2 py-0.5 rounded transition-colors ${
                      language === lang
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {LANG_LABELS[lang]}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0"
          data-ocid="header.link"
        >
          <img
            src="/assets/uploads/1773553344647-019d1c24-b9ed-7468-ab15-14552f5bfdfc-11.png"
            alt="Veritas News"
            className="h-10 w-auto"
          />
          <div className="hidden sm:block">
            <div className="font-headline font-bold text-lg leading-tight text-foreground">
              VERITAS NEWS
            </div>
            <div className="text-primary text-xs font-semibold tracking-widest">
              THE UNTOLD INDIAN
            </div>
          </div>
        </Link>

        <nav
          className="hidden xl:flex items-center gap-5 text-sm"
          data-ocid="header.section"
        >
          {navItems.slice(0, 6).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link text-sm font-medium whitespace-nowrap ${
                location.pathname === item.to
                  ? "text-primary active"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="header.link"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Search"
            data-ocid="header.search_input"
          >
            <Search className="w-5 h-5" />
          </button>

          {isAdmin && (
            <Link to="/admin">
              <Button
                size="sm"
                variant="outline"
                className="hidden sm:flex items-center gap-1 border-primary text-primary hover:bg-primary hover:text-white"
                data-ocid="header.button"
              >
                <Settings className="w-3.5 h-3.5" />
                Admin
              </Button>
            </Link>
          )}

          {isLoggedIn ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={clear}
              className="text-muted-foreground"
              data-ocid="header.button"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Logout</span>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={login}
              disabled={isLoggingIn}
              className="text-muted-foreground"
              data-ocid="header.button"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">
                {isLoggingIn ? "..." : "Login"}
              </span>
            </Button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="xl:hidden text-foreground"
            aria-label="Menu"
            data-ocid="header.button"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-border bg-background px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
              }
            }}
            className="container mx-auto flex gap-2"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="flex-1 bg-card border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              data-ocid="header.search_input"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90"
              data-ocid="header.submit_button"
            >
              Search
            </Button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="xl:hidden border-t border-border bg-card"
          data-ocid="header.panel"
        >
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-ocid="header.link"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-3 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              data-ocid="header.link"
            >
              {NAV_LABELS.about[language]}
            </Link>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-3 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              data-ocid="header.link"
            >
              {NAV_LABELS.contact[language]}
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="py-2 px-3 rounded text-sm font-medium text-primary hover:bg-primary/10"
                data-ocid="header.link"
              >
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
