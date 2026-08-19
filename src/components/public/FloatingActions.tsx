import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { CallButton } from "@/components/public/CallButton";

/**
 * Global floating action stack, rendered once in the public layout.
 * Positioned above the mobile safe area so it doesn't collide with
 * device home-indicators/notches.
 */
export function FloatingActions() {
  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex flex-col gap-3"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <CallButton />
      <WhatsAppButton message="Hi! I'd like to know more about your transport services." />
    </div>
  );
}