'use client';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppDispatch, updateUserId, updateUserName } from "../store/userSlice";
import { useAppSelector } from '@/app/store/hooks';
import BankNavbar from "@/components/BankNavbar";
import { accountAction } from "@/utils/accountAction";
import { Toaster } from "react-hot-toast";
import { useSignOutOnUnload } from "@/utils/hooks/useSignoutOnUnload";

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = useAppSelector(state => state.user);
    const user_id = user.user_id;
    const dispatch = useAppDispatch();
    const [personalAccount, setPersonalAccount] = useState(null); // Store personal account
    const router = useRouter(); // useRouter for client-side redirect

    // Call the hook to handle sign-out on unload
    useSignOutOnUnload();

    // Fetch the personal account using the utility function
    const fetchUserPersonalAccount = async () => {
        try {
            const personalAccountData = await accountAction.fetchPersonalAccountByUserId(user_id);
            setPersonalAccount(personalAccountData);
        } catch (error) {
            console.error('Error fetching personal account:', error);
        }
    };

    const userStateUpdate = async () => {
        if (!user_id) {
            const supabase = createClient();
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
                console.log(error);
                toast.error("Not logged in, redirecting..."); // Show toast notification
                router.push('/')
            } else {
                dispatch(updateUserId(data.user.id));
                dispatch(updateUserName(data.user.email!));
            }
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            await userStateUpdate();
            if (user_id) {
                await fetchUserPersonalAccount(); // Fetch personal account after user ID is set
            }
        };
        fetchUserData();
    }, [user_id]); // Watch for changes in user_id

    return (
        <div>
            <Toaster />
            <BankNavbar personalAccount={personalAccount} />
            <main>
                {children}
            </main>
        </div>
    );
};

export default AuthenticatedLayout;
