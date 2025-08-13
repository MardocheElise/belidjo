export interface Product {
  id: string;
  name: string;
  desc: string;
  price: string;
  priceNumber: number;
  img: string;
  category: string;
  details: string;
  origin: string;
  freshness: string;
  nutritionalInfo: string[];
}

export const products: Product[] = [
  {
    id: "fresh-carrot",
    name: "Fresh Carrot",
    desc: "Local (1kg)",
    price: "$2.9",
    priceNumber: 2.9,
    img: "/ananas.jpeg",
    category: "Légumes",
    details: "Carottes fraîches cultivées localement, riches en vitamines et parfaites pour vos plats.",
    origin: "Ferme locale d'Abidjan",
    freshness: "Récolté aujourd'hui",
    nutritionalInfo: ["Riche en vitamine A", "Source de fibres", "Faible en calories"]
  },
  {
    id: "fresh-capsicum",
    name: "Fresh Capsicum",
    desc: "Red (500g)",
    price: "$2.9",
    priceNumber: 2.9,
    img: "/avocat.jpeg",
    category: "Légumes",
    details: "Poivrons rouges croquants et savoureux, parfaits pour vos salades et plats cuisinés.",
    origin: "Production locale",
    freshness: "Ultra frais",
    nutritionalInfo: ["Riche en vitamine C", "Antioxydants naturels", "Source de potassium"]
  },
  {
    id: "mustard-greens",
    name: "Mustard Greens",
    desc: "Local (500g)",
    price: "$2.9",
    priceNumber: 2.9,
    img: "/banane.jpeg",
    category: "Légumes verts",
    details: "Feuilles de moutarde fraîches, idéales pour vos soupes et sautés traditionnels.",
    origin: "Cultivé en Côte d'Ivoire",
    freshness: "Fraîchement cueilli",
    nutritionalInfo: ["Riche en fer", "Source de calcium", "Vitamines K et A"]
  },
  {
    id: "radish",
    name: "Radish",
    desc: "Local (1kg)",
    price: "$2.9",
    priceNumber: 2.9,
    img: "/mangue.jpeg",
    category: "Légumes racines",
    details: "Radis frais et croquants, parfaits pour apporter du piquant à vos plats.",
    origin: "Production artisanale",
    freshness: "Récolté ce matin",
    nutritionalInfo: ["Faible en calories", "Source de vitamine C", "Propriétés détoxifiantes"]
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}
