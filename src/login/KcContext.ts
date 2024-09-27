/* eslint-disable @typescript-eslint/ban-types */
import type { ExtendKcContext } from "keycloakify/login";
import type { KcEnvName, ThemeName } from "../kc.gen";

export type KcContextExtension = {
    themeName: ThemeName;
    properties: Record<KcEnvName, string> & {};
};

// added for otp form page, required for the types
export type KcContextExtensionPerPage = {
    "otp-form.ftl": {
        auth: {
            attemptedUsername: string;
        };
        url: {
            loginRestartFlowUrl: string;
            loginAction: string;
        };
    };
    "email-confirmation.ftl": {
        magicLinkContinuation: {
            sameBrowser: boolean;
            url: string;
        };
    };
    "email-confirmation-error.ftl": {};
    "view-email.ftl": {
        auth: {
            attemptedUsername: string;
        };
    };
    "view-email-continuation.ftl": {
        auth: {
            attemptedUsername: string;
        };
    };
};

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>;
