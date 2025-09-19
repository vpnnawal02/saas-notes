"use client";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { loadUserFromToken } from "./store/slices/authSlice";
import { useDispatch } from "react-redux";
import Loader from "./utils/Loader";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await dispatch(loadUserFromToken()).unwrap();
        if (res && res.success) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push('/login');

      }

    };
    checkUser()
  }, [dispatch, router]);
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-muted">
      {loading && <Loader />}
    </div>
  );
}


