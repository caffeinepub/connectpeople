import { cn } from '@/lib/utils';

interface InterestTagProps {
  label: string;
  selected?: boolean;
  selectable?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export default function InterestTag({ label, selected = false, selectable = false, onClick, size = 'md' }: InterestTagProps) {
  const base = cn(
    'inline-flex items-center font-medium rounded-full border transition-all duration-200',
    size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1 text-sm',
    selectable
      ? 'cursor-pointer select-none'
      : 'cursor-default',
    selected
      ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
      : selectable
        ? 'bg-accent/30 text-accent-foreground border-accent/40 hover:bg-primary/15 hover:border-primary/50 hover:text-primary'
        : 'bg-accent/20 text-accent-foreground border-accent/30'
  );

  if (selectable) {
    return (
      <button type="button" className={base} onClick={onClick}>
        {label}
      </button>
    );
  }

  return <span className={base}>{label}</span>;
}
