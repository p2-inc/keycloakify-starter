import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LoginResetPassword(
  props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { url, realm, auth } = kcContext;

  const { msg } = i18n;

  const [recoveryMethod, setRecoveryMethod] = useState<"email" | "phone">("email");

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={true}
      headerNode="Find Your Account"
      displayInfo={false}
    >
      <p className="text-gray-600 text-sm mb-6">
        Choose how you'd like to receive your one-time verification code.
      </p>

      <form id="kc-reset-password-form" action={url.loginAction} method="post" className="space-y-6">
        <RadioGroup
          defaultValue="email"
          value={recoveryMethod}
          onValueChange={(value) => setRecoveryMethod(value as "email" | "phone")}
          className="space-y-3"
        >
          <div
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              recoveryMethod === "email"
                ? "border-[#0066A1] bg-[#F0F7FC]"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setRecoveryMethod("email")}
          >
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email" className="text-base font-medium text-gray-900 cursor-pointer">
              Email
            </Label>
          </div>

          <div
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              recoveryMethod === "phone"
                ? "border-[#0066A1] bg-[#F0F7FC]"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setRecoveryMethod("phone")}
          >
            <RadioGroupItem value="phone" id="phone" />
            <Label htmlFor="phone" className="text-base font-medium text-gray-900 cursor-pointer">
              Phone Number
            </Label>
          </div>
        </RadioGroup>

        <input type="hidden" name="recoveryMethod" value={recoveryMethod} />

        <input
          type="hidden"
          id="username"
          name="username"
          autoComplete="username"
          defaultValue={auth.attemptedUsername ?? ""}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 border-[#0066A1] text-[#0066A1] font-semibold rounded-md hover:bg-[#F0F7FC]"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.history.back();
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 h-12 bg-[#0066A1] hover:bg-[#005285] text-white font-semibold rounded-md"
          >
            Continue
          </Button>
        </div>
      </form>
    </Template>
  );
}

