import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllLoveQuotes } from "../hooks/useQueries";

const SAMPLE_QUOTES = [
  {
    id: "q1",
    text: "You are the poetry I never knew how to write, and the song I always wanted to sing.",
    author: "Atticus",
  },
  {
    id: "q2",
    text: "Tere bina zindagi se koi shikwa to nahin, tere bina zindagi bhi lekin zindagi to nahin.",
    author: "Gulzar",
  },
  {
    id: "q3",
    text: "I have waited for this opportunity for more than half a century, to repeat to you once again my vow of eternal fidelity and everlasting love.",
    author: "Gabriel García Márquez",
  },
  {
    id: "q4",
    text: "Whatever our souls are made of, his and mine are the same.",
    author: "Emily Brontë",
  },
  {
    id: "q5",
    text: "In your smile I see something more beautiful than the stars.",
    author: "Beth Reekles",
  },
  {
    id: "q6",
    text: "Kabhi kabhi mere dil mein khayal aata hai, ki jaise tujhko banaya gaya hai mere liye.",
    author: "Sahir Ludhianvi",
  },
];

type QuoteItem = { id: string; text: string; author?: string };

function HeroQuoteCard({ quote }: { quote: QuoteItem }) {
  return (
    <article
      className="col-span-1 md:col-span-2 relative rounded-2xl p-10 overflow-hidden group transition-all duration-500 hover:-translate-y-1"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.35 0.095 10) 0%, oklch(0.25 0.070 12) 100%)",
        boxShadow:
          "0 8px 40px 0 oklch(0.35 0.095 10 / 0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Decorative rose petal shape */}
      <div
        className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10"
        style={{ background: "oklch(0.86 0.060 15)" }}
      />
      <div
        className="absolute -left-4 -bottom-4 w-32 h-32 rounded-full opacity-10"
        style={{ background: "oklch(0.76 0.11 65)" }}
      />

      <div className="relative z-10">
        <div
          className="font-playfair text-white/20 select-none mb-2"
          style={{ fontSize: "6rem", lineHeight: 1, fontStyle: "italic" }}
          aria-hidden="true"
        >
          ❝
        </div>
        <p
          className="font-fraunces text-white leading-relaxed mb-6"
          style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
            fontStyle: "italic",
          }}
        >
          {quote.text}
        </p>
        {quote.author && (
          <p className="font-lato text-white/60 text-sm tracking-widest uppercase">
            — {quote.author}
          </p>
        )}
      </div>

      {/* Hover shimmer */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
        }}
      />
    </article>
  );
}

function ParchmentQuoteCard({ quote }: { quote: QuoteItem }) {
  return (
    <article
      className="relative rounded-2xl p-7 group transition-all duration-400 hover:-translate-y-1"
      style={{
        background: "oklch(0.93 0.028 50)",
        border: "1.5px solid oklch(0.76 0.11 65 / 0.4)",
        boxShadow: "0 4px 20px 0 oklch(0.76 0.11 65 / 0.12)",
      }}
    >
      <div
        className="font-parisienne text-rose-custom select-none mb-3"
        style={{ fontSize: "3rem", lineHeight: 1 }}
        aria-hidden="true"
      >
        ❝
      </div>
      <p
        className="font-parisienne leading-relaxed mb-4"
        style={{ fontSize: "1.35rem", color: "oklch(0.35 0.095 10)" }}
      >
        {quote.text}
      </p>
      {quote.author && (
        <p
          className="font-lato text-xs tracking-widest uppercase"
          style={{ color: "oklch(0.55 0.060 45)" }}
        >
          — {quote.author}
        </p>
      )}

      <div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.76 0.11 65), oklch(0.52 0.105 10))",
        }}
      />
    </article>
  );
}

function PlayfairQuoteCard({ quote }: { quote: QuoteItem }) {
  return (
    <article
      className="relative rounded-2xl p-8 flex flex-col justify-between group transition-all duration-400 hover:-translate-y-1"
      style={{
        background: "oklch(0.97 0.010 50)",
        border: "1px solid oklch(0.84 0.032 30)",
        boxShadow: "0 2px 16px 0 oklch(0.22 0.015 15 / 0.06)",
      }}
    >
      <div
        className="font-playfair absolute top-4 left-6 text-rose-custom opacity-15 select-none"
        style={{ fontSize: "7rem", lineHeight: 1 }}
        aria-hidden="true"
      >
        ❝
      </div>
      <div className="relative z-10 mt-8">
        <p
          className="font-playfair text-foreground leading-relaxed mb-5"
          style={{ fontSize: "1.05rem", fontStyle: "italic", fontWeight: 500 }}
        >
          {quote.text}
        </p>
        {quote.author && (
          <p className="font-lato text-muted-foreground text-xs tracking-wider uppercase">
            — {quote.author}
          </p>
        )}
      </div>

      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom center, oklch(0.86 0.060 15 / 0.15) 0%, transparent 70%)",
        }}
      />
    </article>
  );
}

function MinimalistQuoteCard({ quote }: { quote: QuoteItem }) {
  return (
    <article
      className="relative rounded-2xl p-8 text-center flex flex-col items-center justify-center group transition-all duration-400 hover:-translate-y-1"
      style={{
        background: "oklch(0.95 0.012 22)",
        border: "1.5px solid oklch(0.76 0.11 65 / 0.5)",
        boxShadow: "0 2px 12px 0 oklch(0.76 0.11 65 / 0.10)",
      }}
    >
      <div
        className="w-8 h-px mb-6"
        style={{ background: "oklch(0.76 0.11 65)" }}
      />
      <p
        className="font-instrument leading-relaxed mb-6 text-center"
        style={{ fontSize: "1.1rem", color: "oklch(0.30 0.050 15)" }}
      >
        {quote.text}
      </p>
      {quote.author && (
        <p
          className="font-lato text-xs tracking-widest uppercase"
          style={{ color: "oklch(0.76 0.11 65)" }}
        >
          {quote.author}
        </p>
      )}
      <div
        className="w-8 h-px mt-6"
        style={{ background: "oklch(0.76 0.11 65)" }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-3 right-3 text-xs opacity-30"
        style={{ color: "oklch(0.76 0.11 65)" }}
      >
        ♥
      </div>
    </article>
  );
}

function DancingQuoteCard({ quote }: { quote: QuoteItem }) {
  return (
    <article
      className="col-span-1 md:col-span-2 relative rounded-2xl p-8 overflow-hidden group transition-all duration-400 hover:-translate-y-1"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.88 0.055 15 / 0.6) 0%, oklch(0.91 0.045 15 / 0.8) 50%, oklch(0.93 0.028 50 / 0.7) 100%)",
        border: "1px solid oklch(0.84 0.032 30)",
        boxShadow: "0 4px 24px 0 oklch(0.52 0.105 10 / 0.12)",
      }}
    >
      <div className="relative z-10 text-center">
        <p
          className="font-dancing text-foreground leading-relaxed mb-5"
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            color: "oklch(0.35 0.095 10)",
          }}
        >
          {quote.text}
        </p>
        {quote.author && (
          <p className="font-lato text-muted-foreground text-sm tracking-wider uppercase">
            — {quote.author}
          </p>
        )}
      </div>

      {/* Floating hearts decoration */}
      <span
        className="absolute top-4 right-6 text-2xl opacity-20 text-rose-custom"
        aria-hidden="true"
      >
        ♥
      </span>
      <span
        className="absolute bottom-4 left-8 text-lg opacity-15 text-rose-custom"
        aria-hidden="true"
      >
        ♥
      </span>

      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.52 0.105 10 / 0.06) 0%, transparent 70%)",
        }}
      />
    </article>
  );
}

const CARD_VARIANTS = [
  "hero",
  "parchment",
  "playfair",
  "minimalist",
  "dancing",
] as const;

type CardVariant = (typeof CARD_VARIANTS)[number];

function getVariant(index: number): CardVariant {
  return CARD_VARIANTS[index % CARD_VARIANTS.length];
}

function QuoteCard({ quote, index }: { quote: QuoteItem; index: number }) {
  const variant = getVariant(index);
  switch (variant) {
    case "hero":
      return <HeroQuoteCard quote={quote} />;
    case "parchment":
      return <ParchmentQuoteCard quote={quote} />;
    case "playfair":
      return <PlayfairQuoteCard quote={quote} />;
    case "minimalist":
      return <MinimalistQuoteCard quote={quote} />;
    case "dancing":
      return <DancingQuoteCard quote={quote} />;
    default:
      return <PlayfairQuoteCard quote={quote} />;
  }
}

export default function QuotesSection() {
  const { data: quotes, isLoading } = useGetAllLoveQuotes();
  const displayQuotes = quotes && quotes.length > 0 ? quotes : SAMPLE_QUOTES;

  return (
    <section
      id="quotes"
      className="py-24 px-6"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.95 0.012 22) 0%, oklch(0.91 0.025 25 / 0.4) 50%, oklch(0.95 0.012 22) 100%)",
      }}
      data-ocid="quotes.section"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p
            className="font-parisienne text-rose-custom mb-3"
            style={{ fontSize: "1.4rem" }}
          >
            words from the heart
          </p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="flex-1 max-w-24 h-px bg-gradient-to-r from-transparent to-rose-custom" />
            <span className="text-rose-custom text-xl animate-heartbeat">
              ♥
            </span>
            <span className="flex-1 max-w-24 h-px bg-gradient-to-l from-transparent to-rose-custom" />
          </div>
          <h2
            className="font-fraunces text-foreground mb-3"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Our Love Quotes
          </h2>
          <p className="font-lato text-muted-foreground text-sm tracking-widest uppercase">
            Whispers of the heart
          </p>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data-ocid="quotes.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayQuotes.map((quote, idx) => (
              <div
                key={quote.id}
                data-ocid={`quotes.item.${idx + 1}`}
                className={
                  getVariant(idx) === "hero" || getVariant(idx) === "dancing"
                    ? "md:col-span-2"
                    : ""
                }
              >
                <QuoteCard quote={quote} index={idx} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && displayQuotes.length === 0 && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="quotes.empty_state"
          >
            <div className="text-4xl mb-4">❤</div>
            <p className="font-playfair text-lg">
              No quotes yet. Add some from Admin panel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
