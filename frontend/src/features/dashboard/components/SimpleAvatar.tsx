import { FC } from "react";
import "@styles/simpleAvatar.css";

export const SimpleAvatar: FC<{ name: string; size?: "sm" | "md" | "lg" }> = ({
  name,
  size = "md",
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClass = {
    sm: "avatar-sm",
    md: "avatar-md",
    lg: "avatar-lg",
  }[size];

  return <div className={`avatar ${sizeClass}`}>{getInitials(name)}</div>;
};
