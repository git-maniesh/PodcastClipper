import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center p-12">
      <Loader2 className="text-muted-foreground h-10 w-10 animate-spin" />
      <span className="ml-3 text-lg ">Loading Dashboard.....</span>
    </div>
  );
}
