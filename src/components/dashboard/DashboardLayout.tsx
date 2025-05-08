import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building,
  BarChart3,
  FileText,
  Tag,
} from "lucide-react";
import NotificationCenter from "@/components/notifications/NotificationCenter";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  userRole?: "superadmin" | "owner" | "user";
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  currentTenant?: string;
  currentCompany?: string;
}

const DashboardLayout = ({
  children,
  userRole = "user",
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  userAvatar = "",
  currentTenant = "Default Tenant",
  currentCompany = "Default Company",
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    // Placeholder for logout functionality
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation items based on user role
  const navigationItems = React.useMemo(() => {
    const items = [
      {
        name: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
        href: "/dashboard",
        roles: ["superadmin", "owner", "user"],
      },
    ];

    // Add superadmin specific items
    if (userRole === "superadmin") {
      items.push(
        {
          name: "Tenant Management",
          icon: <Building className="h-5 w-5" />,
          href: "/dashboard/tenants",
          roles: ["superadmin"],
        },
        {
          name: "Company Management",
          icon: <Building2 className="h-5 w-5" />,
          href: "/dashboard/companies",
          roles: ["superadmin"],
        },
        {
          name: "User Management",
          icon: <Users className="h-5 w-5" />,
          href: "/dashboard/users",
          roles: ["superadmin"],
        },
        {
          name: "Coupon Management",
          icon: <Tag className="h-5 w-5" />,
          href: "/dashboard/coupons",
          roles: ["superadmin"],
        },
        {
          name: "Global Settings",
          icon: <Settings className="h-5 w-5" />,
          href: "/dashboard/settings",
          roles: ["superadmin"],
        },
      );
    }

    // Add owner specific items
    if (userRole === "owner") {
      items.push(
        {
          name: "Company Users",
          icon: <Users className="h-5 w-5" />,
          href: "/dashboard/company-users",
          roles: ["owner"],
        },
        {
          name: "Company Settings",
          icon: <Settings className="h-5 w-5" />,
          href: "/dashboard/company-settings",
          roles: ["owner"],
        },
        {
          name: "Reports",
          icon: <BarChart3 className="h-5 w-5" />,
          href: "/dashboard/reports",
          roles: ["owner"],
        },
      );
    }

    // Add user specific items
    if (userRole === "user") {
      items.push(
        {
          name: "My Tasks",
          icon: <FileText className="h-5 w-5" />,
          href: "/dashboard/tasks",
          roles: ["user"],
        },
        {
          name: "Profile",
          icon: <Users className="h-5 w-5" />,
          href: "/dashboard/profile",
          roles: ["user"],
        },
      );
    }

    return items;
  }, [userRole]);

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-0 left-0 z-40 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="m-2"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-card shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-center border-b p-4">
            <h2 className="text-xl font-bold text-primary">SaaS Platform</h2>
          </div>

          {/* Tenant/Company selector */}
          <div className="border-b p-4">
            <div className="mb-2 text-sm font-medium text-muted-foreground">
              Tenant: {currentTenant}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Company: {currentCompany}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate(item.href)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card px-4 shadow-sm">
          <div className="flex items-center lg:hidden">
            {/* Mobile sidebar toggle button is positioned absolutely */}
            <div className="w-10"></div>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            {/* Notifications */}
            <NotificationCenter />

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback>
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userRole}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard/profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard/settings")}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children || (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                Welcome to your dashboard, {userName}!
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
