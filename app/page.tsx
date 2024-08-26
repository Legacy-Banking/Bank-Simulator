import FetchDataSteps from "@/components/FetchDataSteps";
import AuthButton from "@/components/AuthButton";
import Header from "@/components/Header";
import UserState from "@/components/dev/UserState";


export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Header />
      <AuthButton />
      <UserState />
      <div className="flex flex-col gap-8 items-center">
        <FetchDataSteps />
      </div>
    </div>
  );
}
