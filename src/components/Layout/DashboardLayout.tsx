'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Tent,
  Users,
  Package,
  Heart,
  Bell,
  TriangleAlert,
  ShieldCheck,
  MessageSquarePlus,
  LayoutDashboard,
  Megaphone,
  BookOpen,
  Menu,
  X,
  Sun,
  Moon,
  Radio
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ChatBot } from '@/components/UI/ChatBot';
import { LanguageSelector } from '@/components/UI/LanguageSelector';
import { getTranslation } from '@/lib/translations';

const publicNavigation = [
  { name: 'nav_hub', href: '/', icon: Home },
  { name: 'nav_donations', href: '/donations', icon: Heart },
  { name: 'nav_camps', href: '/camps', icon: Tent },
  { name: 'nav_protocols', href: '/protocols', icon: BookOpen },
  { name: 'nav_volunteer', href: '/volunteers/register', icon: Users },
  { name: 'nav_report', href: '/report', icon: MessageSquarePlus },
  { name: 'nav_supplies', href: '/resources', icon: Package },
  { name: 'nav_chat', href: '/chat', icon: Radio },
];

const volunteerNavigation = [
  { name: 'nav_deploy', href: '/volunteers', icon: Users },
  { name: 'nav_training', href: '/volunteers/training', icon: BookOpen },
  { name: 'nav_route', href: '/volunteers/route', icon: Package },
  { name: 'nav_chat', href: '/chat', icon: Radio },
];

const authorityNavigation = [
  { name: 'nav_command', href: '/government', icon: LayoutDashboard },
  { name: 'nav_tasks', href: '/government/tasks', icon: Users },
  { name: 'nav_verification', href: '/government#reports', icon: Megaphone },
  { name: 'nav_inventory', href: '/inventory', icon: Package },
  { name: 'nav_chat', href: '/chat', icon: Radio },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { alerts, userRole, setRole, isHydrated, theme, toggleTheme, language } = useAppStore();
  const unreadAlerts = alerts.filter(a => !a.isRead).length;
  const isAuthorityView = userRole === 'government';
  const isVolunteerView = userRole === 'volunteer';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = (key: any) => getTranslation(language, key);

  // Protect routes / enforce role selection
  useEffect(() => {
    if (isHydrated && !userRole && pathname !== '/login') {
      router.push('/login');
    }
  }, [userRole, pathname, router, isHydrated]);

  if (!userRole) {
    return <div className="min-h-screen bg-navy flex items-center justify-center"><div className="w-8 h-8 border-4 border-sapphire border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="flex h-screen bg-navy text-neutral-100 overflow-hidden font-sans">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy-panel border-r border-white/5 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 py-2">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-sapphire mr-2 shrink-0" />
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tight text-white leading-none">IDCS</h1>
              <span className="text-[7.5px] font-bold text-neutral-400 uppercase tracking-widest leading-tight mt-0.5">Integrated Disaster<br />Coordination System</span>
            </div>
          </div>
          <button
            className="md:hidden p-1 text-neutral-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-6 px-3 flex flex-col">

          {userRole === 'public' && (
            <div className="mb-8">
              <h3 className="px-3 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">{t('role_public')}</h3>
              <nav className="space-y-1">
                {publicNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                        ? 'neo-inset text-powder'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                    >
                      <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-powder' : 'text-neutral-500'}`} />
                      {t(item.name as any)}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {userRole === 'volunteer' && (
            <div className="mb-8">
              <h3 className="px-3 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">{t('role_volunteer')}</h3>
              <nav className="space-y-1">
                {volunteerNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                        ? 'neo-inset text-powder'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                    >
                      <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-powder' : 'text-neutral-500'}`} />
                      {t(item.name as any)}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {userRole === 'government' && (
            <div>
              <h3 className="px-3 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">{t('role_admin')}</h3>
              <nav className="space-y-1">
                {authorityNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                        ? 'neo-inset text-powder'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                    >
                      <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-powder' : 'text-neutral-500'}`} />
                      {t(item.name as any)}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* User Profile Hook */}
          <div className="mt-auto px-3">
            <div className="glass-card p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${userRole === 'government' ? 'bg-indigo-600' :
                  userRole === 'volunteer' ? 'bg-sapphire' : 'bg-sapphire'
                  }`}>
                  {userRole === 'government' ? 'GOV' : userRole === 'volunteer' ? 'VOL' : 'PUB'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate text-ellipsis uppercase">{userRole} ACCESS</p>
                  <p className="text-[10px] text-neutral-500 truncate">{t('connected')}</p>
                </div>
              </div>
              <button
                onClick={() => { setRole(null); router.push('/login'); }}
                className="w-full py-1.5 neo-btn text-neutral-400 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:text-white"
              >
                {t('switch_role')}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-navy-panel/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-6 z-10 w-full overflow-hidden shrink-0">

          <div className="flex items-center flex-1 min-w-0 pr-4">
            <button
              className="md:hidden p-2 mr-3 neo-btn text-neutral-400 rounded-xl shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* CRITICAL DISCLAIMER */}
            <div className={`flex items-center space-x-2 ${isAuthorityView ? 'bg-sapphire/10 border-sapphire/20' : isVolunteerView ? 'bg-sapphire/10 border-sapphire/20' : 'bg-sapphire/10 border-sapphire/20'} border px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap overflow-hidden text-ellipsis min-w-0`}>
              <TriangleAlert className={`w-3.5 h-3.5 flex-shrink-0 ${isAuthorityView ? 'text-sapphire' : isVolunteerView ? 'text-sapphire' : 'text-sapphire'}`} />
              <span className={`text-[10px] font-black ${isAuthorityView ? 'text-sapphire' : isVolunteerView ? 'text-sapphire' : 'text-sapphire'} tracking-[0.1em] uppercase truncate`}>
                {t('disclaimer')}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
            {isAuthorityView && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-sapphire/10 rounded-full border border-sapphire/20">
                <ShieldCheck className="w-3.5 h-3.5 text-sapphire" />
                <span className="text-[10px] font-bold text-sapphire uppercase tracking-tighter italic">{t('verified_admin')}</span>
              </div>
            )}

            <LanguageSelector />

            <button
              onClick={toggleTheme}
              className="p-2 neo-btn rounded-xl text-neutral-400 hover:text-white"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            </button>

            <button className="relative p-2 neo-btn rounded-xl text-neutral-400 hover:text-white">
              <Bell className="w-5 h-5" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-navy-panel animate-pulse"></span>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {children}
        </main>

        {/* ChatBot Overlay */}
        <ChatBot />
      </div>
    </div>
  );
}
