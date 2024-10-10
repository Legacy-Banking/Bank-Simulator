import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/store/store";
import { updateUserId } from '@/store/userSlice'


let idleTimeout: NodeJS.Timeout | null = null;
let idleTime = 3 * 60 * 1000;

// Function to handle logout
export const performLogout = async (router: ReturnType<typeof useRouter>, dispatch: AppDispatch) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    dispatch(updateUserId(''));
    if (error) {
        console.error('Error logging out:', error.message);
    } else {
        toast.error("You have been logged out due to inactivity.");
        router.push('/');
    }
};

// Function to reset the idle timer
export const resetIdleTimer = (router: ReturnType<typeof useRouter>, dispatch: AppDispatch) => {
    if (idleTimeout) {
        clearTimeout(idleTimeout);
    }

    // Log out after 3 minutes (60,000 ms) of inactivity
    idleTimeout = setTimeout(() => {
        performLogout(router, dispatch);
    }, idleTime);
};

// Function to handle tab close
export const handleTabClose = async (event: BeforeUnloadEvent, router: ReturnType<typeof useRouter>, dispatch: AppDispatch) => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry?.type === 'reload') {
        return; // Skip logout on page refresh
    }
    await performLogout(router, dispatch);
};

// Function to handle tab visibility change
export const handleVisibilityChange = () => {
    if (document.hidden) {
        // If the tab is hidden, reduce the idle timeout to 10 seconds
        idleTime = 1000; // 1 seconds
    } else {
        // If the tab is visible, reset the idle timeout to 3 minutes
        idleTime = 5 * 60 * 1000; // 5 minutes
    }
};

// Function to clean up event listeners and timeout
export const cleanupListeners = () => {
    window.removeEventListener('beforeunload', (event) => handleTabClose(event, {} as ReturnType<typeof useRouter>, {} as AppDispatch));
    window.removeEventListener('mousemove', () => resetIdleTimer({} as ReturnType<typeof useRouter>, {} as AppDispatch));
    window.removeEventListener('keydown', () => resetIdleTimer({} as ReturnType<typeof useRouter>, {} as AppDispatch));
    document.removeEventListener('visibilitychange', handleVisibilityChange);

    if (idleTimeout) {
        clearTimeout(idleTimeout);
    }
};

// Function to initialize listeners for user activity and tab close
export const initializeAuthListeners = (router: ReturnType<typeof useRouter>, dispatch: AppDispatch) => {
    // Add event listeners for tab close and user activity
    window.addEventListener('beforeunload', (event) => handleTabClose(event, router, dispatch));
    window.addEventListener('mousemove', () => resetIdleTimer(router, dispatch));
    window.addEventListener('keydown', () => resetIdleTimer(router, dispatch));
    document.addEventListener('visibilitychange', handleVisibilityChange);


    // Initialize the idle timer
    resetIdleTimer(router, dispatch);
};
