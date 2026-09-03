"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert02Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { GITHUB_EXCHANGE_URL } from "@/routes/apiRoute";
import { AuthFrame } from "./AuthFrame";

const GITHUB_INSTALL_URL =
  "https://github.com/apps/openmerge-app/installations/select_target";
const PENDING_INSTALLATION_ID_KEY = "openmerge_pending_installation_id";

export function GithubCallbackPage() {
  const searchParams = useSearchParams();
  const called = useRef(false);
  const [error, setError] = useState("");
  const code = searchParams.get("code");
  const missingCodeError = useMemo(
    () => (code ? "" : "No code received from GitHub."),
    [code]
  );

  useEffect(() => {
    if (!code || called.current) return;
    called.current = true;

    fetch(GITHUB_EXCHANGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data: { success: boolean; token?: string; error?: string }) => {
        if (data.success && data.token) {
          localStorage.setItem("pr_token", data.token);
          const pendingInstallationId = sessionStorage.getItem(PENDING_INSTALLATION_ID_KEY);
          if (pendingInstallationId) {
            sessionStorage.removeItem(PENDING_INSTALLATION_ID_KEY);
            window.location.href = `/setup?installation_id=${encodeURIComponent(pendingInstallationId)}`;
            return;
          }

          const isLocalDevelopment = ["localhost", "127.0.0.1"].includes(window.location.hostname);
          window.location.href = isLocalDevelopment ? "/dashboard" : GITHUB_INSTALL_URL;
        } else {
          setError(data.error ?? "Authentication failed.");
        }
      })
      .catch(() => setError("Could not reach server."));
  }, [code]);

  if (error || missingCodeError) {
    const message = error || missingCodeError;

    return (
      <AuthFrame>
        <div className="w-full max-w-[430px] rounded-[24px] border border-[#e4e4e0] bg-[#fbfbf9] p-7 text-center shadow-[0_18px_45px_rgba(23,23,23,0.07)] sm:p-10">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#fff0f0] text-[#c44141]"><HugeiconsIcon icon={Alert02Icon} size={24} strokeWidth={1.7} aria-hidden="true" /></div>
          <h1 className="mt-6 font-pixel text-3xl font-semibold tracking-[-0.04em]">Sign-in needs attention.</h1>
          <p className="mt-3 text-[14px] leading-6 text-[#696965]">{message}</p>
          <a href="https://github.com/apps/openmerge-app/installations/select_target" className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[#171717] px-5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5">Try again on GitHub</a>
        </div>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame>
      <div className="w-full max-w-[470px] rounded-[24px] border border-[#e4e4e0] bg-[#fbfbf9] p-7 text-center shadow-[0_18px_45px_rgba(23,23,23,0.07)] sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e8f0ff] text-[#2764d8]"><HugeiconsIcon icon={Loading03Icon} size={27} strokeWidth={1.7} className="animate-spin" aria-hidden="true" /></div>
        <h1 className="mt-6 font-pixel text-3xl font-semibold tracking-[-0.04em]">Connecting your GitHub.</h1>
        <p className="mt-3 text-[14px] leading-6 text-[#696965]">One moment while OpenMerge securely completes the handoff.</p>
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-medium text-[#7a7a75]"><span className="grid size-5 place-items-center rounded-full bg-[#e8f0ff] text-[#2764d8]">1</span><span className="h-px w-10 bg-[#dcdcd8]" /><span className="grid size-5 place-items-center rounded-full border border-[#dcdcd8] text-[#969691]">2</span></div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[#969691]">Secure sign-in</p>
      </div>
    </AuthFrame>
  );
}
