# Vector Demo

## Pre-requisites
- PostgreSQL database
- Node.js (v20 or later)
- nvm (Node Version Manager)
- Docker (optional, for containerization)

## Getting Started

create a `.env` use the `.env.example` as a template and fill in the required values.

To get started with this project, you can run the following commands:
```bash
nvm use
npm install
npm run db:reseed 
npm run dev
```
## Sign In
You can sign in using the following credentials:
User: `demo`
Password: `demo`

## Adding UI components
This project uses [shadcn/ui](https://ui.shadcn.com) for UI components.
Don't modify src/components directly. Instead, use the `shadcn` CLI to add new components.
```bash
npx shadcn add <component-name>
```

## Building the Docker image
To build the Docker image, run the following command:

```bash
docker build -t vector-demo .
```

## Running the Docker container
To run the Docker container, use the following command:

```bash
docker run --env-file docker.env -p 3000:3000 vector-demo
```

## Tech Stack
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Shadcn](https://ui.shadcn.com)

## Design Considerations
- This project leverages the latest version of NextJs app router. 
- tRpc is used for type-safe API calls between the client and server.
- The UI is built using Next.js with Tailwind CSS for styling and shadcn/ui for components.
- The database is managed using Prisma, which provides a type-safe ORM for PostgreSQL.
- Authentication is handled using NextAuth.js, which supports various providers and session management.


## Suggested Future Enhancements
- The when logged out the UI should redirect to the login page
- Build a test framework for the db so that it doesn't have to be mocked in the tests
- Build a docker compose for development that will spin up the db and the app
- Add error handling to the db calls
- Clean up the UI
