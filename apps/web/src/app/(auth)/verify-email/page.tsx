'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';

const CODE_LENGTH = 6;
const COOLDOWN_SECONDS = 60;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyEmail, resendVerificationCode, isLoading } = useAuthStore();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start cooldown on mount (code was just sent on registration)
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];

    // Handle paste of full code
    if (value.length > 1) {
      const pasted = value.slice(0, CODE_LENGTH).split('');
      for (let i = 0; i < CODE_LENGTH; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setDigits(newDigits);
      const lastIndex = Math.min(pasted.length, CODE_LENGTH) - 1;
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-advance to next input
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const code = digits.join('');
    if (code.length !== CODE_LENGTH) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    try {
      await verifyEmail(email, code);
      setSuccess('Email verified successfully! Redirecting...');
      setTimeout(() => router.push('/'), 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Verification failed. Please try again.');
      }
    }
  }

  async function handleResend() {
    setError('');
    setSuccess('');
    try {
      await resendVerificationCode(email);
      setCooldown(COOLDOWN_SECONDS);
      setSuccess('A new code has been sent to your email');
      setDigits(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to resend code. Please try again.');
      }
    }
  }

  if (!email) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground">
          No email address provided. Please register first.
        </p>
        <Link href="/register">
          <Button variant="accent" className="w-full">
            Go to Registration
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7 text-accent"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Check Your Email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit verification code to{' '}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
            {success}
          </div>
        )}

        {/* 6-digit code input */}
        <div className="flex justify-center gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={CODE_LENGTH}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
              className="w-12 h-14 text-center text-xl font-bold border-2 border-border rounded-lg focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors disabled:opacity-50"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <Button
          type="submit"
          variant="accent"
          className="w-full"
          size="lg"
          disabled={isLoading || digits.join('').length !== CODE_LENGTH}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Verifying...
            </span>
          ) : (
            'Verify Email'
          )}
        </Button>
      </form>

      <div className="space-y-3 text-center">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the code?{' '}
          {cooldown > 0 ? (
            <span className="text-muted-foreground/70">
              Resend in {cooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-accent hover:text-accent-600 font-medium transition-colors"
            >
              Resend Code
            </button>
          )}
        </p>

        <Link
          href="/"
          className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now
        </Link>
      </div>
    </div>
  );
}
