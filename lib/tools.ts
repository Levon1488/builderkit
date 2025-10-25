export type Tool = {
  id: string;
  name: string;
  description: string;
  url: string;
};

export const tools: Tool[] = [
  {
    id: "meme",
    name: "Meme Generator",
    description: "Tvoř vtipné meme obrázky",
    url: "https://example.com/meme",
  },
  {
    id: "kniha",
    name: "Kniha",
    description: "Generátor knihy a kapitol",
    url: "https://example.com/book",
  },
  {
    id: "reality",
    name: "Reality Scan",
    description: "3D skenování reality",
    url: "https://example.com/reality",
  },
  {
    id: "pitchdeck",
    name: "Pitchdeck",
    description: "Prezentace pro investory",
    url: "https://example.com/pitchdeck",
  },
  {
    id: "audio",
    name: "Audio Studio",
    description: "Tvorba a úprava audia",
    url: "https://example.com/audio",
  },
  {
    id: "video",
    name: "Video Studio",
    description: "Generování a střih videa",
    url: "https://example.com/video",
  },
];
