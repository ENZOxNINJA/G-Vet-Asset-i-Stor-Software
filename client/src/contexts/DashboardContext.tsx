import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type WidgetSize = 'small' | 'medium' | 'large';
export type WidgetType = 'stats' | 'chart' | 'list' | 'table';

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  position: number;
  isEnabled: boolean;
  dataSource?: string;
  config?: Record<string, any>;
}

interface DashboardContextType {
  widgets: Widget[];
  setWidgets: (widgets: Widget[]) => void;
  addWidget: (widget: Omit<Widget, 'id' | 'position'>) => void;
  updateWidget: (id: string, widgetData: Partial<Widget>) => void;
  removeWidget: (id: string) => void;
  toggleWidgetVisibility: (id: string) => void;
  moveWidgetUp: (id: string) => void;
  moveWidgetDown: (id: string) => void;
  resetToDefaults: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Default widgets
const defaultWidgets: Widget[] = [
  {
    id: 'total-assets',
    title: 'Total Assets',
    type: 'stats',
    size: 'small',
    position: 0,
    isEnabled: true,
    dataSource: 'assets'
  },
  {
    id: 'pending-verification',
    title: 'Pending Verification',
    type: 'stats',
    size: 'small',
    position: 1,
    isEnabled: true,
    dataSource: 'assets',
    config: {
      filter: 'pending'
    }
  },
  {
    id: 'inventory-items',
    title: 'Inventory Items',
    type: 'stats',
    size: 'small',
    position: 2,
    isEnabled: true,
    dataSource: 'inventory'
  },
  {
    id: 'stock-alerts',
    title: 'Stock Alerts',
    type: 'stats',
    size: 'small',
    position: 3,
    isEnabled: true,
    dataSource: 'inventory',
    config: {
      filter: 'low-stock'
    }
  },
  {
    id: 'recent-movements',
    title: 'Recent Asset Movements',
    type: 'list',
    size: 'medium',
    position: 4,
    isEnabled: true,
    dataSource: 'movements',
    config: {
      limit: 5
    }
  },
  {
    id: 'asset-distribution',
    title: 'Asset Distribution',
    type: 'chart',
    size: 'medium',
    position: 5,
    isEnabled: true,
    dataSource: 'assets',
    config: {
      groupBy: 'department',
      chartType: 'pie'
    }
  },
  {
    id: 'inventory-summary',
    title: 'Inventory Summary',
    type: 'chart',
    size: 'medium',
    position: 6,
    isEnabled: true,
    dataSource: 'inventory',
    config: {
      groupBy: 'category',
      chartType: 'bar'
    }
  }
];

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  // Try to get widgets from localStorage, or use defaults
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const savedWidgets = localStorage.getItem('dashboard-widgets');
    if (savedWidgets) {
      try {
        return JSON.parse(savedWidgets);
      } catch (e) {
        console.error('Failed to parse saved widgets:', e);
        return [...defaultWidgets];
      }
    }
    return [...defaultWidgets];
  });

  // Save to localStorage when widgets change
  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
  }, [widgets]);

  const addWidget = (widget: Omit<Widget, 'id' | 'position'>) => {
    const newWidget: Widget = {
      ...widget,
      id: `widget-${Date.now()}`,
      position: widgets.length
    };
    setWidgets([...widgets, newWidget]);
  };

  const updateWidget = (id: string, widgetData: Partial<Widget>) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, ...widgetData } : widget
    ));
  };

  const removeWidget = (id: string) => {
    const updatedWidgets = widgets
      .filter(widget => widget.id !== id)
      .map((widget, index) => ({ ...widget, position: index }));
    setWidgets(updatedWidgets);
  };

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, isEnabled: !widget.isEnabled } : widget
    ));
  };

  const moveWidgetUp = (id: string) => {
    const index = widgets.findIndex(widget => widget.id === id);
    if (index <= 0) return; // Already at the top

    const newWidgets = [...widgets];
    [newWidgets[index - 1], newWidgets[index]] = [newWidgets[index], newWidgets[index - 1]];
    
    // Update positions
    newWidgets[index - 1].position = index - 1;
    newWidgets[index].position = index;
    
    setWidgets(newWidgets);
  };

  const moveWidgetDown = (id: string) => {
    const index = widgets.findIndex(widget => widget.id === id);
    if (index === -1 || index === widgets.length - 1) return; // Already at the bottom

    const newWidgets = [...widgets];
    [newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]];
    
    // Update positions
    newWidgets[index].position = index;
    newWidgets[index + 1].position = index + 1;
    
    setWidgets(newWidgets);
  };

  const resetToDefaults = () => {
    setWidgets([...defaultWidgets]);
  };

  const value = {
    widgets,
    setWidgets,
    addWidget,
    updateWidget,
    removeWidget,
    toggleWidgetVisibility,
    moveWidgetUp,
    moveWidgetDown,
    resetToDefaults
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};