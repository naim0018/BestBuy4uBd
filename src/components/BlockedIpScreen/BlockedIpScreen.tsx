import { useEffect, useState } from "react";
import { ShieldAlert, Ban, RefreshCw } from "lucide-react";

interface BlockedIpDetail {
  message?: string;
  reason?: string;
  blockedIp?: string;
}

export default function BlockedIpScreen() {
  const [blockedInfo, setBlockedInfo] = useState<BlockedIpDetail | null>(null);

  useEffect(() => {
    const handleBlocked = (e: Event) => {
      const customEvent = e as CustomEvent<BlockedIpDetail>;
      if (customEvent.detail && customEvent.detail.blockedIp) {
        setBlockedInfo(customEvent.detail);
      }
    };

    window.addEventListener("store_ip_blocked", handleBlocked);
    return () => {
      window.removeEventListener("store_ip_blocked", handleBlocked);
    };
  }, []);

  if (!blockedInfo) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-red-200 dark:border-red-900/60 overflow-hidden text-center p-8">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 mb-3">
          <Ban className="w-3.5 h-3.5" />
          Access Restricted
        </span>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Website Access Denied
        </h2>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Your IP address has been restricted from accessing this website due to suspicious or abusive activity.
        </p>

        <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-left mb-6 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Your IP Address:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {blockedInfo.blockedIp}
            </span>
          </div>
          <div className="flex justify-between items-start text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 shrink-0 mr-2">Reason:</span>
            <span className="text-slate-700 dark:text-slate-300 text-right font-medium">
              {blockedInfo.reason || "Suspicious or abusive activity"}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-5">
          If you believe this restriction is an error, please disconnect any VPN or proxy and reload the page, or contact store support.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reload Website
        </button>
      </div>
    </div>
  );
}
