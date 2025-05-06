import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Widget } from "@/contexts/DashboardContext";
import {
  CircleUser,
  PackageOpen,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  LayoutDashboard,
  ArrowRightLeft,
  Truck,
  LucideIcon
} from "lucide-react";

interface StatWidgetProps {
  widget: Widget;
  value: number;
  description?: string;
  icon?: LucideIcon;
  iconClassName?: string;
}

// Map widget IDs to default icons
const defaultIcons: Record<string, LucideIcon> = {
  'total-assets': ClipboardList,
  'pending-verification': AlertCircle,
  'inventory-items': PackageOpen,
  'stock-alerts': AlertCircle,
  'total-movements': ArrowRightLeft,
  'total-suppliers': Truck,
};

// Map widget IDs to default icon classes
const defaultIconClasses: Record<string, string> = {
  'total-assets': 'text-muted-foreground',
  'pending-verification': 'text-amber-500',
  'inventory-items': 'text-muted-foreground',
  'stock-alerts': 'text-red-500',
  'total-movements': 'text-blue-500',
  'total-suppliers': 'text-muted-foreground',
};

const StatWidget = ({
  widget,
  value,
  description,
  icon,
  iconClassName,
}: StatWidgetProps) => {
  const Icon = icon || defaultIcons[widget.id] || ClipboardList;
  const iconClass = iconClassName || defaultIconClasses[widget.id] || 'text-muted-foreground';

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description || `Total ${widget.title.toLowerCase()}`}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatWidget;