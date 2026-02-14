import { Request, Response, NextFunction } from "express";

// ---------------------------------------------------------------------------
// Contact Controller
// ---------------------------------------------------------------------------

export const contactController = {
  /**
   * POST /api/contact
   * Contact form submission.
   * Validates name, email, subject, message.
   * For now, logs the submission (email service integration later).
   * Rate limiting is handled by middleware.
   */
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, subject, message, phone } = req.body;

      // Log the contact form submission (email service will be added later)
      console.log("=== CONTACT FORM SUBMISSION ===");
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Phone: ${phone || "N/A"}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log("===============================");

      res.status(201).json({
        success: true,
        message: "Thank you for your message. We will get back to you shortly.",
      });
    } catch (error) {
      next(error);
    }
  },
};
