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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TemplateCentered(props: TemplateProps<KcContext, I18n>) {
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
    className: bodyClassName ?? "bg-[#E8EEF4]"
  });

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

  if (!isReadyToRender) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#E8EEF4]">
      <Card className="w-full max-w-[600px] shadow-lg rounded-xl bg-white">
        <CardContent className="p-10">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/Logo Header.png"
              alt="Nevada Department of Education - Online Portal for Application and Licensure (OPAL)"
              className="h-14 w-auto"
            />
          </div>

          <Separator className="mb-8" />

          <div className="mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{headerNode}</h2>
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
        </CardContent>
      </Card>
    </div>
  );
}

