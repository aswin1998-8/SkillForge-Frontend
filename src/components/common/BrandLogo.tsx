import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  size?: number;
  priority?: boolean;
};

export function BrandLogo({
  className,
  size = 28,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="ForgeIQ"
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
