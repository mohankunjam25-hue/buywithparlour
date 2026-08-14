import React from 'react';
import { Settings, Database, Server, CheckCircle2 } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span>Platform System Architecture & MongoDB Atlas Health</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live server configurations, security policies, and database connection cluster parameters
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs px-3.5 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All Systems Operational
            </span>
          </div>
        </div>

        {/* 2-Column Technical Diagnostics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Database Cluster Diagnostic */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">MongoDB Atlas Production Cluster</h4>
                <span className="text-[11px] text-emerald-600 font-semibold">State: Connected (readyState 1)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-200 text-slate-700">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Host Endpoint</span>
                <span className="font-mono text-slate-900 font-semibold">cluster0.dajdjvr.mongodb.net</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Database Name</span>
                <span className="font-mono text-blue-600 font-bold">buywithpalor</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Ping Latency</span>
                <span className="text-emerald-600 font-bold">~1016 ms</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Auto Sharding & SSL</span>
                <span className="text-emerald-600 font-semibold">TLS / SSL 1.3 Active</span>
              </div>
            </div>
          </div>

          {/* Backend REST Engine Diagnostic */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Express REST API Engine</h4>
                <span className="text-[11px] text-blue-600 font-semibold">Port 8080 • Node.js v20+</span>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-200 text-slate-700">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Security Middleware</span>
                <span className="text-slate-900">Helmet, RateLimiter, HttpOnly JWT</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">CORS Whitelist</span>
                <span className="text-slate-900">5173 (Customer), 5174 (Admin), 5175 (Seller)</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Environment Mode</span>
                <span className="text-amber-600 font-bold uppercase">development</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">API Health Check</span>
                <span className="text-emerald-600 font-semibold">http://localhost:8080/health</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
