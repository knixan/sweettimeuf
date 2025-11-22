"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type CookieConsentProps = {
  variant?: "small" | "large";
  onAcceptCallback?: () => void;
  onDeclineCallback?: () => void;
};

export default function CookieConsent({
  variant = "small",
  onAcceptCallback,
  onDeclineCallback,
}: CookieConsentProps) {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 w-[min(90%,48rem)] -translate-x-1/2 rounded-lg border bg-card p-4 shadow-lg ${
        variant === "small" ? "text-sm" : "text-base"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="font-medium">Cookies</h4>
          <p className="text-muted-foreground">Vi använder kakor för att förbättra upplevelsen.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onDeclineCallback?.();
              setVisible(false);
            }}
          >
            Nej tack
          </Button>

          <Button
            size="sm"
            onClick={() => {
              onAcceptCallback?.();
              setVisible(false);
            }}
          >
            Acceptera
          </Button>
        </div>
      </div>
    </div>
  );
}
