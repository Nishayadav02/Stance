"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Header() {
  const path = usePathname();

  return (
    <div className="flex p-4 items-center justify-between shadow-md">
      <Image 
        src={"/logo.png"} 
        width={160} 
        height={100} 
        alt="logo" 
        className="h-12 w-auto"
        priority 
      />

      <ul className="hidden md:flex gap-6 items-center">
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == "/dashboard" && "text-primary font-bold"}`}
        >
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == "/dashboard/questions" && "text-primary font-bold"}`}
        >
          <Link href="/dashboard/questions">Question</Link>
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == "/dashboard/tutor" && "text-primary font-bold"}`}
        >
          <Link href="/dashboard/tutor">AI Tutor</Link>
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == "/dashboard/analytics" && "text-primary font-bold"}`}
        >
          <Link href="/dashboard/analytics">Analytics</Link>
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;