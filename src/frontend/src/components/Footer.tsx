import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "react-icons/si";
import {
  CATEGORY_LABELS,
  NAV_LABELS,
  useLanguage,
} from "../contexts/LanguageContext";
import { useSocialLinks } from "../hooks/useQueries";

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

export function Footer() {
  const { data: socialLinks } = useSocialLinks();
  const { language } = useLanguage();
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer
      className="bg-card border-t border-border mt-12"
      data-ocid="footer.section"
    >
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/assets/uploads/1773553344647-019d1c24-b9ed-7468-ab15-14552f5bfdfc-11.png"
                alt="Veritas News"
                className="h-12 w-auto"
              />
              <div>
                <div className="font-headline font-bold text-foreground">
                  VERITAS NEWS
                </div>
                <div className="text-primary text-xs font-semibold tracking-widest">
                  THE UNTOLD INDIAN
                </div>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Bringing you the untold stories of India and the world. Truth,
              integrity, and journalism that matters.
            </p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              {[
                {
                  href: socialLinks?.facebookPage,
                  icon: SiFacebook,
                  label: "Facebook Page",
                },
                {
                  href: socialLinks?.facebookProfile,
                  icon: SiFacebook,
                  label: "Facebook Profile",
                },
                {
                  href: socialLinks?.youtube,
                  icon: SiYoutube,
                  label: "YouTube",
                },
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
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              {WHATSAPP_CHANNELS.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded bg-muted text-muted-foreground hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  <SiWhatsapp className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-headline font-semibold text-foreground mb-4 border-b border-primary pb-2 section-divider">
              Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to="/category/$cat"
                    params={{ cat }}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {CATEGORY_LABELS[cat]?.[language] ?? cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-semibold text-foreground mb-4 border-b border-primary pb-2 section-divider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/" as const, label: NAV_LABELS.home[language] },
                { to: "/videos" as const, label: NAV_LABELS.videos[language] },
                {
                  to: "/gallery" as const,
                  label: NAV_LABELS.gallery[language],
                },
                { to: "/live" as const, label: NAV_LABELS.live[language] },
                { to: "/about" as const, label: NAV_LABELS.about[language] },
                {
                  to: "/contact" as const,
                  label: NAV_LABELS.contact[language],
                },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-semibold text-foreground mb-4 border-b border-primary pb-2 section-divider">
              Connect
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                For news tips and editorial inquiries, reach out through our
                contact page.
              </p>
              <Link
                to="/contact"
                className="inline-block text-primary hover:underline font-medium"
              >
                Contact Us →
              </Link>
              <div className="mt-4">
                <img
                  src="/assets/uploads/1774009120498-019d1c24-ba98-778d-a31b-3785cc8d2365-12.png"
                  alt="Veritas News Channel"
                  className="w-full max-w-[200px] rounded opacity-80"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            © {year} VERITAS NEWS — THE UNTOLD INDIAN. All rights reserved.
          </span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-primary" /> using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
