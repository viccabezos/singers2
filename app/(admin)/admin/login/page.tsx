import { redirect } from "next/navigation";
import { loginAction } from "./actions";
import { isAuthenticated } from "@/shared/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    redirect("/admin/dashboard");
  }

  const errorMessage =
    searchParams.error === "invalid_password"
      ? "Invalid password. Please try again."
      : searchParams.error === "password_required"
        ? "Password is required."
        : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Back Office Login
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Enter your password to access the admin panel
          </p>
        </div>
        {errorMessage && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
            {errorMessage}
          </div>
        )}
        <form action={loginAction} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

