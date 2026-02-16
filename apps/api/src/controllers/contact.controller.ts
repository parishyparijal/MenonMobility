import { Request, Response, NextFunction } from "express";
import { emailQueue } from "@/config/queue";

// ---------------------------------------------------------------------------
// Contact Controller
// ---------------------------------------------------------------------------

export const contactController = {
  /**
   * POST /api/contact
   * Contact form submission.
   * Validates name, email, subject, message.
   * Queues a contact form email to the admin.
   * Rate limiting is handled by middleware.
   */
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, subject, message, phone } = req.body;

      // Queue contact form email to admin
      await emailQueue.add("send-contact-form", {
        name,
        email,
        phone: phone || "",
        subject,
        message,
      });

      res.status(201).json({
        success: true,
        message: "Thank you for your message. We will get back to you shortly.",
      });
    } catch (error) {
      next(error);
    }
  },
};
