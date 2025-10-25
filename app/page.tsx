import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    id: "rodinna",
    title: "Rodinná proměna",
    desc: "Proměňte svou rodinu v legendu",
    price: "3 kredity",
    output: "1 výsledný obraz",
    img: "/placeholder/rodinna.jpg",
  },
  {
    id: "tata",
    title: "Táta jako legenda",
    desc: "Tvůj táta jako filmový ochránce",
    price: "1 kredit",
    output: "portrét",
    img: "/placeholder/tata.jpg",
  },
  {
    id: "mama",
    title: "Máma jako bohyně",
    desc: "Portrét se silou a jemností",
    price: "1 kredit",
    output: "portrét",
    img: "/placeholder/mama.jpg",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-10">
        Vyberte proměnu
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Link
            href={`/generator/${c.id}`}
            key={c.id}
            className="group rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition-colors"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={c.img}
                alt={c.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{c.title}</h3>
                <span className="text-emerald-300 text-sm">{c.price}</span>
              </div>
              <p className="text-sm opacity-90">{c.desc}</p>
              <p className="text-xs opacity-70">Výstup: {c.output}</p>
              <button
                className="mt-2 inline-flex w-fit items-center rounded-md bg-emerald-500/80 px-3 py-1.5 text-sm hover:bg-emerald-400/90"
                type="button"
              >
                Vybrat
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
