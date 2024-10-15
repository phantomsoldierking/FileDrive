import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Header() {
    return (<div className="border-b py-4 bg-grey-50">
        <div className="container items-center mx-auto justify-between flex">
            <div className="text-2xl">
                FileDrive
            </div>
            <div className="flex gap-4">
                <OrganizationSwitcher />
                <UserButton />
                <SignedOut>
                    <SignInButton><Button>Sign In</Button></SignInButton>
                </SignedOut>
            </div>
        </div>
    </div>)
}