"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert02Icon, CheckmarkCircle02Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { INSTALLATIONS_CALLBACK_URL } from "@/routes/apiRoute";
import { AuthFrame } from "@/components/auth/AuthFrame";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const PENDING_INSTALLATION_ID_KEY = "openmerge_pending_installation_id";

type State = "loading" | "success" | "error" | "no_id";

export function SetupCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const called = useRef(false);
  const [state, setState] = useState<State>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const installationId = searchParams.get("installation_id");
  const hasInstallationId = useMemo(() => Boolean(installationId), [installationId]);

  useEffect(() => {
    if (!installationId) {
      return;
    }

    if (called.current) return;
    called.current = true;

    const token = localStorage.getItem("pr_token");
    if (!token) {
      sessionStorage.setItem(PENDING_INSTALLATION_ID_KEY, installationId);
      window.location.href = `${API_BASE}/api/v1/auth/github`;
      return;
    }

    fetch(INSTALLATIONS_CALLBACK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ installationId }),
    })
      .then((res) => res.json())
      .then((data: { success: boolean; error?: string }) => {
        if (data.success) {
          setState("success");
          setTimeout(() => router.push("/dashboard"), 2500);
        } else {
          setState("error");
          setErrorMsg(data.error ?? "Installation failed.");
        }
      })
      .catch(() => {
        setState("error");
        setErrorMsg("Could not reach server.");
      });
  }, [installationId, router]);

  const viewState = hasInstallationId ? state : "no_id";

  return (
    <AuthFrame>
      <div className="w-full max-w-[470px] rounded-[24px] border border-[#e4e4e0] bg-[#fbfbf9] p-7 text-center shadow-[0_18px_45px_rgba(23,23,23,0.07)] sm:p-10">
        {viewState === "loading" && (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#fff1df] text-[#e57620]"><HugeiconsIcon icon={Loading03Icon} size={27} strokeWidth={1.7} className="animate-spin" aria-hidden="true" /></div>
            <h1 className="mt-6 font-pixel text-3xl font-semibold tracking-[-0.04em]">Activating OpenMerge.</h1>
            <p className="mt-3 text-[14px] leading-6 text-[#696965]">Connecting your selected repositories to the review pipeline.</p>
          </>
        )}

        {viewState === "success" && (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e8f7ed] text-[#198b4d]"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={27} strokeWidth={1.7} aria-hidden="true" /></div>
            <h1 className="mt-6 font-pixel text-3xl font-semibold tracking-[-0.04em]">You are connected.</h1>
            <p className="mt-3 text-[14px] leading-6 text-[#696965]">OpenMerge is ready to review pull requests. Taking you to your workspace now.</p>
          </>
        )}

        {viewState === "error" && (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#fff0f0] text-[#c44141]"><HugeiconsIcon icon={Alert02Icon} size={27} strokeWidth={1.7} aria-hidden="true" /></div>
            <h1 className="mt-6 font-pixel text-3xl font-semibold tracking-[-0.04em]">Activation needs attention.</h1>
            <p className="mt-3 text-[14px] leading-6 text-[#696965]">{errorMsg}</p>
          </>
        )}

        {viewState === "no_id" && (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f1f1ee] text-[#777]"><HugeiconsIcon icon={Alert02Icon} size={27} strokeWidth={1.7} aria-hidden="true" /></div>
            <h1 className="mt-6 font-pixel text-3xl font-semibold tracking-[-0.04em]">Installation link incomplete.</h1>
            <p className="mt-3 text-[14px] leading-6 text-[#696965]">Return to OpenMerge and start the GitHub connection again.</p>
          </>
        )}
      </div>
    </AuthFrame>
  );
}
