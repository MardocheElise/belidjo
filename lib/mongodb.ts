import mongoose from "mongoose";

const mongodb_uri = process.env.MONGODB_URI as string;
const name_db = process.env.NAME_DB as string;

if (!mongodb_uri) {
    throw new Error("MONGODB_URI not set in environment variables");
}
if (!name_db) {
    throw new Error("NAME_DB not set in environment variables");
}

// Variable globale pour éviter les reconnexions multiples
let isConnected = false;

export default async function connectDB() {
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log("✅ Already connected to MongoDB");
        return mongoose.connection;
    }

    // Si une connexion est en cours, attendre
    if (mongoose.connection.readyState === 2) {
        console.log("⏳ Connection in progress, waiting...");
        return new Promise((resolve, reject) => {
            mongoose.connection.once('connected', resolve);
            mongoose.connection.once('error', reject);
        });
    }

    try {
        console.log("🔄 Attempting to connect to MongoDB...");
        console.log(`📍 Target: ${mongodb_uri.replace(/:[^:@]+@/, ':****@')}`);

        // Options de connexion compatibles avec Mongoose 6+
        const options = {
            dbName: name_db,
            
            // Timeouts
            serverSelectionTimeoutMS: 30000,  // 30 secondes
            socketTimeoutMS: 45000,           // 45 secondes
            
            // Pool de connexions
            maxPoolSize: 10,
            minPoolSize: 2,
            maxIdleTimeMS: 30000,
            
            // Buffer settings
            bufferCommands: false,
            
            // Retry logic (ces options sont gérées dans la connection string)
            retryWrites: true,
            retryReads: true,
        };
        
        // Tentative de connexion avec retry
        let connection;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
            try {
                attempts++;
                console.log(`🔄 Attempt ${attempts}/${maxAttempts}`);
                
                connection = await mongoose.connect(mongodb_uri, options);
                break; // Connexion réussie
                
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log(`❌ Attempt ${attempts} failed:`, error.message);
                
                if (attempts === maxAttempts) {
                    throw error; // Dernier essai échoué
                }
                
                // Attendre avant le prochain essai
                await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
            }
        }
        
        isConnected = true;
        console.log(`✅ Successfully connected to MongoDB: ${name_db}`);
        console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);
        
        // Gestionnaires d'événements
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
            isConnected = false;
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
            isConnected = false;
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
            isConnected = true;
        });
        
        return connection;
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        isConnected = false;
        
        // Messages d'aide selon le type d'erreur
        if (error.message.includes('ETIMEOUT') || error.message.includes('queryTxt')) {
            console.log('\n🔧 TIMEOUT Solutions:');
            console.log('1. Check your internet connection');
            console.log('2. Verify MongoDB Atlas Network Access (allow your IP)');
            console.log('3. Try connecting from a different network');
            console.log('4. Check if your ISP blocks MongoDB ports');
        }
        
        if (error.message.includes('authentication')) {
            console.log('\n🔐 AUTHENTICATION Solutions:');
            console.log('1. Verify username/password in connection string');
            console.log('2. Check Database Access permissions in MongoDB Atlas');
        }
        
        throw error;
    }
}

 