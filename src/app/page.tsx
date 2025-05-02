import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome to Vector Demo</h1>
      </div>
    </HydrateClient>
  );
}
