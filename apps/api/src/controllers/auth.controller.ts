import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";
import { authService } from "../services/auth.service";
import { AppError } from "../middleware/errorHandler";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new AppError(409, "Email already registered");
      }

      const passwordHash = await authService.hashPassword(password);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          locale: true,
          createdAt: true,
        },
      });

      // Create seller profile if seller
      if (role === "SELLER") {
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        await prisma.sellerProfile.create({
          data: {
            userId: user.id,
            companyName: name,
            slug: `${slug}-${user.id.slice(0, 8)}`,
          },
        });
      }

      const tokens = authService.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.status(201).json({
        success: true,
        data: { user, ...tokens },
        message: "Account created successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: { sellerProfile: true },
      });

      if (!user || user.deletedAt) {
        throw new AppError(401, "Invalid email or password");
      }

      if (!user.isActive) {
        throw new AppError(403, "Account is suspended");
      }

      const valid = await authService.comparePassword(
        password,
        user.passwordHash
      );
      if (!valid) {
        throw new AppError(401, "Invalid email or password");
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      const tokens = authService.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      const { passwordHash: _, ...userData } = user;

      res.json({
        success: true,
        data: { user: userData, ...tokens },
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await prisma.refreshToken.deleteMany({
          where: { token: refreshToken },
        });
      }

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      // Verify the refresh token
      const payload = authService.verifyRefreshToken(refreshToken);

      // Check if token exists in DB
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new AppError(401, "Invalid or expired refresh token");
      }

      // Delete old token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      // Generate new token pair
      const tokens = authService.generateTokenPair({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      });

      // Store new refresh token
      await prisma.refreshToken.create({
        data: {
          userId: payload.userId,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          whatsapp: true,
          avatarUrl: true,
          locale: true,
          isActive: true,
          emailVerifiedAt: true,
          lastLoginAt: true,
          createdAt: true,
          sellerProfile: true,
        },
      });

      if (!user) {
        throw new AppError(404, "User not found");
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone, whatsapp, locale } = req.body;

      const user = await prisma.user.update({
        where: { id: req.user!.userId },
        data: {
          ...(name !== undefined && { name }),
          ...(phone !== undefined && { phone }),
          ...(whatsapp !== undefined && { whatsapp }),
          ...(locale !== undefined && { locale }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          whatsapp: true,
          avatarUrl: true,
          locale: true,
          createdAt: true,
          sellerProfile: true,
        },
      });

      res.json({
        success: true,
        data: user,
        message: "Profile updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });

      // Always return success (don't reveal if email exists)
      if (user) {
        const token = authService.generateResetToken();

        // Delete any existing reset tokens for this email
        await prisma.passwordResetToken.deleteMany({ where: { email } });

        await prisma.passwordResetToken.create({
          data: {
            email,
            token,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          },
        });

        // TODO: Send email with reset link
        // await emailService.sendPasswordReset(email, token);
      }

      res.json({
        success: true,
        message: "If the email exists, a reset link has been sent",
      });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, email, password } = req.body;

      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
      });

      if (
        !resetToken ||
        resetToken.email !== email ||
        resetToken.expiresAt < new Date()
      ) {
        throw new AppError(400, "Invalid or expired reset token");
      }

      const passwordHash = await authService.hashPassword(password);

      await prisma.user.update({
        where: { email },
        data: { passwordHash },
      });

      // Delete the used token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      // Revoke all refresh tokens for this user
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await prisma.refreshToken.deleteMany({
          where: { userId: user.id },
        });
      }

      res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
      });

      if (!user) {
        throw new AppError(404, "User not found");
      }

      const valid = await authService.comparePassword(
        currentPassword,
        user.passwordHash
      );
      if (!valid) {
        throw new AppError(400, "Current password is incorrect");
      }

      const passwordHash = await authService.hashPassword(newPassword);

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
