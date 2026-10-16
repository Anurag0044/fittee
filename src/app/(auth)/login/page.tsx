"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormElements';
import { useAuth } from '@/lib/authContext';
import { AdminRole } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useAuth();
  const { success } = useToast();

  const [email, setEmail] = useState('sujal@fittee.in');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      success('Authentication Successful', 'Logged in as Super Admin');
      router.push('/');
    }, 500);
  };

  const handleFastRoleSelect = (role: AdminRole, userEmail: string) => {
    switchRole(role);
    success('Quick Login', `Authenticated as ${role}`);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0E0F0D] flex flex-col justify-center items-center p-4 select-none">
      <div className="w-full max-w-md bg-white dark:bg-[#161815] rounded-2xl border border-[#E7E5DF] dark:border-[#2A2C27] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <span className="font-serif italic text-3xl font-bold text-[#161714] dark:text-[#F2F1EC] tracking-tight">
            Fittee<span className="text-[#B87A22]">.</span>
          </span>
          <p className="text-[11px] uppercase tracking-widest font-bold text-[#B87A22]">
            Operations & Fulfillment Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Operator Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@fittee.in"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-[11.5px] text-[#8C8B83]">
            <span>Session: 30m idle timeout</span>
            <span className="text-[#B87A22] font-semibold">2FA Required for Super Admin</span>
          </div>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            isLoading={isLoading}
            className="w-full shadow-sm"
          >
            <span>Sign In to Admin Portal</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Quick Demo Access Roles */}
        <div className="pt-4 border-t border-[#E7E5DF] dark:border-[#2A2C27] space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C8B83] text-center">
            One-Click Role Preview (RBAC Simulation)
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleFastRoleSelect('SUPER_ADMIN', 'sujal@fittee.in')}
              className="px-3 py-2 rounded-lg text-left text-xs border border-[#E7E5DF] dark:border-[#2A2C27] hover:border-[#B87A22] bg-[#FAFAF7] dark:bg-[#1E201C] hover:bg-white dark:hover:bg-[#252822] transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-bold text-[#161714] dark:text-[#F2F1EC]">Super Admin</span>
                <span className="text-[10px] text-[#8C8B83] block">sujal@fittee.in (Full revenue & locks)</span>
              </div>
              <ShieldCheck className="w-4 h-4 text-[#B87A22]" />
            </button>

            <button
              type="button"
              onClick={() => handleFastRoleSelect('CATALOG_MGR', 'priya.s@fittee.in')}
              className="px-3 py-2 rounded-lg text-left text-xs border border-[#E7E5DF] dark:border-[#2A2C27] hover:border-[#B87A22] bg-[#FAFAF7] dark:bg-[#1E201C] hover:bg-white dark:hover:bg-[#252822] transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-bold text-[#161714] dark:text-[#F2F1EC]">Catalog Manager</span>
                <span className="text-[10px] text-[#8C8B83] block">priya.s@fittee.in (Products, Banners & CMS)</span>
              </div>
              <Shield className="w-4 h-4 text-[#8C8B83]" />
            </button>

            <button
              type="button"
              onClick={() => handleFastRoleSelect('LOGISTICS_MGR', 'rajesh.m@fittee.in')}
              className="px-3 py-2 rounded-lg text-left text-xs border border-[#E7E5DF] dark:border-[#2A2C27] hover:border-[#B87A22] bg-[#FAFAF7] dark:bg-[#1E201C] hover:bg-white dark:hover:bg-[#252822] transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-bold text-[#161714] dark:text-[#F2F1EC]">Logistics Manager</span>
                <span className="text-[10px] text-[#8C8B83] block">rajesh.m@fittee.in (Orders & Ekart dispatch)</span>
              </div>
              <Shield className="w-4 h-4 text-[#8C8B83]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
