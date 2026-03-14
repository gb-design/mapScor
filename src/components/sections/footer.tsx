import Image from "next/image";

const links = {
  Product: [
    { label: "Free Audit", href: "#audit" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Imprint", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Image src="/logo.png" alt="mapScor" width={140} height={36} className="h-9 w-auto mb-4" />
            <p className="text-sm text-text2 max-w-xs leading-relaxed">
              AI-powered audit tool for Google Business Profiles.
              Free, instant, no signup required.
            </p>
            <p className="mt-4 text-xs text-hint">
              Made with care in Vienna, Austria
            </p>
          </div>

          {/* Link Groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {items.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text2 hover:text-text transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-hint">
          <span>&copy; {new Date().getFullYear()} mapScor. All rights reserved.</span>
          <span>
            A{" "}
            <a
              href="https://gesign.art"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text2 hover:text-text transition-colors"
            >
              gesign.art
            </a>{" "}
            project
          </span>
        </div>
      </div>
    </footer>
  );
}
