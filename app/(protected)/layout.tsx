'use client'
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, updateUserId } from "../store/userSlice";
import { useAppSelector } from '@/app/store/hooks'
import UserState from "@/components/dev/UserState";

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = useAppSelector(state => state.user);
    const user_id = user.user_id;
    const dispatch = useAppDispatch();

    const userStateUpdate = async () => {
        if (!user_id) {
            const supabase = createClient();
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.log(error);
                return redirect("/login");
            }
            else {
                dispatch(updateUserId(data?.user?.id));
            }
        }
    }
    useEffect(() => {
        const fetchUserData = async () => {
            await userStateUpdate();
        };
        fetchUserData();
    }, []);

    return (
        <div>
            <UserState />
            {children}
        </div>
    );
};

export default AuthenticatedLayout;