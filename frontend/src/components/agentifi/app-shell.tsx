import { Link, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  Bot,
  BriefcaseBusiness,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  FileCheck2,
  FilePlus2,
  FileText,
  Fingerprint,
  Gauge,
  LogOut,
  Menu,
  Network,
  Scale,
  ScrollText,
  Settings,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Three screens; everything per-case lives as tabs on the application page.
const navigation = [
  { label: "Dashboard", to: "/dashboard" as const, icon: Gauge },
  { label: "Applications", to: "/applications" as const, icon: BriefcaseBusiness },
  { label: "Audit Trail", to: "/audit" as const, icon: ScrollText },
];

function Brand() {
  return (
    <Link to="/dashboard" className="flex items-center gap-3" aria-label="AgentiFi dashboard">
      <span className="grid size-9 place-items-center rounded-md bg-primary font-semibold text-primary-foreground">
        ag
      </span>
      <span>
        <strong className="block text-[17px] font-semibold text-sidebar-foreground">
          AGENTIFI
        </strong>
        <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted">
          Agentic Underwriting
        </span>
      </span>
    </Link>
  );
}

function Navigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const renderLink = ({
    label,
    to,
    icon: Icon,
  }: {
    label: string;
    to: string;
    icon: typeof Gauge;
  }) => {
    const active = pathname.startsWith(to);
    return (
      <Link
        key={to}
        to={to}
        className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground"}`}
      >
        <Icon
          className={`size-4 ${active ? "text-sidebar-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"}`}
        />
        {label}
      </Link>
    );
  };
  return (
    <nav className="space-y-1" aria-label="Primary navigation">
      {navigation.map(renderLink)}
      {mobile && (
        <Link
          to="/settings"
          className="mt-5 flex items-center gap-3 border-t border-sidebar-border px-3 pt-5 text-sm font-medium text-sidebar-muted"
        >
          <Settings className="size-4" />
          Settings
        </Link>
      )}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="border-b border-sidebar-border px-5 py-5">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <Button asChild className="mb-4 w-full">
            <Link to="/applications/new">
              <FilePlus2 className="size-4" />
              New application
            </Link>
          </Button>
          <Navigation />
        </div>
        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground"
          >
            <Settings className="size-4" />
            Settings
          </Link>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
                <SheetHeader className="border-b border-sidebar-border p-5 text-left">
                  <SheetTitle>
                    <Brand />
                  </SheetTitle>
                  <SheetDescription className="sr-only">Main navigation</SheetDescription>
                </SheetHeader>
                <div className="p-3">
                  <Navigation mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden lg:flex" />
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" aria-label="Help">
              <CircleHelp />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger" />
            </Button>
            <div className="ml-1 flex items-center gap-2 border-l border-border pl-3">
              <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                RM
              </span>
              <div className="hidden text-left sm:block">
                <span className="block text-xs font-semibold">Risk Manager</span>
                <span className="block text-[10px] text-muted-foreground">Research workspace</span>
              </div>
              <ChevronDown className="hidden size-3 text-muted-foreground sm:block" />
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}
