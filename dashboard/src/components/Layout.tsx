import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Brain,
  Briefcase,
  History,
  LayoutDashboard,
  TrendingUp,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/positions', icon: Briefcase, label: 'Positions' },
  { to: '/trades', icon: History, label: 'Trade History' },
  { to: '/performance', icon: TrendingUp, label: 'Performance' },
  { to: '/insights', icon: Brain, label: 'Model Insights' },
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-950">
      <nav className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col p-4">
        <h1 className="text-lg font-bold text-white mb-2 px-3">Trading Bot</h1>

        <div className="mx-3 mb-6 px-2 py-1 bg-yellow-900/50 border border-yellow-700 rounded text-xs text-yellow-300 text-center font-medium">
          DEMO ACCOUNT
        </div>

        <ul className="space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1 overflow-y-auto bg-gray-950 p-8">
        {children}
      </main>
    </div>
  );
}
