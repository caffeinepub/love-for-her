import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllLoveQuotes } from "../hooks/useQueries";

const SAMPLE_QUOTES = [
  {
    id: "q1",
    text: "You are every reason, every hope, and every dream I've ever had.",
    author: "Nicholas Sparks",
  },
  {
    id: "q2",
    text: "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
    author: "Maya Angelou",
  },
  {
    id: "q3",
    text: "I would rather spend one lifetime with you, than face all the ages of this world alone.",
    author: undefined,
  },
  {
    id: "q4",
    text: "Whatever our souls are made of, his and mine are the same.",
    author: "Emily Brontë",
  },
];

export default function QuotesSection() {
  const { data: quotes, isLoading } = useGetAllLoveQuotes();
  const displayQuotes = quotes && quotes.length > 0 ? quotes : SAMPLE_QUOTES;

  return (
    <section
      id="quotes"
      className="py-20 px-6"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.97 0.008 20) 0%, oklch(0.93 0.040 15 / 0.35) 50%, oklch(0.97 0.008 20) 100%)",
      }}
      data-ocid="quotes.section"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="flex-1 max-w-24 h-px bg-gradient-to-r from-transparent to-rose-custom" />
            <span className="text-rose-custom text-xl animate-heartbeat">
              ♥
            </span>
            <span className="flex-1 max-w-24 h-px bg-gradient-to-l from-transparent to-rose-custom" />
          </div>
          <h2
            className="font-playfair text-foreground mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 600 }}
          >
            Our Love Quotes
          </h2>
          <p className="font-lato text-muted-foreground text-sm tracking-widest uppercase">
            Whispers of the heart
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="flex-1 max-w-24 h-px bg-gradient-to-r from-transparent to-rose-custom" />
            <span className="text-rose-custom text-xl animate-heartbeat">
              ♥
            </span>
            <span className="flex-1 max-w-24 h-px bg-gradient-to-l from-transparent to-rose-custom" />
          </div>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data-ocid="quotes.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayQuotes.map((quote, idx) => (
              <article
                key={quote.id}
                className="relative rounded-xl p-6 text-center group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "oklch(0.96 0.016 35)",
                  border: "1px solid oklch(0.85 0.030 30)",
                  boxShadow: "0 2px 16px 0 oklch(0.22 0.015 15 / 0.06)",
                }}
                data-ocid={`quotes.item.${idx + 1}`}
              >
                {/* Big quote mark */}
                <div
                  className="font-playfair text-rose-custom opacity-25 select-none absolute top-2 left-4"
                  style={{ fontSize: "4rem", lineHeight: 1 }}
                  aria-hidden="true"
                >
                  ❝
                </div>

                <div className="relative z-10 mt-4">
                  <p
                    className="font-dancing text-foreground leading-relaxed mb-4"
                    style={{ fontSize: "1rem" }}
                  >
                    {quote.text}
                  </p>
                  {quote.author && (
                    <p className="font-lato text-muted-foreground text-xs tracking-wider uppercase">
                      — {quote.author}
                    </p>
                  )}
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at bottom center, oklch(0.88 0.055 15 / 0.20) 0%, transparent 70%)",
                  }}
                />
              </article>
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
