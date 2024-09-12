'use client'
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, updateUserId, updateUserName } from "../store/userSlice";
import { useAppSelector } from '@/app/store/hooks'
import BankNavbar from "@/components/BankNavbar";
import { accountAction } from "@/utils/accountAction";

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = useAppSelector(state => state.user);
    const user_id = user.user_id;
    const user_name = user.user_name;
    const dispatch = useAppDispatch();
    const [personalAccount, setPersonalAccount] = useState(null); // Store personal account

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
            if (error) {
                console.log(error);
                return redirect("/login");
            } else {
                dispatch(updateUserId(data?.user?.id));
                dispatch(updateUserName(data?.user?.email!));
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
            <BankNavbar personalAccount={personalAccount} />
            {children}
        </div>
    );
};

export default AuthenticatedLayout;
