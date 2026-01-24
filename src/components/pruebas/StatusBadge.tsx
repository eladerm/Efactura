
'use client';

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TestStatus } from "@/types";

interface StatusBadgeProps {
  status: TestStatus;
}

const statusStyles: Record<TestStatus, string> = {
  idle: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700",
  running: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 border-blue-300 dark:border-blue-700/80 animate-pulse",
  success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-300 dark:border-green-700/80",
  error: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 border-red-300 dark:border-red-700/80",
};

const statusLabels: Record<TestStatus, string> = {
  idle: "Pendiente",
  running: "Ejecutando",
  success: "Éxito",
  error: "Error",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize font-semibold", statusStyles[status])}
    >
      {statusLabels[status]}
    </Badge>
  );
}
