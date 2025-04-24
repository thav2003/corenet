import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <motion.div
      className={cn(
        "p-6 rounded-lg border shadow-sm transition-all",
        "bg-black/40 backdrop-blur-sm border-zinc-800/40",
        "hover:border-zinc-700/70 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)]",
        className
      )}
      whileHover={{
        y: -5,
        transition: { duration: 0.3 },
      }}
    >
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
}
