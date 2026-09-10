import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 text-amber-500", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          fill={i < rating ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
