import Link from "next/link";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";

export default async function Header() {
  const session = await auth();

  const signInUrl = `/api/auth/signin?callbackUrl=${encodeURIComponent("/")}`;
  const signOutUrl = `/api/auth/signout?callbackUrl=${encodeURIComponent("/")}`;
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            HealthCare
          </Link>
          {!session ? (
            <Button variant="outline" asChild>
              <Link href={signInUrl}>Sign In</Link>
            </Button>
          ) : (
            <>
              <nav className="space-x-6">
                <Link href="/patient">Patients</Link>
                <Link href="/report">Patient Reports</Link>
              </nav>

              <Button variant="outline" asChild>
                <Link href={signOutUrl}>Sign Out</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
