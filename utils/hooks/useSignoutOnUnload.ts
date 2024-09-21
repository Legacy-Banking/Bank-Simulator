import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { updateUserId } from "@/app/store/userSlice";
import { useAppDispatch } from "@/app/store/hooks";

// Utility function to handle sign-out on beforeunload event
export function useSignOutOnUnload() {
  const supabase = createClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      dispatch(updateUserId(''));

      console.log('beforeunload event triggered!'); // Log event trigger

      try {
        console.log('Signing out before unload...');
        await supabase.auth.signOut();
        console.log('Successfully signed out.');
      } catch (error) {
        console.error('Error signing out before unload:', error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [supabase]);
}
