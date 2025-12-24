import { useState, useEffect, useRef } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LoginVerifyEmail(
  props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { url } = kcContext;

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResend = () => {
    setCountdown(30);
    setCanResend(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={true}
      headerNode="Verify Your Identity"
      displayInfo={false}
    >
      <p className="text-gray-600 text-sm mb-6">Enter Your Verification Code</p>

      <form id="kc-verify-email-form" action={url.loginAction} method="post" className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Verification Code<span className="text-red-500">*</span>
          </Label>

          <div className="flex items-center justify-center gap-2 mt-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-medium border-gray-300 rounded-md focus:border-[#0066A1] focus:ring-[#0066A1]"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <input type="hidden" name="code" value={otp.join("")} />
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={!canResend}
            className="text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Resend Code
          </Button>
          {!canResend && (
            <span className="text-sm text-[#B45309] font-medium">{formatTime(countdown)}</span>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-12 bg-[#0066A1] hover:bg-[#005285] text-white font-semibold rounded-md"
            disabled={otp.some((d) => !d)}
          >
            Verify Code
          </Button>
        </div>
      </form>
    </Template>
  );
}

