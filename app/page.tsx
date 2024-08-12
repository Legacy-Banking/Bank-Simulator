
import { createClient } from "@/utils/supabase/server";
import FetchDataSteps from "@/components/FetchDataSteps";
import AuthButton from "@/components/AuthButton";
import Header from "@/components/Header";


export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Header />
      <AuthButton />
      <div className="flex flex-col gap-8 items-center">
        <FetchDataSteps />
      </div>
    </div>
  );
}
