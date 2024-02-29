import styles from "./Chip.module.scss"
import { ReactNode } from "react";


interface ChipProps {
    icon: ReactNode;
    text: string;
    className?: string;
  }
  
  export default function Chip({ icon, text, className }: ChipProps) {
    return (
      <div className={`${styles.container} ${className}`}>
        {icon}
        <p>{text}</p>
      </div>
    );
  }