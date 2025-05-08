import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-domain.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-bucket.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "demo-measurement-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Notification functions using Firebase
export interface Notification {
  id?: string;
  title: string;
  message: string;
  created_at: Date | Timestamp;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
  user_id: string;
}

export async function getNotifications(
  userId: string,
): Promise<Notification[]> {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("user_id", "==", userId),
      orderBy("created_at", "desc"),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        message: data.message,
        created_at: data.created_at.toDate(),
        read: data.read,
        type: data.type,
        user_id: data.user_id,
      };
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<boolean> {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      read: true,
    });
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
}

export async function createNotification(notification: {
  user_id: string;
  title: string;
  message: string;
  type?: "info" | "warning" | "success" | "error";
}): Promise<boolean> {
  try {
    await addDoc(collection(db, "notifications"), {
      user_id: notification.user_id,
      title: notification.title,
      message: notification.message,
      type: notification.type || "info",
      read: false,
      created_at: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error("Error creating notification:", error);
    return false;
  }
}

export { auth, googleProvider, db };
