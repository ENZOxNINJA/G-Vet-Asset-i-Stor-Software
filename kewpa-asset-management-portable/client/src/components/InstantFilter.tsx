import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  DollarSign,
  Tag,
  Building,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'range' | 'date';
  options?: { value: string; label: string; }[];
  placeholder?: string;
}

interface InstantFilterProps {
  onFilter: (filters: Record<string, any>) => void;
  configs: FilterConfig[];
  data?: any[];
  searchPlaceholder?: string;
  className?: string;
}

const InstantFilter = ({ 
  onFilter, 
  configs, 
  data = [], 
  searchPlaceholder = "Search...",
  className 
}: InstantFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Extract unique values for select filters
  const getUniqueValues = (key: string) => {
    const values = data
      .map(item => item[key])
      .filter(value => value && value.toString().trim())
      .map(value => value.toString());
    
    return Array.from(new Set(values)).sort().map(value => ({
      value,
      label: value
    }));
  };

  // Apply filters whenever search term or filters change
  useEffect(() => {
    const appliedFilters = {
      search: searchTerm,
      ...filters
    };
    onFilter(appliedFilters);
  }, [searchTerm, filters, onFilter]);

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => {
      if (!value || value === '') {
        const { [key]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({});
  };

  const activeFilterCount = Object.keys(filters).length + (searchTerm ? 1 : 0);

  return (
    <Card className={cn("mb-6", className)}>
      <CardContent className="p-4 space-y-4">
        {/* Main search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Advanced
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {configs.map((config) => {
                const filterValue = filters[config.key] || '';
                
                return (
                  <div key={config.key} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {config.label}
                    </label>
                    
                    {config.type === 'text' && (
                      <Input
                        placeholder={config.placeholder || `Filter by ${config.label.toLowerCase()}`}
                        value={filterValue}
                        onChange={(e) => updateFilter(config.key, e.target.value)}
                      />
                    )}
                    
                    {config.type === 'select' && (
                      <Select
                        value={filterValue}
                        onValueChange={(value) => updateFilter(config.key, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${config.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All {config.label.toLowerCase()}</SelectItem>
                          {(config.options || getUniqueValues(config.key)).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {config.type === 'range' && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filterValue.min || ''}
                          onChange={(e) => updateFilter(config.key, { 
                            ...filterValue, 
                            min: e.target.value 
                          })}
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filterValue.max || ''}
                          onChange={(e) => updateFilter(config.key, { 
                            ...filterValue, 
                            max: e.target.value 
                          })}
                        />
                      </div>
                    )}
                    
                    {config.type === 'date' && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={filterValue.from || ''}
                          onChange={(e) => updateFilter(config.key, { 
                            ...filterValue, 
                            from: e.target.value 
                          })}
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="date"
                          value={filterValue.to || ''}
                          onChange={(e) => updateFilter(config.key, { 
                            ...filterValue, 
                            to: e.target.value 
                          })}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Active filter badges */}
        {activeFilterCount > 0 && (
          <>
            <Separator />
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  Search: {searchTerm}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="h-auto p-0 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {Object.entries(filters).map(([key, value]) => {
                const config = configs.find(c => c.key === key);
                if (!config) return null;
                
                let displayValue = value;
                if (config.type === 'range' && typeof value === 'object') {
                  displayValue = `${value.min || '∞'} - ${value.max || '∞'}`;
                } else if (config.type === 'date' && typeof value === 'object') {
                  displayValue = `${value.from || '∞'} - ${value.to || '∞'}`;
                }
                
                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {config.label}: {displayValue}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilter(key, '')}
                      className="h-auto p-0 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InstantFilter;