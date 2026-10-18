import React, { useState } from "react";
import {
  X,
  Sliders,
  Bell,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "connection" | "notifications";
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = "connection",
}) => {
  const [activeTab, setActiveTab] = useState<"connection" | "notifications">(initialTab);

  const [webhookUrl, setWebhookUrl] = useState("https://api.bestbuy4ubd.com/v1/webhooks/messages");
  const [verifyToken, setVerifyToken] = useState("bestbuy_secure_webhook_token_9921");
  const [pollingRate, setPollingRate] = useState("realtime");

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopAlerts, setDesktopAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [agentAssignmentAlerts, setAgentAssignmentAlerts] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    toast.success("Messaging configuration saved successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Inbox & Channel Settings</h3>
            <p className="text-xs text-slate-500">
              Manage webhook endpoints, channel synchronization, and real-time alerts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab("connection")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "connection"
                ? "border-slate-900 text-slate-900 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Sliders className="w-4 h-4" />
            Connection & Webhooks
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "notifications"
                ? "border-slate-900 text-slate-900 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Bell className="w-4 h-4" />
            Notification Preferences
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          {activeTab === "connection" ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Inbound Webhook Callback URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(webhookUrl);
                      toast.info("Copied webhook URL to clipboard");
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Meta Graph API Verify Token
                </label>
                <input
                  type="password"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <span className="font-semibold">Healthy Connection:</span> Webhook handshake response time is currently <span className="font-bold">36ms</span>. All Facebook & WhatsApp events are synchronizing to SparkTech-Server.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Synchronization Mode
                </label>
                <select
                  value={pollingRate}
                  onChange={(e) => setPollingRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                >
                  <option value="realtime">Real-time WebSockets (Recommended - &lt;80ms)</option>
                  <option value="5s">Fallback Polling (Every 5 seconds)</option>
                  <option value="15s">Eco Polling (Every 15 seconds)</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Desktop Sound Alerts</h4>
                    <p className="text-xs text-slate-500">Play a chime when an incoming customer inquiry arrives</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Browser Push Notifications</h4>
                    <p className="text-xs text-slate-500">Show notification popup when dashboard tab is unfocused</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={desktopAlerts}
                    onChange={(e) => setDesktopAlerts(e.target.checked)}
                    className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Agent Assignment Ping</h4>
                    <p className="text-xs text-slate-500">Notify instantly when a teammate reassigns a thread to you</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={agentAssignmentAlerts}
                    onChange={(e) => setAgentAssignmentAlerts(e.target.checked)}
                    className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Daily Unresolved Digest</h4>
                    <p className="text-xs text-slate-500">Send an evening summary of open customer inquiries</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
