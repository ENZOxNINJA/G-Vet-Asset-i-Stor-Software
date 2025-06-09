import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDashboard, Widget } from "@/contexts/DashboardContext";
import { WidgetConfigModal } from "@/components/WidgetConfigModal";
import {
  Plus,
  Settings,
  RefreshCw,
  Layout,
  LayoutGrid,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const DashboardToolbar = () => {
  const { 
    widgets, 
    toggleWidgetVisibility, 
    moveWidgetUp, 
    moveWidgetDown, 
    removeWidget,
    resetToDefaults
  } = useDashboard();
  
  const { toast } = useToast();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

  const handleAddWidget = () => {
    setSelectedWidget(null);
    setConfigModalOpen(true);
  };

  const handleEditWidget = (widget: Widget) => {
    setSelectedWidget(widget);
    setConfigModalOpen(true);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset to default widgets? This will remove any custom widgets.")) {
      resetToDefaults();
      toast({
        title: "Dashboard reset",
        description: "Dashboard has been reset to default widgets",
      });
    }
  };

  return (
    <div className="flex items-center justify-between mb-6 bg-background border rounded-md p-2">
      <div className="text-sm font-medium flex items-center">
        <Layout className="mr-2 h-4 w-4" />
        Dashboard Widgets
      </div>
      
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleAddWidget}
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Add Widget</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a new widget to your dashboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Manage</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Manage dashboard widgets</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Manage Widgets</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {widgets.map((widget) => (
              <DropdownMenuItem key={widget.id} className="flex justify-between">
                <span className="truncate max-w-[180px]">{widget.title}</span>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWidgetVisibility(widget.id);
                      toast({
                        title: widget.isEnabled ? "Widget hidden" : "Widget shown",
                        description: `${widget.title} is now ${widget.isEnabled ? "hidden" : "visible"}`,
                      });
                    }}
                    className="p-1 rounded-sm hover:bg-accent"
                  >
                    {widget.isEnabled ? (
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveWidgetUp(widget.id);
                    }}
                    className="p-1 rounded-sm hover:bg-accent"
                    disabled={widget.position === 0}
                  >
                    <MoveUp className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveWidgetDown(widget.id);
                    }}
                    className="p-1 rounded-sm hover:bg-accent"
                    disabled={widget.position === widgets.length - 1}
                  >
                    <MoveDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditWidget(widget);
                    }}
                    className="p-1 rounded-sm hover:bg-accent"
                  >
                    <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to remove the ${widget.title} widget?`)) {
                        removeWidget(widget.id);
                        toast({
                          title: "Widget removed",
                          description: `${widget.title} has been removed from dashboard`,
                        });
                      }
                    }}
                    className="p-1 rounded-sm hover:bg-accent"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Reset to Default</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <WidgetConfigModal
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        widgetToEdit={selectedWidget}
      />
    </div>
  );
};

export default DashboardToolbar;