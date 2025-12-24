import { useEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertOctagon, AlertTriangle, CircleCheck, Info } from "lucide-react";

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    headerNode,
    infoNode = null,
    documentTitle,
    bodyClassName,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    children
  } = props;

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

  const { msgStr } = i18n;

  const { realm, message, isAppInitiatedAction } = kcContext;

  useEffect(() => {
    document.title = documentTitle ?? msgStr("loginTitle", realm.displayName);
  }, []);

  useSetClassName({
    qualifiedName: "html",
    className: kcClsx("kcHtmlClass")
  });

  useSetClassName({
    qualifiedName: "body",
    className: bodyClassName ?? "bg-white"
  });

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

  if (!isReadyToRender) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 bg-white relative z-10">
        <div className="w-full max-w-[400px] mx-auto">
          <div className="mb-10">
            <img
              src="/Logo Header.png"
              alt="Nevada Department of Education - Online Portal for Application and Licensure (OPAL)"
              className="h-16 w-auto"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{headerNode}</h2>
          </div>

          {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
            <div className="mb-6">
              <Alert variant={message.type}>
                {message.type === "success" && <CircleCheck className="h-4 w-4" />}
                {message.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                {message.type === "error" && <AlertOctagon className="h-4 w-4" />}
                {message.type === "info" && <Info className="h-4 w-4" />}
                <AlertDescription>{kcSanitize(message.summary)}</AlertDescription>
              </Alert>
            </div>
          )}

          {children}

          {displayInfo && <div className="mt-6">{infoNode}</div>}
        </div>
      </div>

      <div
        className="hidden lg:block lg:w-[60%] bg-no-repeat"
        style={{
          backgroundImage: "url('/BG.png')",
          backgroundSize: "cover",
          backgroundPosition: "left bottom"
        }}
        aria-label="State of Nevada Educator Licensure System"
      />
    </div>
  );
}
