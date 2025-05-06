import { Button } from "./ui/button";
import { useLocation } from "wouter";

const MainNavigation = () => {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto py-3 no-scrollbar">
          <Button
            variant="ghost"
            className={`px-4 py-2 mr-4 font-medium ${
              location === "/" || location === "" 
                ? "text-primary border-b-2 border-primary" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Inventory
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 mr-4 text-gray-500 hover:text-gray-700 font-medium"
          >
            Categories
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 mr-4 text-gray-500 hover:text-gray-700 font-medium"
          >
            Reports
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 mr-4 text-gray-500 hover:text-gray-700 font-medium"
          >
            Settings
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
