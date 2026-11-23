import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Code,
  ExternalLink,
  Heart,
  Lightbulb,
  House,
  Menu,
  Palette,
  Search,
  SquareKanban,
  X,
  Wallet,
  Video,
  type LucideIcon,
} from "lucide-react";

/** Iconos Lucide (los mismos de la app) por nombre usado en `content/wiki/navigation.json`. */
const icons: Record<string, LucideIcon> = {
  home: House,
  wallet: Wallet,
  idea: Lightbulb,
  book: BookOpen,
  board: SquareKanban,
  calendar: CalendarDays,
  meeting: Video,
  heart: Heart,
  design: Palette,
  code: Code,
  search: Search,
  menu: Menu,
  close: X,
  arrow: ArrowRight,
  external: ExternalLink,
  chevron: ChevronRight,
};

export function AdminIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = icons[name] ?? BookOpen;
  return <Icon size={size} strokeWidth={2} aria-hidden="true" />;
}
