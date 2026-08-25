"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/components/uploadthing";
import { updateCompanySettings } from "./actions";
import { toast } from "sonner";

type Settings = {
  companyName: string;
  orgNumber: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  swishNumber: string | null;
  bankgiroNumber: string | null;
  logoUrl: string | null;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    companyName: settings.companyName,
    orgNumber: settings.orgNumber ?? "",
    address: settings.address ?? "",
    postalCode: settings.postalCode ?? "",
    city: settings.city ?? "",
    swishNumber: settings.swishNumber ?? "",
    bankgiroNumber: settings.bankgiroNumber ?? "",
    logoUrl: settings.logoUrl ?? "",
  });

  const set =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateCompanySettings(form);
        toast.success("Inställningar sparade");
      } catch {
        toast.error("Kunde inte spara inställningar");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="mb-2">Logga</Label>
        <div className="flex items-center gap-4">
          {form.logoUrl && (
            <div className="relative w-16 h-16 shrink-0 bg-white rounded border">
              <Image
                src={form.logoUrl}
                alt="Logga"
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </div>
          )}
          <UploadButton
            endpoint="companyLogoUploader"
            content={{ button: "Ladda upp logga" }}
            onClientUploadComplete={(res) => {
              const file = res[0];
              if (file) {
                setForm((prev) => ({ ...prev, logoUrl: file.ufsUrl }));
                toast.success("Loggan laddades upp");
              }
            }}
            onUploadError={(error) => {
              toast.error(`Uppladdning misslyckades: ${error.message}`);
            }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="companyName" className="mb-2">
          Företagsnamn
        </Label>
        <Input
          id="companyName"
          value={form.companyName}
          onChange={set("companyName")}
          required
        />
      </div>

      <div>
        <Label htmlFor="orgNumber" className="mb-2">
          Organisationsnummer
        </Label>
        <Input
          id="orgNumber"
          value={form.orgNumber}
          onChange={set("orgNumber")}
        />
      </div>

      <div>
        <Label htmlFor="address" className="mb-2">
          Adress
        </Label>
        <Input id="address" value={form.address} onChange={set("address")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postalCode" className="mb-2">
            Postnummer
          </Label>
          <Input
            id="postalCode"
            value={form.postalCode}
            onChange={set("postalCode")}
          />
        </div>
        <div>
          <Label htmlFor="city" className="mb-2">
            Ort
          </Label>
          <Input id="city" value={form.city} onChange={set("city")} />
        </div>
      </div>

      <div>
        <Label htmlFor="swishNumber" className="mb-2">
          Swish-nummer
        </Label>
        <Input
          id="swishNumber"
          value={form.swishNumber}
          onChange={set("swishNumber")}
        />
      </div>

      <div>
        <Label htmlFor="bankgiroNumber" className="mb-2">
          Bankgironummer
        </Label>
        <Input
          id="bankgiroNumber"
          value={form.bankgiroNumber}
          onChange={set("bankgiroNumber")}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Sparar..." : "Spara"}
      </Button>
    </form>
  );
}
