import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function Navbar() {
  return (
    <Card className="w-full h-16 flex flex-row items-center justify-between px-6 bg-gradient-to-r from-gray-100 to-gray-200 border-b shadow-none rounded-none">
      {/* Brand Name */}
      <p className="text-xl font-bold text-gray-800 tracking-wide">NoteNest</p>

      {/* User Image */}
      <div className="flex items-center gap-2">
        <Image
          src="/globe.svg"
          alt="User"
          width={36}
          height={36}
          className="rounded-full border border-gray-300 bg-white"
        />
      </div>
    </Card>
  );
}
