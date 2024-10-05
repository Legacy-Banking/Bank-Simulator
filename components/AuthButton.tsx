'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { updateUserId } from "@/store/userSlice";
import { useRouter } from "next/navigation";
type User = {
  email: string
  id: string
}

const AuthButton: React.FC = () => {
  const [user, setUser] = useState<Partial<User>>({});
  const supabase = createClient();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
          throw new Error("Failed to fetch user");
        }
        setUser(data.user);
        dispatch(updateUserId(data.user.id || ""));
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUser();
  }, [dispatch, supabase]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(updateUserId(""));
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <button
        onClick={signOut}
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Logout
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
};

export default AuthButton;
