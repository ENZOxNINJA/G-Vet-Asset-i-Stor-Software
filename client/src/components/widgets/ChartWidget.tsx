import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Widget } from "@/contexts/DashboardContext";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

// Chart color scheme
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

interface ChartWidgetProps {
  widget: Widget;
  data: any[];
  isLoading?: boolean;
}

const ChartWidget = ({ widget, data, isLoading }: ChartWidgetProps) => {
  const { title, config } = widget;
  const chartType = config?.chartType || 'pie';
  
  // Prepare data based on the groupBy configuration
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const groupBy = config?.groupBy || 'category';
    const grouped = data.reduce((acc, item) => {
      const key = item[groupBy] || 'Unknown';
      
      if (!acc[key]) {
        acc[key] = { name: key, value: 0, items: [] };
      }
      
      acc[key].value += 1;
      acc[key].items.push(item);
      
      return acc;
    }, {});
    
    return Object.values(grouped);
  }, [data, config?.groupBy]);

  const renderChart = () => {
    if (isLoading) {
      return <div className="h-[200px] flex items-center justify-center">Loading chart data...</div>;
    }
    
    if (chartData.length === 0) {
      return <div className="h-[200px] flex items-center justify-center">No data available</div>;
    }
    
    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={(entry) => entry.name}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
              <Bar dataKey="value" fill="#8884d8" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
              <Line type="monotone" dataKey="value" stroke="#8884d8" name="Count" />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
              <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" name="Count" />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <div className="h-[200px] flex items-center justify-center">
            Unknown chart type: {chartType}
          </div>
        );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {config?.groupBy ? `Grouped by ${config.groupBy}` : 'Overview'}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default ChartWidget;