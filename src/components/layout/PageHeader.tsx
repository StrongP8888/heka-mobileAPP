interface Props {
  icon: React.ReactNode;
  title: string;
  rightAction?: React.ReactNode;
}

export default function PageHeader({ icon, title, rightAction }: Props) {
  return (
    <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] pb-2 px-4">
      <div className="flex items-center justify-center gap-2 py-3">
        <span className="text-heka-purple">{icon}</span>
        <h1 className="text-base font-semibold text-heka-purple">{title}</h1>
        {rightAction && <div className="absolute right-4">{rightAction}</div>}
      </div>
    </header>
  );
}
