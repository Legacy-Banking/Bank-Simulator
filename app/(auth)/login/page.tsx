import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F6CA4D] w-full">
      <div className="flex flex-col w-full p-10 sm:max-w-md justify-center gap-2 bg-[#ffffff] rounded-2xl drop-shadow-2xl shadow-2xl shadow-stone-500">


        <div className="pb-4">
          <img src="logo-full.png" alt="Logo" className="w-full " />
        </div>


        <div className="py-6">
          <div className="text-4xl text-[#101828] font-semibold pb-4">Log in</div>
          <div className="text-base text-[#475467]">Welcome back! Please enter your details.</div>
        </div>

        {searchParams.message && (
          <div className="text-red-500 mb-4">
            {searchParams.message}
          </div>
        )}

        <form className="flex flex-col w-full rounded-md text-[#344054]">
          <label className="text-sm font-medium" htmlFor="email">Username</label>
          <input className="rounded-md px-3 py-2 mt-2 border mb-5 outline outline-1 outline-gray-400 placeholder-gray-400 text-base drop-shadow-sm " name="email" placeholder="Enter username" required />

          <label className="text-sm font-medium" htmlFor="password">Password</label>
          <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline outline-1 outline-gray-400 placeholder-gray-400 text-base drop-shadow-sm " type="password" name="password" placeholder="Enter your password" required />

          <SubmitButton className="bg-[#3D87C3] rounded-md px-4 py-2 text-white mb-2 drop-shadow-lg"
            formAction={signIn}
            pendingText="Signing In...">Login</SubmitButton>
        </form>
        <div className="mt-5 text-xs text-center font-normal text-[#475467]">
          Don't have an account?
          <Link className="text-[#3D87C3] rounded-md px-1 font-semibold"
            href="/sign-up">Sign Up</Link>

        </div>
      </div>
    </div>
  );
}
