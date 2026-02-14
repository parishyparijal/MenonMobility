import { z } from "zod";

// ---------------------------------------------------------------------------
// Contact Form Validator Schema
// ---------------------------------------------------------------------------

/**
 * POST /api/contact
 * Body for contact form submission.
 */
export const contactFormBodySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must be at most 200 characters")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be at most 5000 characters")
    .trim(),
  phone: z.string().max(20).optional(),
});

export type ContactFormBody = z.infer<typeof contactFormBodySchema>;
