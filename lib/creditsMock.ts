export async function getCredits(userId: string): Promise<number> {
  // Placeholder: always return 10 credits for now
  void userId;
  return 10;
}

export async function consumeCredits(userId: string, amount: number): Promise<void> {
  // Placeholder: just log for now
  // eslint-disable-next-line no-console
  console.log(`[credits] consume ${amount} for user ${userId}`);
}

export function buyCredits(): void {
  if (typeof window !== "undefined") {
    window.open("/wix-payment", "_blank", "noopener,noreferrer");
  }
}
