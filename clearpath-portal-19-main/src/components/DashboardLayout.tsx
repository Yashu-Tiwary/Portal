import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Leaf, LogOut, LucideIcon } from "lucide-react";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  roleLabel: string;
  navItems: NavItem[];
  headerActions?: ReactNode;
}

const DashboardLayout = ({ children, title, roleLabel, navItems, headerActions }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <Leaf className="h-6 w-6 text-sidebar-primary" />
          <span className="font-display text-lg">PARIVESH 3.0</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-md">
          <h1 className="font-display text-xl text-foreground">{title}</h1>
          <div className="flex items-center gap-4">
            {headerActions}
            <span className="text-sm text-muted-foreground">{roleLabel}</span>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
