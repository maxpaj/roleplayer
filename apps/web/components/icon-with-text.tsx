import Image from "next/image";

export function IconWithText({ label, imageSrc }: { label: string; imageSrc: string }) {
  return (
    <span className="item-center flex justify-center gap-x-1">
      {label}
      <Image className="inline dark:invert" src={imageSrc} height="16" width="16" alt={label} />
    </span>
  );
}
