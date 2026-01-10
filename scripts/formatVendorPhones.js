// node scripts/formatVendorPhones.js
// ```

// ---

// ## 🔧 Les corrections apportées

// | Avant (Ton code) | Après (Corrigé) |
// |------------------|-----------------|
// | ❌ `import { Vendor } from '@/lib/models/model_vendor'` | ✅ `const Vendor = mongoose.model(...)` |
// | ❌ `interface VendorWithPhone` (TypeScript) | ✅ Pas d'interface (JavaScript pur) |
// | ❌ Types TypeScript partout | ✅ JSDoc comments |
// | ❌ URI hardcodée dans le script | ✅ Lecture depuis `.env.local` |
// | ❌ Pas de gestion timeout | ✅ `serverSelectionTimeoutMS: 30000` |

// ---

// ## ✅ Si tout fonctionne

// Tu devrais voir :
// ```
// ============================================================
// 🚀 MIGRATION DES NUMÉROS WHATSAPP
// ============================================================

// 🔌 Connexion à la base de données...
// 📍 Connexion en cours...
// ✅ Connecté à MongoDB

// 📱 Récupération des vendeurs...
// ✅ 3 vendeur(s) trouvé(s)

// ============================================================

// 👤 Jean Kouassi
//    Email: jean@example.com
//    📞 Ancien: 0556939672
//    📱 Nouveau: +2250556939672
//    ✅ Mis à jour avec succès

// ============================================================
// 📊 RÉSUMÉ DE LA MIGRATION
// ============================================================
// Total de vendeurs: 3
// ✅ Mis à jour: 2
// ❌ Erreurs: 0
// ℹ️  Déjà conformes: 1
// ============================================================

// ✨ Migration terminée avec succès !

// 👋 Déconnexion de MongoDB