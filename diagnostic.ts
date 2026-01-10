// /* eslint-disable @typescript-eslint/no-require-imports */
// // diagnostic.js - Créez ce fichier à la racine et exécutez: node diagnostic.js
// const { exec } = require('child_process');
// const dns = require('dns');
// const net = require('net');
// require('dotenv').config({ path: '.env' });

// console.log('🔍 DIAGNOSTIC MONGODB ATLAS\n');

// // 1. Vérifier les variables d'environnement
// console.log('1️⃣ VARIABLES D\'ENVIRONNEMENT:');
// const uri = process.env.MONGODB_URI;
// const dbName = process.env.NAME_DB;

// if (!uri) {
//     console.log('❌ MONGODB_URI non trouvée');
    
// } else {
//     console.log('✅ MONGODB_URI trouvée');
//     console.log(`   URI: ${uri.replace(/:[^:@]+@/, ':****@')}`);
// }

// if (!dbName) {
//     console.log('❌ NAME_DB non trouvée');
// } else {
//     console.log(`✅ NAME_DB: ${dbName}`);
// }

// console.log('\n2️⃣ TEST DE RÉSOLUTION DNS:');

// // 2. Test de résolution DNS
// dns.lookup('cluster0.9sesf74.mongodb.net', (err: { message: unknown; }, address: unknown, family: unknown) => {
//     if (err) {
//         console.log('❌ Échec de résolution DNS:', err.message);
//         console.log('💡 Solutions:');
//         console.log('   - Changez vos DNS vers 8.8.8.8 et 8.8.4.4');
//         console.log('   - Vérifiez votre connexion Internet');
//         console.log('   - Essayez avec un autre réseau (hotspot mobile)');
//     } else {
//         console.log(`✅ DNS résolu: ${address} (IPv${family})`);
//     }
// });

// console.log('\n3️⃣ TEST DE CONNECTIVITÉ RÉSEAU:');

// // 3. Test de connectivité sur le port MongoDB
// const socket = new net.Socket();
// const timeout = 10000;

// socket.setTimeout(timeout);

// socket.on('connect', () => {
//     console.log('✅ Connexion TCP réussie sur le port 27017');
//     socket.destroy();
// });

// socket.on('timeout', () => {
//     console.log('❌ Timeout de connexion TCP (10s)');
//     console.log('💡 Votre FAI ou pare-feu bloque peut-être MongoDB');
//     socket.destroy();
// });

// socket.on('error', (err: { message: unknown; code: string; }) => {
//     console.log('❌ Erreur de connexion TCP:', err.message);
//     if (err.code === 'ENOTFOUND') {
//         console.log('💡 Problème de DNS - essayez de changer vos serveurs DNS');
//     } else if (err.code === 'ECONNREFUSED') {
//         console.log('💡 Connexion refusée - vérifiez Network Access dans MongoDB Atlas');
//     } else if (err.code === 'ETIMEDOUT') {
//         console.log('💡 Timeout - votre réseau ou FAI bloque probablement MongoDB');
//     }
// });

// try {
//     socket.connect(27017, 'cluster0.9sesf74.mongodb.net');
// } catch (err) {
//     console.log('❌ Impossible d\'initier la connexion:', err.message);
// }

// console.log('\n4️⃣ TEST AVEC MONGOOSE:');

// // 4. Test avec Mongoose
// const mongoose = require('mongoose');

// async function testMongoose() {
//     try {
//         console.log('⏳ Test de connexion Mongoose...');
        
//         await mongoose.connect(uri, {
//             dbName: dbName,
//             serverSelectionTimeoutMS: 30000,
//             family: 4,
//             retryWrites: true
//         });
        
//         console.log('✅ Connexion Mongoose réussie !');
        
//         // Test ping
//         const admin = mongoose.connection.db.admin();
//         const result = await admin.ping();
//         console.log('✅ Ping MongoDB réussi:', result);
        
//         await mongoose.disconnect();
//         console.log('✅ Déconnexion propre');
        
//     } catch (error) {
//         console.log('❌ Erreur Mongoose:', error.message);
        
//         if (error.message.includes('ETIMEOUT') || error.message.includes('queryTxt')) {
//             console.log('\n🚨 ERREUR DE TIMEOUT DÉTECTÉE');
//             console.log('📋 LISTE DE VÉRIFICATION:');
//             console.log('□ MongoDB Atlas Network Access configuré ?');
//             console.log('□ Cluster MongoDB Atlas actif (pas en pause) ?');
//             console.log('□ Connexion Internet stable ?');
//             console.log('□ DNS configurés (essayer 8.8.8.8) ?');
//             console.log('□ Essayé avec un autre réseau ?');
//             console.log('□ Pare-feu/antivirus désactivé temporairement ?');
//         }
//     }
// }

// setTimeout(testMongoose, 2000);