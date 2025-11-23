const CONTACT_ENDPOINT = import.meta.env.VITE_GOOGLE_SHEETS_CONTACT_URL;

export interface ContactFormPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export class ContactFormError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ContactFormError";
  }
}

export const submitContactForm = async (payload: ContactFormPayload) => {
  if (!CONTACT_ENDPOINT) {
    throw new ContactFormError(
      "Missing VITE_GOOGLE_SHEETS_CONTACT_URL. Please point it to your contact form proxy endpoint.",
    );
  }

  const body = new URLSearchParams({
    name: payload.name,
    email: payload.email,
    subject: payload.subject ?? "",
    message: payload.message,
  });

  const response = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ContactFormError(errorText || "Failed to send message", response.status);
  }

  try {
    return await response.json();
  } catch (error) {
    return { ok: true };
  }
};
