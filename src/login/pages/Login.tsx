import type { JSX } from "keycloakify/tools/JSX";
import { cloneElement, useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItemCustom, FormMessageCustom } from "@/components/ui/form";
import { Eye, EyeOff, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

  const { msg } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("username", "password")}
      headerNode="Sign In"
      displayInfo={false}
    >
      <div id="kc-form">
        <div id="kc-form-wrapper">
          {realm.password && (
            <form
              id="kc-form-login"
              onSubmit={() => {
                setIsLoginButtonDisabled(true);
                return true;
              }}
              action={url.loginAction}
              method="post"
              className="space-y-6"
            >
              {!usernameHidden && (
                <FormItemCustom>
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                    {!realm.loginWithEmailAllowed
                      ? msg("username")
                      : !realm.registrationEmailAsUsername
                        ? msg("usernameOrEmail")
                        : msg("email")}
                  </Label>
                  <Input
                    tabIndex={2}
                    id="username"
                    name="username"
                    defaultValue={login.username ?? ""}
                    type="text"
                    autoFocus
                    autoComplete="username"
                    aria-invalid={messagesPerField.existsError("username", "password")}
                    className="h-11 mt-1.5 rounded-md border-gray-300 focus:border-[#0066A1] focus:ring-[#0066A1]"
                    placeholder=""
                  />
                  {messagesPerField.existsError("username", "password") && (
                    <FormMessageCustom id="input-error" className="text-red-600 text-sm mt-1" aria-live="polite">
                      {kcSanitize(messagesPerField.getFirstError("username", "password"))}
                    </FormMessageCustom>
                  )}
                </FormItemCustom>
              )}

              <FormItemCustom>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    {msg("password")}
                  </Label>
                  {realm.resetPasswordAllowed && (
                    <a
                      tabIndex={6}
                      href={url.loginResetCredentialsUrl}
                      className="text-sm font-medium text-[#0066A1] hover:underline"
                    >
                      {msg("doForgotPassword")}
                    </a>
                  )}
                </div>
                <PasswordWrapper i18n={i18n} passwordInputId="password">
                  <Input
                    tabIndex={3}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={messagesPerField.existsError("username", "password")}
                    className="h-11 mt-1.5 rounded-md border-gray-300 focus:border-[#0066A1] focus:ring-[#0066A1]"
                  />
                </PasswordWrapper>
                {usernameHidden && messagesPerField.existsError("username", "password") && (
                  <FormMessageCustom id="input-error" className="text-red-600 text-sm mt-1" aria-live="polite">
                    {kcSanitize(messagesPerField.getFirstError("username", "password"))}
                  </FormMessageCustom>
                )}
              </FormItemCustom>

              <div id="kc-form-buttons" className="pt-2">
                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                <Button
                  tabIndex={7}
                  disabled={isLoginButtonDisabled}
                  className="w-full h-12 bg-[#0066A1] hover:bg-[#005285] text-white font-semibold rounded-md flex items-center justify-center gap-2 text-base"
                  name="login"
                  id="kc-login"
                  type="submit"
                >
                  Log In
                  <ArrowUpRight className="w-5 h-5" />
                </Button>
              </div>
            </form>
          )}

          {realm.password && realm.registrationAllowed && !registrationDisabled && (
            <div className="mt-8">
              <Separator className="my-6" />
              <p className="text-gray-600 text-sm">
                Are you an educator or licensure applicant who needs to
                register for an account?{" "}
                <a
                  tabIndex={8}
                  href={url.registrationUrl}
                  className="text-[#0066A1] font-medium hover:underline"
                >
                  Click here
                </a>
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Separator className="my-6" />
            <a
              href="#"
              className="text-[#0066A1] font-medium hover:underline"
            >
              Raise a Complaint
            </a>
          </div>
        </div>
      </div>
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
