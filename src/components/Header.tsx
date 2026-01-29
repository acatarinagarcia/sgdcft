import { Link, useLocation } from 'react-router-dom';
import { Activity, Stethoscope, Pill, Users, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePedidos } from '@/context/PedidosContext';

export function Header() {
  const location = useLocation();
  const { getEstatisticas } = usePedidos();
  const stats = getEstatisticas();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/medico', label: 'Portal Médico', icon: Stethoscope, color: 'text-blue-500' },
    { path: '/farmacia', label: 'Portal Farmácia', icon: Pill, color: 'text-green-500', count: stats.emTriagem },
    { path: '/cft', label: 'Portal CFT', icon: Users, color: 'text-purple-500', count: stats.emAgenda },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">SGT-CFT</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors relative',
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted',
                    item.color && !isActive && item.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={cn(
                      'absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs flex items-center justify-center',
                      isActive ? 'bg-background text-foreground' : 'bg-primary text-primary-foreground'
                    )}>
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
