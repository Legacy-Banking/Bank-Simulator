'use client'
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { updateUserId } from "@/app/store/userSlice";
import RootNavbar from "@/components/RootNavbar";
import SpecialNavbar from "@/components/SpecialNavbar";
import { useRouter } from "next/navigation";
import { initializeAuthListeners, cleanupListeners } from "@/utils/hooks/useSignoutOnUnload";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppSelector((state) => state.user);
  const user_id = user.user_id;
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Function to update the user's state if not already set
  const updateUserState = async () => {
    if (!user_id) {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        // If there's no user, redirect or set to non-authenticated state
        return;
      } else {
        dispatch(updateUserId(data.user.id));
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      await updateUserState();
    };
    fetchUserData();

    // Initialize auth-related listeners (idle detection, tab close)
    initializeAuthListeners(router, dispatch);

    // Cleanup listeners and idle timer on component unmount
    return () => {
        cleanupListeners();
    };

  }, [user_id]);

  return (
    <div>
      
        {user_id ? <SpecialNavbar /> : <RootNavbar />}
        
        <main>
          {children}
        </main>

    </div>
  );
};

export default AppLayout;
