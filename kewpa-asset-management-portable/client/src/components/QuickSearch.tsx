import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Package, 
  Building2, 
  Users, 
  FileText,
  ArrowRight,
  Clock,
  Filter,
  X
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'asset' | 'inventory' | 'supplier' | 'movement' | 'inspection' | 'maintenance';
  path: string;
  score: number;
  highlights?: string[];
}

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickSearch = ({ isOpen, onClose }: QuickSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filters, setFilters] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  // Fetch all searchable data
  const { data: assets } = useQuery({
    queryKey: ['/api/assets'],
    enabled: isOpen,
  });

  const { data: inventory } = useQuery({
    queryKey: ['/api/inventory'],
    enabled: isOpen,
  });

  const { data: suppliers } = useQuery({
    queryKey: ['/api/suppliers'],
    enabled: isOpen,
  });

  const { data: movements } = useQuery({
    queryKey: ['/api/movements'],
    enabled: isOpen,
  });

  const { data: inspections } = useQuery({
    queryKey: ['/api/inspections'],
    enabled: isOpen,
  });

  const { data: maintenance } = useQuery({
    queryKey: ['/api/maintenance'],
    enabled: isOpen,
  });

  // Fuzzy matching function
  const fuzzyMatch = (text: string, query: string): { score: number; highlights: string[] } => {
    if (!query) return { score: 0, highlights: [] };
    
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Exact match gets highest score
    if (textLower.includes(queryLower)) {
      return { score: 100, highlights: [query] };
    }
    
    // Character matching with position scoring
    let score = 0;
    let queryIndex = 0;
    const highlights: string[] = [];
    
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        score += (queryLower.length - queryIndex) * 2; // Earlier matches score higher
        queryIndex++;
      }
    }
    
    // Bonus for matching word boundaries
    const words = textLower.split(/\s+/);
    for (const word of words) {
      if (word.startsWith(queryLower)) {
        score += 50;
        highlights.push(word);
        break;
      }
    }
    
    return { score: queryIndex === queryLower.length ? score : 0, highlights };
  };

  // Search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];

    // Search assets
    if (assets && Array.isArray(assets) && (!filters.length || filters.includes('asset'))) {
      assets.forEach((asset: any) => {
        const titleMatch = fuzzyMatch(asset.name || "", searchQuery);
        const tagMatch = fuzzyMatch(asset.assetTag || "", searchQuery);
        const categoryMatch = fuzzyMatch(asset.category || "", searchQuery);
        const departmentMatch = fuzzyMatch(asset.department || "", searchQuery);
        
        const maxScore = Math.max(titleMatch.score, tagMatch.score, categoryMatch.score, departmentMatch.score);
        
        if (maxScore > 0) {
          searchResults.push({
            id: `asset-${asset.id}`,
            title: asset.name || `Asset ${asset.assetTag}`,
            subtitle: `${asset.category} • ${asset.department} • Tag: ${asset.assetTag}`,
            category: 'asset',
            path: `/assets?highlight=${asset.id}`,
            score: maxScore,
            highlights: [...titleMatch.highlights, ...tagMatch.highlights, ...categoryMatch.highlights]
          });
        }
      });
    }

    // Search inventory
    if (inventory && Array.isArray(inventory) && (!filters.length || filters.includes('inventory'))) {
      inventory.forEach((item: any) => {
        const nameMatch = fuzzyMatch(item.name || "", searchQuery);
        const skuMatch = fuzzyMatch(item.sku || "", searchQuery);
        const categoryMatch = fuzzyMatch(item.category || "", searchQuery);
        
        const maxScore = Math.max(nameMatch.score, skuMatch.score, categoryMatch.score);
        
        if (maxScore > 0) {
          searchResults.push({
            id: `inventory-${item.id}`,
            title: item.name || `Item ${item.sku}`,
            subtitle: `${item.category} • SKU: ${item.sku} • Qty: ${item.quantity}`,
            category: 'inventory',
            path: `/inventory?highlight=${item.id}`,
            score: maxScore,
            highlights: [...nameMatch.highlights, ...skuMatch.highlights, ...categoryMatch.highlights]
          });
        }
      });
    }

    // Search suppliers
    if (suppliers && Array.isArray(suppliers) && (!filters.length || filters.includes('supplier'))) {
      suppliers.forEach((supplier: any) => {
        const nameMatch = fuzzyMatch(supplier.name || "", searchQuery);
        const contactMatch = fuzzyMatch(supplier.contactPerson || "", searchQuery);
        
        const maxScore = Math.max(nameMatch.score, contactMatch.score);
        
        if (maxScore > 0) {
          searchResults.push({
            id: `supplier-${supplier.id}`,
            title: supplier.name || "Unnamed Supplier",
            subtitle: `Contact: ${supplier.contactPerson} • ${supplier.email}`,
            category: 'supplier',
            path: `/suppliers?highlight=${supplier.id}`,
            score: maxScore,
            highlights: [...nameMatch.highlights, ...contactMatch.highlights]
          });
        }
      });
    }

    // Search movements
    if (movements && Array.isArray(movements) && (!filters.length || filters.includes('movement'))) {
      movements.forEach((movement: any) => {
        const typeMatch = fuzzyMatch(movement.movementType || "", searchQuery);
        const fromMatch = fuzzyMatch(movement.fromLocation || "", searchQuery);
        const toMatch = fuzzyMatch(movement.toLocation || "", searchQuery);
        
        const maxScore = Math.max(typeMatch.score, fromMatch.score, toMatch.score);
        
        if (maxScore > 0) {
          searchResults.push({
            id: `movement-${movement.id}`,
            title: `${movement.movementType} Movement`,
            subtitle: `From: ${movement.fromLocation} → To: ${movement.toLocation}`,
            category: 'movement',
            path: `/asset-movement?highlight=${movement.id}`,
            score: maxScore,
            highlights: [...typeMatch.highlights, ...fromMatch.highlights, ...toMatch.highlights]
          });
        }
      });
    }

    // Search inspections
    if (inspections && Array.isArray(inspections) && (!filters.length || filters.includes('inspection'))) {
      inspections.forEach((inspection: any) => {
        const typeMatch = fuzzyMatch(inspection.inspectionType || "", searchQuery);
        const statusMatch = fuzzyMatch(inspection.status || "", searchQuery);
        
        const maxScore = Math.max(typeMatch.score, statusMatch.score);
        
        if (maxScore > 0) {
          searchResults.push({
            id: `inspection-${inspection.id}`,
            title: `${inspection.inspectionType} Inspection`,
            subtitle: `Status: ${inspection.status} • ${inspection.inspectionDate}`,
            category: 'inspection',
            path: `/asset-inspection?highlight=${inspection.id}`,
            score: maxScore,
            highlights: [...typeMatch.highlights, ...statusMatch.highlights]
          });
        }
      });
    }

    // Search maintenance
    if (maintenance && Array.isArray(maintenance) && (!filters.length || filters.includes('maintenance'))) {
      maintenance.forEach((record: any) => {
        const typeMatch = fuzzyMatch(record.maintenanceType || "", searchQuery);
        const statusMatch = fuzzyMatch(record.status || "", searchQuery);
        
        const maxScore = Math.max(typeMatch.score, statusMatch.score);
        
        if (maxScore > 0) {
          searchResults.push({
            id: `maintenance-${record.id}`,
            title: `${record.maintenanceType} Maintenance`,
            subtitle: `Status: ${record.status} • ${record.scheduledDate}`,
            category: 'maintenance',
            path: `/asset-maintenance?highlight=${record.id}`,
            score: maxScore,
            highlights: [...typeMatch.highlights, ...statusMatch.highlights]
          });
        }
      });
    }

    // Sort by score and limit results
    const sortedResults = searchResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    setResults(sortedResults);
    setSelectedIndex(0);
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, filters, assets, inventory, suppliers, movements, inspections, maintenance]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            setLocation(results[selectedIndex].path);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, setLocation, onClose]);

  const categoryIcons = {
    asset: <Building2 className="h-4 w-4" />,
    inventory: <Package className="h-4 w-4" />,
    supplier: <Users className="h-4 w-4" />,
    movement: <ArrowRight className="h-4 w-4" />,
    inspection: <Search className="h-4 w-4" />,
    maintenance: <Clock className="h-4 w-4" />
  };

  const categoryColors = {
    asset: "bg-blue-100 text-blue-800",
    inventory: "bg-green-100 text-green-800",
    supplier: "bg-purple-100 text-purple-800",
    movement: "bg-orange-100 text-orange-800",
    inspection: "bg-yellow-100 text-yellow-800",
    maintenance: "bg-red-100 text-red-800"
  };

  const toggleFilter = (category: string) => {
    setFilters(prev => 
      prev.includes(category) 
        ? prev.filter(f => f !== category)
        : [...prev, category]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 pt-20">
        <Card className="mx-auto max-w-3xl shadow-2xl">
          <CardContent className="p-0">
            {/* Search Header */}
            <div className="flex items-center gap-3 p-4 border-b">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search assets, inventory, suppliers, and more..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 text-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 p-4 border-b bg-muted/20">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter by:</span>
              {['asset', 'inventory', 'supplier', 'movement', 'inspection', 'maintenance'].map((category) => (
                <Button
                  key={category}
                  variant={filters.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(category)}
                  className="h-7 text-xs"
                >
                  {categoryIcons[category as keyof typeof categoryIcons]}
                  <span className="ml-1 capitalize">{category}</span>
                </Button>
              ))}
              {filters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters([])}
                  className="h-7 text-xs text-muted-foreground"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Results */}
            <ScrollArea className="max-h-96">
              {results.length > 0 ? (
                <div className="p-2">
                  {results.map((result, index) => (
                    <Link key={result.id} href={result.path}>
                      <div
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                          index === selectedIndex ? "bg-muted" : "hover:bg-muted/50"
                        )}
                        onClick={onClose}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background border">
                          {categoryIcons[result.category]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{result.title}</h4>
                            <Badge 
                              variant="secondary" 
                              className={cn("text-xs", categoryColors[result.category])}
                            >
                              {result.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {result.subtitle}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : query ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try different keywords or check filters</p>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Start typing to search...</p>
                  <p className="text-sm mt-1">Search assets, inventory, suppliers, and more</p>
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {results.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-muted/20 border-t text-xs text-muted-foreground">
                <span>{results.length} results found</span>
                <div className="flex items-center gap-4">
                  <span>↑↓ to navigate</span>
                  <span>↵ to select</span>
                  <span>ESC to close</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickSearch;