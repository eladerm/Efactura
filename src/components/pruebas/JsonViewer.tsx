
'use client';

interface JsonViewerProps {
  data: any;
}

export function JsonViewer({ data }: JsonViewerProps) {
  if (!data) return null;

  let formattedJson;
  try {
    // If data is already a string, try to parse and re-stringify it to format.
    const obj = typeof data === 'string' ? JSON.parse(data) : data;
    formattedJson = JSON.stringify(obj, null, 2);
  } catch (e) {
    // If it's a string that's not valid JSON, display it as is.
    formattedJson = String(data);
  }


  return (
    <pre className="mt-4 p-4 bg-muted/50 dark:bg-muted/20 rounded-md overflow-x-auto text-xs font-mono">
      <code>{formattedJson}</code>
    </pre>
  );
}
