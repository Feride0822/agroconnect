import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Import Button component
import { Plus } from "lucide-react"; // Import Plus icon
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { products } from "@/lib/agricultural-data"; // Keep products data
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const RegionalAdds = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate(); // Initialize navigate hook

  // Function to handle navigation to the add product page
  const handleAddProductClick = () => {
    navigate("/products/add"); // Navigate to your desired add product page route
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product List Table Card */}
      <Card
        className={cn(
          "lg:col-span-1", // Adjusted to take 1 column for the product list
          actualTheme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200",
        )}
      >
        <CardHeader>
          <CardTitle
            className={cn(
              "flex items-center text-xl",
              actualTheme === "dark" ? "text-white" : "text-gray-900",
            )}
          >
            <img src="/AgroConnect 2.png" alt="Logo" className="w-8 h-8 mr-3" />
            Product List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={cn(
                    "border-b",
                    actualTheme === "dark"
                      ? "border-gray-600"
                      : "border-gray-200",
                  )}
                >
                  <th
                    className={cn(
                      "text-left py-4 px-4 font-semibold", // Aligned left for names
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Product Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id} // Use product.id for key
                    className={cn(
                      "border-b transition-colors",
                      actualTheme === "dark"
                        ? "border-gray-700 hover:bg-gray-700/50"
                        : "border-gray-100 hover:bg-gray-50",
                    )}
                  >
                    <td
                      className={cn(
                        "py-4 px-4 font-medium",
                        actualTheme === "dark"
                          ? "text-white"
                          : "text-gray-900",
                      )}
                    >
                      {product.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Product Control Card */}
      <Card
        className={cn(
          "lg:col-span-1", // Takes 1 column for the control section
          actualTheme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200",
        )}
      >
        <CardHeader>
          <CardTitle
            className={cn(
              "flex items-center text-xl",
              actualTheme === "dark" ? "text-white" : "text-gray-900",
            )}
          >
            Product Control
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[calc(100%-80px)]"> {/* Adjust height for content alignment */}
          <Button
            onClick={handleAddProductClick}
            className={cn(
              "flex items-center justify-center px-6 py-3 rounded-full text-lg font-semibold transition-colors",
              actualTheme === "dark"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white",
            )}
          >
            <Plus className="h-6 w-6 mr-2" />
            Add New Product
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegionalAdds;