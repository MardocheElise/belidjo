// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { MongoClient } from "mongodb";
// import bcrypt from "bcryptjs";

// // Configuration de NextAuth
// const authOptions: NextAuthOptions = {
//   providers: [
//     // Provider pour la connexion avec email + mot de passe
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Mot de passe", type: "password" }
//       },
//       // Cette fonction est appelée quand l'utilisateur essaie de se connecter
//       async authorize(credentials) {
//         // 1. Vérifier que nom et mot de passe sont fournis
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email et mot de passe requis");
//         }

//         let client;
        
//         try {
//           // 2. Se connecter à MongoDB
//           client = await MongoClient.connect(process.env.MONGODB_URI!);
//           const db = client.db();
//           const vendorsCollection = db.collection("vendors");

//           // 3. Chercher le vendeur par nom dans la base de données
//           const vendor = await vendorsCollection.findOne({ 
//             email: credentials.email 
//           });

//           // 4. Si le vendeur n'existe pas
//           if (!vendor) {
//             throw new Error("Nom ou mot de passe incorrect");
//           }

//           // 5. Comparer le mot de passe entré avec le mot de passe haché en base
//           const isPasswordValid = await bcrypt.compare(
//             credentials.password,  // Mot de passe en clair entré par l'utilisateur
//             vendor.password        // Mot de passe haché stocké dans MongoDB
//           );

//           // 6. Si le mot de passe ne correspond pas
//           if (!isPasswordValid) {
//             throw new Error("Nom ou mot de passe incorrect");
//           }

//           // 7. Si tout est OK, retourner les infos du vendeur
//           // Ces infos seront disponibles dans la session
//           return {
//             id: vendor._id.toString(),
//             name: vendor.name,
//             email: vendor.email || null,
//           };
//         } catch (error) {
//           console.error("Erreur lors de l'authentification:", error);
//           throw error;
//         } finally {
//           // 8. Toujours fermer la connexion MongoDB
//           if (client) {
//             await client.close();
//           }
//         }
//       }
//     }),
//   ],
//   session: {
//     strategy: "jwt", // Utiliser JWT pour les sessions
//   },
//   pages: {
//     signIn: "/", // Page de connexion personnalisée
//   },
//   callbacks: {
//     // Ajouter l'ID du vendeur au token JWT
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     // Ajouter l'ID du vendeur à la session
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };










// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import connectDB from "@/lib/mongodb";
// import { Vendor } from "@/lib/models";

// // Configuration de NextAuth
// const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Identifiants",
//       credentials: {
//         name: { label: "Nom", type: "text" },
//         mot_de_passe: { label: "Mot de passe", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.name || !credentials?.mot_de_passe) {
//           throw new Error("Nom et mot de passe requis");
//         }

//         try {
//           console.log("🔄 Tentative de connexion pour:", credentials.name);

//           // Se connecter à MongoDB
//           await connectDB();

//           console.log("✅ Connecté à MongoDB");

//           // Chercher le vendeur par nom
//           const vendor = await Vendor.findOne({ name: credentials.name });

//           if (!vendor) {
//             console.log("❌ Vendeur non trouvé");
//             throw new Error("Nom ou mot de passe incorrect");
//           }

//           console.log("✅ Vendeur trouvé");
//           console.log("📋 Informations du vendeur:");
//           console.log("   - ID:", vendor._id);
//           console.log("   - Nom:", vendor.name);
//           console.log("   - Email:", vendor.email || "Non défini");
//           console.log("   - Mot de passe stocké:", vendor.password ? "✅ Existe" : "❌ MANQUANT");

//           // IMPORTANT: Vérifier que le mot de passe existe dans la base de données
//           if (!vendor.password) {
//             console.log("❌ Le mot de passe est manquant dans la base de données");
//             console.log("💡 Solution: Supprimez ce compte et réinscrivez-vous");
//             throw new Error("Compte invalide. Veuillez vous réinscrire.");
//           }

//           console.log("🔐 Vérification du mot de passe...");
//           console.log("   - Hash stocké (début):", vendor.password.substring(0, 15) + "...");
//           console.log("   - Mot de passe saisi (longueur):", credentials.mot_de_passe.length, "caractères");

//           // Comparer le mot de passe
//           const isPasswordValid = await bcrypt.compare(
//             credentials.mot_de_passe,
//             vendor.password
//           );

//           console.log("🔍 Résultat de la comparaison:", isPasswordValid ? "✅ Valide" : "❌ Invalide");

//           if (!isPasswordValid) {
//             console.log("❌ Mot de passe incorrect");
//             throw new Error("Nom ou mot de passe incorrect");
//           }

//           console.log("✅ Authentification réussie");

//           // Retourner les infos du vendeur
//           return {
//             id: vendor._id.toString(),
//             name: vendor.name,
//             email: vendor.email || "",
//           };
//         } catch (error) {
//           console.error("❌ Erreur lors de l'authentification:", error);
          
//           if (error instanceof Error) {
//             // Erreur de timeout
//             if (error.message.includes("ETIMEOUT") || error.message.includes("queryTxt")) {
//               throw new Error("Impossible de se connecter à la base de données");
//             }
//             throw error;
//           }
          
//           throw new Error("Erreur lors de l'authentification");
//         }
//       }
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.email = user.email;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.name = token.name as string;
//         session.user.email = token.email as string;
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };






// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import connectDB from "@/lib/mongodb";
// import { Vendor } from "@/lib/models";

// // Configuration de NextAuth
// const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         name: { label: "Nom", type: "text" },
//         password: { label: "Mot de passe", type: "password" }
//       },
//       async authorize(credentials) {
//         console.log("==========================================");
//         console.log("🚀 DEBUT DE L'AUTORISATION");
//         console.log("📦 Credentials reçues:", credentials);
//         console.log("==========================================");
        
//         if (!credentials?.name || !credentials?.password) {
//           console.log("❌ Credentials manquantes");
//           throw new Error("Nom et mot de passe requis");
//         }

//         try {
//           console.log("🔄 Tentative de connexion pour:", credentials.name);

//           // Se connecter à MongoDB
//           await connectDB();

//           console.log("✅ Connecté à MongoDB");

//           // Chercher le vendeur par nom
//           const vendor = await Vendor.findOne({ name: credentials.name });

//           if (!vendor) {
//             console.log("❌ Vendeur non trouvé");
//             throw new Error("Nom ou mot de passe incorrect");
//           }

//           console.log("✅ Vendeur trouvé");
//           console.log("📋 Informations du vendeur:");
//           console.log("   - ID:", vendor._id);
//           console.log("   - Nom:", vendor.name);
//           console.log("   - Email:", vendor.email || "Non défini");
//           console.log("   - Mot de passe stocké:", vendor.password ? "✅ Existe" : "❌ MANQUANT");

//           // IMPORTANT: Vérifier que le mot de passe existe dans la base de données
//           if (!vendor.password) {
//             console.log("❌ Le mot de passe est manquant dans la base de données");
//             console.log("💡 Solution: Supprimez ce compte et réinscrivez-vous");
//             throw new Error("Compte invalide. Veuillez vous réinscrire.");
//           }

//           console.log("🔐 Vérification du mot de passe...");
//           console.log("   - Hash stocké (début):", vendor.password.substring(0, 15) + "...");
//           console.log("   - Mot de passe saisi (longueur):", credentials.password.length, "caractères");

//           // Comparer le mot de passe
//           const isPasswordValid = await bcrypt.compare(
//             credentials.password,
//             vendor.password
//           );

//           console.log("🔍 Résultat de la comparaison:", isPasswordValid ? "✅ Valide" : "❌ Invalide");

//           if (!isPasswordValid) {
//             console.log("❌ Mot de passe incorrect");
//             throw new Error("Nom ou mot de passe incorrect");
//           }

//           console.log("✅ Authentification réussie");

//           // Retourner les infos du vendeur
//           return {
//             id: vendor._id.toString(),
//             name: vendor.name,
//             email: vendor.email || "",
//           };
//         } catch (error) {
//           console.error("❌ Erreur lors de l'authentification:", error);
          
//           if (error instanceof Error) {
//             // Erreur de timeout
//             if (error.message.includes("ETIMEOUT") || error.message.includes("queryTxt")) {
//               throw new Error("Impossible de se connecter à la base de données");
//             }
//             throw error;
//           }
          
//           throw new Error("Erreur lors de l'authentification");
//         }
//       }
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.email = user.email;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.name = token.name as string;
//         session.user.email = token.email as string;
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };




import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { Vendor } from "@/lib/models/model_vendor";

// Configuration de NextAuth
const authOptions: NextAuthOptions =  {
  providers: [
    // Provider pour la connexion avec email + mot de passe
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      // Cette fonction est appelée quand l'utilisateur essaie de se connecter
      async authorize(credentials) {
        // console.log("==========================================");
        // console.log("🚀 DEBUT DE L'AUTORISATION");
        // console.log("📦 Credentials reçues:", credentials);
        // console.log("==========================================");

        // 1. Vérifier que email et mot de passe sont fournis
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Credentials manquantes");
          throw new Error("Email et mot de passe requis");
        }

        try {
          // 2. Se connecter à MongoDB avec Mongoose
          console.log("🔄 Connexion à MongoDB...");
          await connectDB();
          console.log("✅ Connecté à MongoDB");

          // 3. Chercher le vendeur par email dans la base de données
          // console.log("🔍 Recherche du vendeur avec l'email:", credentials.email);
          const vendor = await Vendor.findOne({ email: credentials.email });

          // 4. Si le vendeur n'existe pas
          if (!vendor) {
            console.log("❌ Vendeur non trouvé avec l'email:", credentials.email);
            throw new Error("Email ou mot de passe incorrect");
          }

          console.log("✅ Vendeur trouvé");
          console.log("📋 Informations du vendeur:");
          console.log("   - ID:", vendor._id);
          console.log("   - Nom:", vendor.name);
          console.log("   - Email:", vendor.email);
          console.log("   - Mot de passe stocké:", vendor.password ? "✅ Existe" : "❌ MANQUANT");

          // Vérifier que le mot de passe existe
          if (!vendor.password) {
            console.log("❌ Le mot de passe est manquant dans la base de données");
            throw new Error("Compte invalide. Veuillez vous réinscrire.");
          }

          // 5. Comparer le mot de passe entré avec le mot de passe haché en base
          console.log("🔐 Vérification du mot de passe...");
          const isPasswordValid = await bcrypt.compare(
            credentials.password,  // Mot de passe en clair entré par l'utilisateur
            vendor.password        // Mot de passe haché stocké dans MongoDB
          );

          console.log("🔍 Résultat de la comparaison:", isPasswordValid ? "✅ Valide" : "❌ Invalide");

          // 6. Si le mot de passe ne correspond pas
          if (!isPasswordValid) {
            console.log("❌ Mot de passe incorrect");
            throw new Error("Email ou mot de passe incorrect");
          }

          // 7. Si tout est OK, retourner les infos du vendeur
          // Ces infos seront disponibles dans la session
          console.log("✅ Authentification réussie");
          return {
            id: vendor._id.toString(),
            name: vendor.name,
            email: vendor.email || "",
          };

        } catch (error) {
          console.error("❌ Erreur lors de l'authentification:", error);
          
          if (error instanceof Error) {
            // Erreur de timeout
            if (error.message.includes("ETIMEOUT") || error.message.includes("queryTxt")) {
              throw new Error("Impossible de se connecter à la base de données");
            }
            throw error;
          }
          
          throw new Error("Erreur lors de l'authentification");
        }
      }
    }),
  ],
  session: {
    strategy: "jwt", // Utiliser JWT pour les sessions
  },
  pages: {
    signIn: "/", // Page de connexion personnalisée
  },
  callbacks: {
    // Ajouter les infos du vendeur au token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    // Ajouter les infos à la session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };