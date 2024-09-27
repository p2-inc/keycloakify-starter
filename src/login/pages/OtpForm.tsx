import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function OtpForm(props: PageProps<Extract<KcContext, { pageId: "otp-form.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { msg, msgStr } = i18n;

    const { auth, url, messagesPerField } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={true}
            headerNode={
                <div id="kc-username" className={kcClsx("kcFormGroupClass")} style={{ fontSize: "16px" }}>
                    <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                    <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                        <div className="kc-login-tooltip">
                            <i className={kcClsx("kcResetFlowIcon")}></i>
                            <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                        </div>
                    </a>
                </div>
            }
        >
            <p>Enter access code</p>
            <form id="kc-otp-login-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={kcClsx("kcLabelWrapperClass")}>
                        <label htmlFor="otp" className={kcClsx("kcLabelClass")}>
                            {msg("loginOtpOneTime")}
                        </label>
                    </div>

                    <div className={kcClsx("kcInputWrapperClass")}>
                        <input
                            id="otp"
                            name="otp"
                            autoComplete="off"
                            type="text"
                            className={kcClsx("kcInputClass")}
                            autoFocus
                            aria-invalid={messagesPerField.existsError("totp") ? "true" : undefined}
                        />
                        {messagesPerField.existsError("totp") && (
                            <span
                                id="input-error-otp-code"
                                className={kcClsx("kcInputErrorMessageClass")}
                                aria-live="polite"
                                dangerouslySetInnerHTML={{ __html: messagesPerField.get("totp") }}
                            />
                        )}
                    </div>
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")} />
                    </div>

                    <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")} style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                            className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonLargeClass")}
                            name="submit"
                            id="kc-submit"
                            type="submit"
                            value={msgStr("doSubmit")}
                        />
                        <input
                            className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonLargeClass")}
                            name="resend"
                            id="kc-resend"
                            type="submit"
                            value={msgStr("doResend")}
                        />
                    </div>
                </div>
            </form>
        </Template>
    );
}
