import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllShayari } from "../hooks/useQueries";

const SAMPLE_SHAYARI = [
  {
    id: "s1",
    title: "Dil Ki Baat",
    body: "Tujhe dekh ke aankhein sharmati hain,\nDil mein teri yaadon ki mehfil sajti hai.\nJab bhi main sochu tujhe,\nHar pal mohabbat nayi lagti hai.",
    order: BigInt(1),
  },
  {
    id: "s2",
    title: "Ishq Ka Rang",
    body: "Tere bina zindagi adhuri si lagti hai,\nTeri baahon mein duniya puri si lagti hai.\nKya bataun teri aankhon ka jadoo,\nHar baar dekhun to nai dilbari lagti hai.",
    order: BigInt(2),
  },
  {
    id: "s3",
    title: "Mohabbat Ki Raah",
    body: "Teri hansi meri subah bana de,\nTeri awaaz meri raat basera.\nTu meri saans mein shamil hai,\nTu hi hai mera poora savera.",
    order: BigInt(3),
  },
];

export default function ShayariSection() {
  const { data: shayariList, isLoading } = useGetAllShayari();
  const displayList =
    shayariList && shayariList.length > 0 ? shayariList : SAMPLE_SHAYARI;

  return (
    <section id="shayari" className="py-20 px-6" data-ocid="shayari.section">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="flex-1 max-w-24 h-px bg-gradient-to-r from-transparent to-gold-custom" />
            <span className="text-gold-custom text-xl">✦</span>
            <span className="flex-1 max-w-24 h-px bg-gradient-to-l from-transparent to-gold-custom" />
          </div>
          <h2
            className="font-playfair text-foreground mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 600 }}
          >
            Romantic Shayari
          </h2>
          <p className="font-lato text-muted-foreground text-sm tracking-widest uppercase">
            Words from the heart
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="flex-1 max-w-24 h-px bg-gradient-to-r from-transparent to-gold-custom" />
            <span className="text-gold-custom text-xl">✦</span>
            <span className="flex-1 max-w-24 h-px bg-gradient-to-l from-transparent to-gold-custom" />
          </div>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-ocid="shayari.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayList.map((shayari, idx) => (
              <article
                key={shayari.id}
                className="relative rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "oklch(0.94 0.022 40)",
                  border: "1.5px solid oklch(0.78 0.10 65 / 0.4)",
                  boxShadow:
                    "0 4px 24px 0 oklch(0.22 0.015 15 / 0.07), 0 0 0 1px oklch(0.78 0.10 65 / 0.08)",
                }}
                data-ocid={`shayari.item.${idx + 1}`}
              >
                {/* Pink glow overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at top center, oklch(0.88 0.055 15 / 0.25) 0%, transparent 70%)",
                  }}
                />

                {/* Corner ornaments */}
                <span className="absolute top-3 left-3 text-gold-custom opacity-50 text-lg select-none">
                  ✿
                </span>
                <span className="absolute top-3 right-3 text-gold-custom opacity-50 text-lg select-none">
                  ✿
                </span>
                <span className="absolute bottom-3 left-3 text-gold-custom opacity-50 text-lg select-none">
                  ❧
                </span>
                <span className="absolute bottom-3 right-3 text-gold-custom opacity-50 text-lg select-none">
                  ❧
                </span>

                {/* Gold top border */}
                <div
                  className="h-1 w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, oklch(0.78 0.10 65), transparent)",
                  }}
                />

                <div className="px-8 py-8 text-center relative z-10">
                  <h3
                    className="font-playfair font-semibold text-rose-custom mb-5"
                    style={{ fontSize: "1.1rem", letterSpacing: "0.04em" }}
                  >
                    {shayari.title}
                  </h3>

                  <div
                    className="font-dancing text-foreground leading-relaxed"
                    style={{ fontSize: "1.05rem" }}
                  >
                    {shayari.body.split("\n").map((line, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: line index is stable for shayari body
                      <span key={i}>
                        {line}
                        {i < shayari.body.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gold bottom border */}
                <div
                  className="h-1 w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, oklch(0.78 0.10 65), transparent)",
                  }}
                />
              </article>
            ))}
          </div>
        )}

        {!isLoading && displayList.length === 0 && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="shayari.empty_state"
          >
            <div className="text-4xl mb-4">✦</div>
            <p className="font-playfair text-lg">
              No shayari yet. Add some from Admin panel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
