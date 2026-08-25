import { requireAdmin } from "@/lib/server-auth";
import { getCompanySettings } from "./actions";
import { SettingsForm } from "./settings-form";

export default async function InstallningarPage() {
  await requireAdmin();
  const settings = await getCompanySettings();

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Inställningar</h1>
        <p className="text-muted-foreground mb-6">
          Företagsuppgifter som visas på genererade fakturor.
        </p>
        <SettingsForm settings={settings} />
      </div>
    </main>
  );
}
