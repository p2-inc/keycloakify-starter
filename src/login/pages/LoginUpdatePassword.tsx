import type { JSX } from "keycloakify/tools/JSX";
import { cloneElement, useState, useMemo } from "react";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const PASSWORD_REQUIREMENTS = [
  { id: "length", label: "Must be at least 8 characters long.", regex: /.{8,}/ },
  { id: "uppercase", label: "Must contain at least one uppercase letter (A-Z).", regex: /[A-Z]/ },
  { id: "lowercase", label: "Must contain at least one lowercase letter (a-z).", regex: /[a-z]/ },
  { id: "number", label: "Must contain at least one number (0-9).", regex: /[0-9]/ },
  { id: "special", label: "Must contain at least one special character.", regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ },
];

const ADDITIONAL_REQUIREMENTS = [
  "Cannot contain your first name, middle name, or last name.",
  "Must be alphanumeric.",
  "Should not contain dictionary words.",
];

export default function LoginUpdatePassword(
  props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { url, messagesPerField, isAppInitiatedAction } = kcContext;

  const { msg, msgStr } = i18n;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordValidation = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      isValid: req.regex.test(password),
    }));
  }, [password]);

  const allRequirementsMet = passwordValidation.every((req) => req.isValid);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = allRequirementsMet && passwordsMatch;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("password", "password-confirm")}
      headerNode="Set New Password"
      displayInfo={false}
    >
      <form id="kc-passwd-update-form" action={url.loginAction} method="post" className="space-y-5">
        <div>
          <Label htmlFor="password-new" className="text-sm font-medium text-gray-700">
            New Password<span className="text-red-500">*</span>
          </Label>
          <PasswordWrapper i18n={i18n} passwordInputId="password-new">
            <Input
              id="password-new"
              name="password-new"
              type="password"
              autoFocus
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={messagesPerField.existsError("password", "password-confirm")}
              className="h-11 mt-1.5 rounded-md border-gray-300 focus:border-[#0066A1] focus:ring-[#0066A1]"
              placeholder=""
            />
          </PasswordWrapper>
        </div>

        {password.length > 0 && (
          <div className="space-y-1 text-sm">
            {passwordValidation.map((req) => (
              <div
                key={req.id}
                className={`flex items-start gap-1 ${req.isValid ? "text-green-600" : "text-red-600"}`}
              >
                <span>{req.label}</span>
              </div>
            ))}
            {ADDITIONAL_REQUIREMENTS.map((req, index) => (
              <div key={index} className="flex items-start gap-1 text-gray-500">
                <span>{req}</span>
              </div>
            ))}
          </div>
        )}

        <div>
          <Label htmlFor="password-confirm" className="text-sm font-medium text-gray-700">
            Confirm Password<span className="text-red-500">*</span>
          </Label>
          <PasswordWrapper i18n={i18n} passwordInputId="password-confirm">
            <Input
              id="password-confirm"
              name="password-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={messagesPerField.existsError("password", "password-confirm")}
              className="h-11 mt-1.5 rounded-md border-gray-300 focus:border-[#0066A1] focus:ring-[#0066A1]"
              placeholder="Enter Confirm Password"
            />
          </PasswordWrapper>
        </div>

        <div className="pt-3">
          <Button
            type="submit"
            className={`w-full h-12 font-semibold rounded-md ${
              canSubmit
                ? "bg-[#0066A1] hover:bg-[#005285] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!canSubmit}
          >
            Set Password
          </Button>
        </div>

        {isAppInitiatedAction && (
          <div>
            <Button
              type="submit"
              name="cancel-aia"
              value="true"
              variant="outline"
              className="w-full h-12 border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50"
            >
              {msgStr("doCancel")}
            </Button>
          </div>
        )}
      </form>
    </Template>
  );
}

function PasswordWrapper(props: { i18n: I18n; passwordInputId: string; children: JSX.Element }) {
  const { i18n, passwordInputId, children } = props;

  const { msgStr } = i18n;
  const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

  return (
    <div className="relative">
      {cloneElement(children, {
        type: isPasswordRevealed ? "text" : "password",
        className: clsx(children.props.className, "pr-12")
      })}
      <button
        type="button"
        onClick={toggleIsPasswordRevealed}
        aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
        aria-controls={passwordInputId}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-1"
      >
        {isPasswordRevealed ? (
          <Eye className="w-5 h-5" />
        ) : (
          <EyeOff className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

