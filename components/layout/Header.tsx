import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  return (
    <div className="p-4 flex justify-between items-center border-b">
      <Button 
        onClick={onToggleSidebar}
        variant="outline"
      >
        {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>
      <ThemeToggle />
    </div>
  );
}