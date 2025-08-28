'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  Users2, 
  Trophy, 
  MessageSquare, 
  Home,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { useState } from 'react';

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Teams",
    href: "/admin/teams",
    icon: Users2,
  },
  {
    title: "Chats",
    href: "/admin/chats",
    icon: MessageSquare,
  },
  {
    title: "Feedbacks",
    href: "/admin/feedbacks",
    icon: MessageSquare,
  },
];

interface AdminSidebarProps {
  onMobileClose?: () => void;
}

export function AdminSidebar({ onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = () => {
    // Close mobile sidebar when item is clicked
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col border-r transition-all duration-300 relative min-h-screen w-64 lg:w-64",
        isCollapsed && "lg:w-16"
      )}
      style={{ backgroundColor: "#343A40" }}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b border-gray-600 px-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <span className="text-lg font-semibold text-white truncate">ADMIN</span>
        </div>
        
        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-gray-300 hover:bg-gray-600 hover:text-white"
          onClick={onMobileClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleItemClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-gray-300 hover:bg-gray-600 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer - Only Toggle Button (hidden on mobile) */}
      <div className="border-t border-gray-600 p-4 hidden lg:block">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-gray-300 hover:bg-gray-600 hover:text-white"
          onClick={toggleCollapse}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}