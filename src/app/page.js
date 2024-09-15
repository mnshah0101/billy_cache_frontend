
'use client'
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Dashboard } from "@/components/search/page";

export default function Home() {
  return (
    <div>
      <TooltipProvider>
        <Dashboard />

      </TooltipProvider>
    </div>
  );
}
