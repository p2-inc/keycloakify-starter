import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            magicLinkConfirmation: "Check your email, and click on the link to log in!",
            doResend: "Resend",
            magicLinkContinuationConfirmation:
                "Check your email, and click on the link to log in! Please do not close this tab.",
            magicLinkSuccessfulLogin:
                "Authentication session confirmed. Please return to login page tab.",
            magicLinkFailLogin:
                "Authentication session expired. Please close this tab and restart the login flow.",
            loginPage: "Login page",
            multipleSessionsError:
                "Multiple login sessions opened on same browser. Please close it and restart login."
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
