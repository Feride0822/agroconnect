import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Base_Url } from "@/App";

type Product = {
  product_name: string;
  planting_area: number;
  expecting_weight: number;
  wph: number;
  planted_records: number;
};

const RegionalStats = () => {
  const { actualTheme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${Base_Url}/products/wph/region-product/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load product data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-sm">Loading product statistics...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-sm">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card
        className={cn(
          "lg:col-span-2",
          actualTheme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        )}
      >
        <CardHeader>
          <CardTitle
            className={cn(
              "flex items-center text-xl",
              actualTheme === "dark" ? "text-white" : "text-gray-900"
            )}
          >
            <img
              src="/AgroConnect 2.png"
              alt="Logo"
              className="w-8 h-8 mr-3"
            />
            Product Performance Overview
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
                      : "border-gray-200"
                  )}
                >
                  <th
                    className={cn(
                      "text-left py-4 px-4 font-semibold",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    )}
                  >
                    Product
                  </th>
                  <th
                    className={cn(
                      "text-right py-4 px-4 font-semibold",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    )}
                  >
                    Agricultural Area (ha)
                  </th>
                  <th
                    className={cn(
                      "text-right py-4 px-4 font-semibold",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    )}
                  >
                    Total Production (tons)
                  </th>
                  <th
                    className={cn(
                      "text-right py-4 px-4 font-semibold",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    )}
                  >
                    Efficiency Score (WPH)
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  return (
                    <tr
                      key={index}
                      className={cn(
                        "border-b transition-colors",
                        actualTheme === "dark"
                          ? "border-gray-700 hover:bg-gray-700/50"
                          : "border-gray-100 hover:bg-gray-50"
                      )}
                    >
                      <td
                        className={cn(
                          "py-4 px-4 font-medium",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        )}
                      >
                        {product.product_name}
                      </td>
                      <td
                        className={cn(
                          "text-right py-4 px-4",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-600"
                        )}
                      >
                        {product.planting_area.toLocaleString()}
                      </td>
                      <td
                        className={cn(
                          "text-right py-4 px-4",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-600"
                        )}
                      >
                        {product.expecting_weight.toLocaleString()}
                      </td>
                      <td className="text-right py-4 px-4">
                        <span
                          className={cn(
                            "inline-flex px-3 py-1 rounded-full text-xs font-medium border",
                            product.wph > 2.5
                              ? "bg-green-500/20 text-green-500 border-green-500/30"
                              : product.wph > 2.0
                              ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                              : "bg-red-500/20 text-red-500 border-red-500/30"
                          )}
                        >
                          {product.wph.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegionalStats;
