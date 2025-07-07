import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDashboard, Widget, WidgetSize, WidgetType } from "@/contexts/DashboardContext";

// Widget form schema
const widgetFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  type: z.enum(["stats", "chart", "list", "table"] as const),
  size: z.enum(["small", "medium", "large"] as const),
  isEnabled: z.boolean(),
  dataSource: z.string().min(1, { message: "Data source is required" }),
  config: z.record(z.string(), z.any()).optional(),
});

type WidgetFormValues = z.infer<typeof widgetFormSchema>;

interface WidgetConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetToEdit: Widget | null;
}

export function WidgetConfigModal({
  open,
  onOpenChange,
  widgetToEdit,
}: WidgetConfigModalProps) {
  const { toast } = useToast();
  const { addWidget, updateWidget } = useDashboard();

  const form = useForm<WidgetFormValues>({
    resolver: zodResolver(widgetFormSchema),
    defaultValues: {
      title: "",
      type: "stats",
      size: "small",
      isEnabled: true,
      dataSource: "assets",
      config: {},
    },
  });

  // Update form when widget changes
  useEffect(() => {
    if (widgetToEdit) {
      form.reset({
        title: widgetToEdit.title,
        type: widgetToEdit.type,
        size: widgetToEdit.size,
        isEnabled: widgetToEdit.isEnabled,
        dataSource: widgetToEdit.dataSource || "assets",
        config: widgetToEdit.config || {},
      });
    } else {
      form.reset({
        title: "",
        type: "stats",
        size: "small",
        isEnabled: true,
        dataSource: "assets",
        config: {},
      });
    }
  }, [widgetToEdit, form]);

  function onSubmit(values: WidgetFormValues) {
    if (widgetToEdit) {
      // Update existing widget
      updateWidget(widgetToEdit.id, values);
      toast({
        title: "Widget updated",
        description: "Your widget has been updated successfully.",
      });
    } else {
      // Add new widget
      addWidget(values);
      toast({
        title: "Widget added",
        description: "Your new widget has been added to the dashboard.",
      });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {widgetToEdit ? "Edit Widget" : "Add New Widget"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Widget Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter widget title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Widget Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select widget type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stats">Stats</SelectItem>
                        <SelectItem value="chart">Chart</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                        <SelectItem value="table">Table</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Widget Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select widget size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dataSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Source</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="assets">Assets</SelectItem>
                      <SelectItem value="inventory">Inventory</SelectItem>
                      <SelectItem value="movements">Movements</SelectItem>
                      <SelectItem value="suppliers">Suppliers</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Widget Visibility</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Toggle to show or hide this widget on the dashboard.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Additional configuration options based on widget type */}
            {form.watch("type") === "chart" && (
              <div className="space-y-4 rounded-lg border p-4">
                <Label>Chart Configuration</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chartType">Chart Type</Label>
                    <Select
                      value={form.watch("config.chartType") || "pie"}
                      onValueChange={(value) => {
                        const config = form.getValues("config") || {};
                        form.setValue("config", { ...config, chartType: value });
                      }}
                    >
                      <SelectTrigger id="chartType">
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groupBy">Group By</Label>
                    <Select
                      value={form.watch("config.groupBy") || "category"}
                      onValueChange={(value) => {
                        const config = form.getValues("config") || {};
                        form.setValue("config", { ...config, groupBy: value });
                      }}
                    >
                      <SelectTrigger id="groupBy">
                        <SelectValue placeholder="Select grouping" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="condition">Condition</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {form.watch("type") === "list" && (
              <div className="space-y-4 rounded-lg border p-4">
                <Label>List Configuration</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="limit">Item Limit</Label>
                    <Input
                      id="limit"
                      type="number"
                      min={1}
                      max={20}
                      value={form.watch("config.limit") || 5}
                      onChange={(e) => {
                        const config = form.getValues("config") || {};
                        form.setValue("config", { 
                          ...config, 
                          limit: parseInt(e.target.value) || 5
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sortBy">Sort By</Label>
                    <Select
                      value={form.watch("config.sortBy") || "date"}
                      onValueChange={(value) => {
                        const config = form.getValues("config") || {};
                        form.setValue("config", { ...config, sortBy: value });
                      }}
                    >
                      <SelectTrigger id="sortBy">
                        <SelectValue placeholder="Select sorting" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {widgetToEdit ? "Update Widget" : "Add Widget"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}