"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Sparkles,
  Truck,
  Star,
  GraduationCap,
} from "lucide-react";

export default function FruitHomepage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; delay: number }>
  >([]);

  // Fruits flottants avec positions et animations
  const floatingFruits = [
    { src: "/ananas.jpeg", size: 120, top: "10%", left: "10%", delay: "0s" },
    { src: "/avocat.jpeg", size: 100, top: "20%", right: "15%", delay: "5s" },
    {
      src: "/banane.jpeg",
      size: 110,
      bottom: "15%",
      left: "15%",
      delay: "10s",
    },
    {
      src: "/mangue.jpeg",
      size: 130,
      bottom: "25%",
      right: "10%",
      delay: "15s",
    },
    { src: "/ananas.jpeg", size: 90, top: "60%", left: "5%", delay: "7s" },
    { src: "/mangue.jpeg", size: 115, top: "5%", left: "60%", delay: "12s" },
  ];

  // Gestion du mouvement de souris pour l'effet parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Génération de particules
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 15,
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-orange-400 to-orange-300">
      {/* Fond animé avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br  from-orange-50 via-orange-400 to-orange-300 animate-gradient-xy opacity-90" />

      {/* Fruits flottants en arrière-plan */}
      {floatingFruits.map((fruit, index) => (
        <div
          key={index}
          className="absolute opacity-10 rounded-full transition-transform duration-1000 ease-out"
          style={{
            width: `${fruit.size}px`,
            height: `${fruit.size}px`,
            top: fruit.top,
            bottom: fruit.bottom,
            left: fruit.left,
            right: fruit.right,
            animationDelay: fruit.delay,
            transform: `translate(${mousePosition.x * (index + 1) * 2}px, ${
              mousePosition.y * (index + 1) * 2
            }px)`,
          }}
        >
          <div className="w-full h-full animate-float-complex">
            <Image
              src={fruit.src}
              alt="Fruit"
              width={fruit.size}
              height={fruit.size}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      ))}

      {/* Particules flottantes */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white/60 rounded-full animate-particle-float"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
        {/* Logo avec animation */}
        <h1 className="text-6xl md:text-8xl font-black mb-6 animate-logo-glow">
          <span className="bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent animate-text-shimmer">
            Bélidjo
          </span>
        </h1>

        {/* Tagline */}
        {/* Tagline */}
        <h2 className="text-xl md:text-2xl mb-4 opacity-95 animate-slide-in-left font-semibold tracking-wide">
          🍊 Votre Marché Universitaire Premium 🍊
        </h2>

        {/* Description */}
        <p className="text-base md:text-lg mb-10 opacity-90 max-w-2xl leading-relaxed animate-slide-in-right font-medium">
          Découvrez une sélection exclusive de fruits frais et de qualité
          supérieure, soigneusement cueillis et livrés en un temps record
          directement sur votre campus.
          <br />
          Mangues gorgées de soleil, ananas parfumés, avocats onctueux et
          bananes parfaitement mûres —
          <span className="font-bold text-yellow-200">
            {" "}
            tout ce qu’il vous faut pour allier santé, plaisir et praticité au
            quotidien.
          </span>
        </p>

        {/* Bouton principal */}
        <Link href="/product">
          <Button
            size="lg"
            className="group relative bg-white text-orange-600 hover:bg-gray-50 text-lg font-bold py-6 px-10 rounded-full shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-bounce-in overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <ShoppingCart className="w-6 h-6 mr-3" />
            <span className="relative z-10 uppercase tracking-wider">
              Passer Une Commande
            </span>
          </Button>
        </Link>

        {/* Indicateurs de qualité */}
        <div className="flex space-x-6 mt-8 animate-fade-in-up">
          <div className="text-center">
            <Truck className="mx-auto w-8 h-8 text-white" />
            <p className="text-sm opacity-80">Livraison 15min</p>
          </div>
          <div className="text-center">
            <Star className="mx-auto w-8 h-8 text-yellow-500" />
            <p className="text-sm opacity-80">Qualité Premium</p>
          </div>
          <div className="text-center">
            <GraduationCap className="mx-auto w-8 h-8 text-blue-500" />
            <p className="text-sm opacity-80">Spécial Étudiants</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-xy {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float-complex {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-30px) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translateY(-20px) rotate(180deg) scale(0.9);
          }
          75% {
            transform: translateY(-40px) rotate(270deg) scale(1.05);
          }
        }

        @keyframes logo-glow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes text-shimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 0.95;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 0.9;
            transform: translateX(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(50px);
          }
          60% {
            opacity: 1;
            transform: scale(1.1) translateY(-10px);
          }
          80% {
            transform: scale(0.95) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes particle-float {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient-xy {
          background-size: 300% 300%;
          animation: gradient-xy 10s ease infinite;
        }

        .animate-float-complex {
          animation: float-complex 20s ease-in-out infinite;
        }

        .animate-logo-glow {
          animation: logo-glow 3s ease-in-out infinite;
        }

        .animate-text-shimmer {
          background-size: 200% 200%;
          animation: text-shimmer 3s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 1.5s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 1.5s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 2s ease-out;
        }

        .animate-particle-float {
          animation: particle-float linear infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 2s ease-out;
        }
      `}</style>
    </div>
  );
}
