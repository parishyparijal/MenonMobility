import { authService } from "../services/auth.service";

describe("authService", () => {
  const testPayload = {
    userId: "user-123",
    email: "test@example.com",
    role: "BUYER",
  };

  describe("hashPassword / comparePassword", () => {
    it("should hash a password and verify it", async () => {
      const hash = await authService.hashPassword("MySecretPass1!");
      expect(hash).not.toBe("MySecretPass1!");
      expect(hash.length).toBeGreaterThan(20);

      const isValid = await authService.comparePassword("MySecretPass1!", hash);
      expect(isValid).toBe(true);
    });

    it("should reject wrong password", async () => {
      const hash = await authService.hashPassword("CorrectPassword");
      const isValid = await authService.comparePassword("WrongPassword", hash);
      expect(isValid).toBe(false);
    });
  });

  describe("generateAccessToken / verifyAccessToken", () => {
    it("should generate a valid access token", () => {
      const token = authService.generateAccessToken(testPayload);
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);

      const decoded = authService.verifyAccessToken(token);
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
    });

    it("should throw on invalid token", () => {
      expect(() => authService.verifyAccessToken("invalid-token")).toThrow();
    });
  });

  describe("generateRefreshToken / verifyRefreshToken", () => {
    it("should generate a valid refresh token", () => {
      const token = authService.generateRefreshToken(testPayload);
      expect(typeof token).toBe("string");

      const decoded = authService.verifyRefreshToken(token);
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
    });
  });

  describe("generateTokenPair", () => {
    it("should return both access and refresh tokens", () => {
      const pair = authService.generateTokenPair(testPayload);
      expect(pair).toHaveProperty("accessToken");
      expect(pair).toHaveProperty("refreshToken");
      expect(typeof pair.accessToken).toBe("string");
      expect(typeof pair.refreshToken).toBe("string");

      // Verify both tokens are valid
      const accessDecoded = authService.verifyAccessToken(pair.accessToken);
      const refreshDecoded = authService.verifyRefreshToken(pair.refreshToken);
      expect(accessDecoded.userId).toBe(testPayload.userId);
      expect(refreshDecoded.userId).toBe(testPayload.userId);
    });
  });

  describe("generateResetToken", () => {
    it("should return a UUID string", () => {
      const token = authService.generateResetToken();
      expect(typeof token).toBe("string");
      expect(token).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });

    it("should generate unique tokens", () => {
      const token1 = authService.generateResetToken();
      const token2 = authService.generateResetToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe("generateVerificationCode", () => {
    it("should return a 6-digit string", () => {
      const code = authService.generateVerificationCode();
      expect(code).toMatch(/^\d{6}$/);
    });

    it("should generate codes in valid range", () => {
      for (let i = 0; i < 50; i++) {
        const code = authService.generateVerificationCode();
        const num = parseInt(code, 10);
        expect(num).toBeGreaterThanOrEqual(100000);
        expect(num).toBeLessThan(1000000);
      }
    });
  });
});
