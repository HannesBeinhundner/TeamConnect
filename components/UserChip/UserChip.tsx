import styles from "./Chip.module.scss"
import { ReactNode } from "react";


interface ChipProps {
  userIconText: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export default function UserChip({ userIconText, rightIcon, className }: ChipProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      {userIconText}
      {rightIcon}
    </div>
  );
}