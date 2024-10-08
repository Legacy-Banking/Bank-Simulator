import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { accountAction } from "@/lib/actions/accountAction";

export default function SignUp({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const username = formData.get("username") as string;

    // Sanitize username: Replace spaces with dots and remove invalid characters
    const sanitizedUsername = username
      .replace(/\s+/g, '.')   // Replace spaces with dots
      .replace(/[^a-zA-Z0-9._-]/g, ''); // Remove any characters not allowed in an email local part

    const email = `${sanitizedUsername}@gmail.com`;

    const password = formData.get("password") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });


    if (error) {
      return redirect(`/auth/sign-up?message=${error}`);
    }
    const user_id = data.user?.id || '';
    await accountAction.signUpInitialization(user_id, username);

    return redirect("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F6CA4D] w-full">
      <div className="flex flex-col w-full p-10 sm:max-w-md justify-center gap-2 bg-[#ffffff] rounded-2xl drop-shadow-2xl shadow-2xl shadow-stone-500">
        <div className="pb-4">
          <img src="../logo-full.png" alt="Logo" className="w-full " />
        </div>
        <div className="py-6">
          <div className="text-5xl text-[#101828] font-semibold pb-4">Sign Up</div>
          <div className="text-base text-[#475467]">Please enter your details.</div>
        </div>

        {searchParams.message && (
          <div className="text-red-500 mb-4">
            {searchParams.message}
          </div>
        )}

        <form className="flex flex-col w-full rounded-md text-[#344054]">
          <label className="text-base font-medium" htmlFor="username">Username</label>
          <input className="rounded-md px-3 py-2 mt-2 border mb-5 outline outline-1 outline-gray-400 placeholder-gray-400 text-base drop-shadow-sm " name="username" placeholder="Enter username" required />

          <label className="text-base font-medium" htmlFor="password">Password</label>
          <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline outline-1 outline-gray-400 placeholder-gray-400 text-base drop-shadow-sm " type="password" name="password" placeholder="Enter your password" required />

          <SubmitButton className="bg-[#3D87C3] text-lg rounded-md px-4 py-2 text-white mb-2 drop-shadow-lg"
            formAction={signUp}
            pendingText="Signing Up...">Sign Up</SubmitButton>
        </form>
        <div className="mt-5 text-base text-center font-normal text-[#475467]">
          Already have an account?
          <Link className="text-[#3D87C3] rounded-md px-1 font-semibold"
            href="/auth/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
