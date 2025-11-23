const SUBSCRIBE_ENDPOINT = import.meta.env.VITE_GOOGLE_SHEETS_SUBSCRIBE_URL;

export class SubscriptionError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "SubscriptionError";
  }
}

export const submitSubscription = async (email: string) => {
  if (!SUBSCRIBE_ENDPOINT) {
    throw new SubscriptionError(
      "Missing VITE_GOOGLE_SHEETS_SUBSCRIBE_URL. Please set it to your Google Apps Script Web App URL.",
    );
  }

  const body = new URLSearchParams({ email });

  const response = await fetch(SUBSCRIBE_ENDPOINT, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new SubscriptionError(errorText || "Failed to subscribe", response.status);
  }

  try {
    return await response.json();
  } catch (error) {
    return { ok: true };
  }
};
