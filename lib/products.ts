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
    id: "Ananas",
    name: "Ananas",
    desc: "x1 (1kg)",
    price: "500f",
    priceNumber: 500,
    img: "/ananas.jpeg",
    category: "Légumes",
    details: "Carottes fraîches cultivées localement, riches en vitamines et parfaites pour vos plats.",
    origin: "Ferme locale d'Abidjan",
    freshness: "Récolté aujourd'hui",
    nutritionalInfo: ["Riche en vitamine A", "Source de fibres", "Faible en calories"]
  },
  {
    id: "avocat",
    name: "Avocat",
    desc: "Red (500g)",
    price: "300f",
    priceNumber: 300,
    img: "/avocat.jpeg",
    category: "Légumes",
    details: "Poivrons rouges croquants et savoureux, parfaits pour vos salades et plats cuisinés.",
    origin: "Production locale",
    freshness: "Ultra frais",
    nutritionalInfo: ["Riche en vitamine C", "Antioxydants naturels", "Source de potassium"]
  },
  {
    id: "banane",
    name: "Banane",
    desc: "x3 (500g)",
    price: "200f",
    priceNumber: 200,
    img: "/banane.jpeg",
    category: "Légumes verts",
    details: "Feuilles de moutarde fraîches, idéales pour vos soupes et sautés traditionnels.",
    origin: "Cultivé en Côte d'Ivoire",
    freshness: "Fraîchement cueilli",
    nutritionalInfo: ["Riche en fer", "Source de calcium", "Vitamines K et A"]
  },
  {
    id: "mangue",
    name: "Mangue",
    desc: "x1 (400g)",
    price: "200f",
    priceNumber: 200,
    img: "/mangue.jpeg",
    category: "Légumes racines",
    details: "Radis frais et croquants, parfaits pour apporter du piquant à vos plats.",
    origin: "Production artisanale",
    freshness: "Récolté ce matin",
    nutritionalInfo: ["Faible en calories", "Source de vitamine C", "Propriétés détoxifiantes"]
  },
   {
    id: "oignon",
    name: "Oignon",
    desc: "x4 (300g)",
    price: "200f",
    priceNumber: 200,
    img: "/oignon.jpeg",
    category: "Légumes racines",
    details: "Radis frais et croquants, parfaits pour apporter du piquant à vos plats.",
    origin: "Production artisanale",
    freshness: "Récolté ce matin",
    nutritionalInfo: ["Faible en calories", "Source de vitamine C", "Propriétés détoxifiantes"]
  },
   {
    id: "Orange",
    name: "orange",
    desc: "x3 (300g)",
    price: "200f",
    priceNumber: 200,
    img: "/orange.jpeg",
    category: "Légumes racines",
    details: "Radis frais et croquants, parfaits pour apporter du piquant à vos plats.",
    origin: "Production artisanale",
    freshness: "Récolté ce matin",
    nutritionalInfo: ["Faible en calories", "Source de vitamine C", "Propriétés détoxifiantes"]
  },
   {
    id: "pomme",
    name: "Pomme",
    desc: "x1",
    price: "100f",
    priceNumber: 100,
    img: "/pommeR.jpeg",
    category: "Légumes racines",
    details: "Radis frais et croquants, parfaits pour apporter du piquant à vos plats.",
    origin: "Production artisanale",
    freshness: "Récolté ce matin",
    nutritionalInfo: ["Faible en calories", "Source de vitamine C", "Propriétés détoxifiantes"]
  },
  {
    id: "salade",
    name: "Salade",
    desc: "Local (500g)",
    price: "350F",
    priceNumber: 350,
    img: "/salade.jpeg",
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
