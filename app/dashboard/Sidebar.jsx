import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { resetStateAuth } from "../store/slices/authSlice";
import { resetStateAdmin } from "../store/slices/adminSlice";
import { resetStateNotes } from "../store/slices/notesSlice";

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(resetStateAuth());
    dispatch(resetStateAdmin());
    dispatch(resetStateNotes());
    router.push("/login");
  };
  return (
    <aside className="h-full w-64 bg-gradient-to-b from-gray-100 to-gray-200 border-r flex flex-col p-4">
      <Card className="flex flex-col gap-1 py-4 px-2 shadow-none bg-transparent border-none">
        <Link
          href="/dashboard"
          className="block px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-800 font-medium transition"
        >
          Home
        </Link>
        {user && user.role === "admin" && (
          <Link
            href="/dashboard/manage-user"
            className="block px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-800 font-medium transition"
          >
            ManageUser
          </Link>
        )}

        <Link
          href="/dashboard/setting"
          className="block px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-800 font-medium transition"
        >
          Setting
        </Link>
      </Card>
      <div className="flex-1" />
      <Button
        variant="destructive"
        className="w-full mt-2"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </aside>
  );
}
