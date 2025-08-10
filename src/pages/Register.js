import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";

export default function Register() {
  const handleGoogleRegister = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Registration successful!");
    } catch (error) {
      console.error("Google registration error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          Register
        </h1>
        <button
          onClick={handleGoogleRegister}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Sign up with Google
        </button>
      </div>
    </div>
  );
}
