import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const privateKey = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.GOOGLE_PROJECT_ID,
      privateKey,
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    }),
  });
}

export { admin };
