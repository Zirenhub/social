import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-500 w-full">
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Head>

      <div className="w-full max-w-md px-6 py-12 text-center">
        <h1 className="text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
          404
        </h1>

        <p className="text-xl text-white mb-8">The page you're looking for doesn't exist.</p>

        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>

      <div className="absolute bottom-6 w-full flex justify-center">
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-cyan-500 via-magenta-500 to-purple-500"></div>
      </div>
    </div>
  );
}
