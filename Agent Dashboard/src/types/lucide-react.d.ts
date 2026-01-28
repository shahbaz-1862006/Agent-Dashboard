declare module "lucide-react" {
  import * as React from "react";
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }
  export type LucideIcon = React.FC<LucideProps>;
  export const Icon: LucideIcon;
  // Allow named exports for icons
  const icons: Record<string, LucideIcon>;
  export default icons;
  export const Menu: LucideIcon;
  export const Sun: LucideIcon;
  export const Moon: LucideIcon;
  export const Copy: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const Search: LucideIcon;
  export const Users: LucideIcon;
  export const Wallet: LucideIcon;
  export const Home: LucideIcon;
  export const BadgeDollarSign: LucideIcon;
  export const Trophy: LucideIcon;
  export const Flag: LucideIcon;
  export const Settings: LucideIcon;
  export const Send: LucideIcon;
  export const LogOut: LucideIcon;
}
