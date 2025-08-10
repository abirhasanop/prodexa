import React from "react";
import { auth } from "../firebase/firebaseConfig";

export default function Home() {
  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Protexa</h1>
      <p className="text-lg mb-6">You are now signed in with Google.</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
}
