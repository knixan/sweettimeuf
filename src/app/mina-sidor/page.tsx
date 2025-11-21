import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MinaSidorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/logga-in");
  }

  const user = session.user;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mina Sidor</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Profilinformation</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Namn
              </label>
              <p className="text-lg">{user.name || "Ej angivet"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-post
              </label>
              <p className="text-lg">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-post verifierad
              </label>
              <p className="text-lg">
                {user.emailVerified ? (
                  <span className="text-green-600">✓ Verifierad</span>
                ) : (
                  <span className="text-yellow-600">Ej verifierad</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
