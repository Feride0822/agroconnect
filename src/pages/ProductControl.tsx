import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { BarChart3, Plus } from "lucide-react";
import axios from "axios";
import { Base_Url } from "@/App";
import { useNavigate } from "react-router-dom";

type Product = {
  id: number;
  name: string;
};

const ProductControl = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${Base_Url}/products/`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setError("Failed to load products from server.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-12 text-sm">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-12 text-sm">{error}</p>;
  }

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50"
      )}
    >
      <Sidebar />
      <div className="flex-1 md:mr-80">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center space-x-4 mb-10">
            <div
              className={cn(
                "flex items-center justify-center w-14 h-14 rounded-xl",
                actualTheme === "dark" ? "bg-green-600" : "bg-green-500"
              )}
            >
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1
                className={cn(
                  "text-4xl font-bold",
                  actualTheme === "dark" ? "text-white" : "text-gray-900"
                )}
              >
                Product Control
              </h1>
              <p
                className={cn(
                  "text-lg",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-600"
                )}
              >
                Manage and view production data by product.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle
                    className={cn(
                      "text-xl font-semibold",
                      actualTheme === "dark" ? "text-white" : "text-gray-900"
                    )}
                  >
                    {product.name}
                  </CardTitle>
                  <Button
  variant="outline"
  onClick={() => navigate(`/product/add/${product.id}`)}
>
  Add
</Button>

                </CardHeader>
                <CardContent>
                  <p
                    className={cn(
                      "text-sm",
                      actualTheme === "dark" ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    View or add detailed statistics for this product.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductControl;
