
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";
import type { TestExecution } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { JsonViewer } from "./JsonViewer";
import { ReactNode } from "react";

interface TestCardProps {
  title: string;
  description: string;
  onRun: () => void;
  execution?: TestExecution;
  children?: ReactNode;
}

export function TestCard({ title, description, onRun, execution, children }: TestCardProps) {
  const status = execution?.status || "idle";
  const isLoading = status === "running";

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className="grid gap-1.5">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </div>
            {execution && <StatusBadge status={status} />}
        </div>
      </CardHeader>
      <CardContent>
        {children}
        {execution?.result && <JsonViewer data={execution.result} />}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {execution ? `Última ejecución: ${execution.timestamp} (${execution.duration}ms)` : "Nunca ejecutado."}
        </p>
        <Button onClick={onRun} disabled={isLoading} size="sm">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Ejecutando..." : "Ejecutar"}
        </Button>
      </CardFooter>
    </Card>
  );
}
