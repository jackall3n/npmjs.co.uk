import { IconRefresh } from "@tabler/icons-react";
import { motion, useAnimation } from "motion/react";
import { useRef } from "react";
import { cn } from "~/lib/utils";

interface RefreshButtonProps {
  onClick: () => void;
  className?: string;
}

export function RefreshButton({ onClick, className }: RefreshButtonProps) {
  const controls = useAnimation();
  const rotationRef = useRef(0);

  const handleClick = () => {
    rotationRef.current -= 360;
    controls.start({
      rotate: rotationRef.current,
      transition: { duration: 0.5 },
    });
    onClick();
  };

  return (
    <button type="button" onClick={handleClick} className={cn("cursor-pointer text-white [&_svg]:!size-7", className)}>
      <motion.div animate={controls}>
        <IconRefresh />
      </motion.div>
    </button>
  );
}
