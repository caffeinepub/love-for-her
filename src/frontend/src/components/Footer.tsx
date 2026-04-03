export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer
      className="py-8 px-6"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.58 0.085 10), oklch(0.50 0.115 10))",
      }}
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-4">
          <span
            className="font-playfair text-white text-xl font-semibold"
            style={{ letterSpacing: "0.08em" }}
          >
            A&amp;M ♥
          </span>
        </div>

        {/* Quote */}
        <p className="font-dancing text-white/80 text-base mb-5">
          "Together is our favourite place to be"
        </p>

        {/* Divider */}
        <div
          className="mx-auto mb-5 h-px max-w-xs"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />

        {/* Links */}
        <div className="flex items-center justify-center gap-6 mb-5">
          {["Home", "Shayari", "Quotes", "Gallery"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="font-lato text-white/70 hover:text-white text-sm transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Heart row */}
        <div className="flex items-center justify-center gap-2 mb-5 text-white/40 text-sm">
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
        </div>

        {/* Attribution */}
        <p className="font-lato text-white/55 text-xs">
          © {year}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white/80 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
