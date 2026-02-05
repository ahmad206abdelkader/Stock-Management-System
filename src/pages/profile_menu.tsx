import { UserProfile } from "@clerk/clerk-react";


export default function ProfileMenu() {
  return (
    <>
      <div className="flex justify-center items-center py-10">
      
      <UserProfile routing="hash" />
    </div>
    </>
  );
}
