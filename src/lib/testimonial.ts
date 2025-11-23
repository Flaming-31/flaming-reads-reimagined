const TESTIMONIAL_ENDPOINT = import.meta.env.VITE_GOOGLE_SHEETS_TESTIMONIAL_URL;

export interface TestimonialPayload {
  name: string;
  rating: number;
  message: string;
}

export class TestimonialError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "TestimonialError";
  }
}

export const submitTestimonial = async (payload: TestimonialPayload) => {
  if (!TESTIMONIAL_ENDPOINT) {
    throw new TestimonialError(
      "Missing VITE_GOOGLE_SHEETS_TESTIMONIAL_URL. Please set it to your testimonial proxy endpoint.",
    );
  }

  const body = new URLSearchParams({
    name: payload.name,
    rating: String(payload.rating),
    message: payload.message,
  });

  const response = await fetch(TESTIMONIAL_ENDPOINT, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new TestimonialError(errorText || "Failed to submit testimonial", response.status);
  }

  try {
    return await response.json();
  } catch (error) {
    return { ok: true };
  }
};
