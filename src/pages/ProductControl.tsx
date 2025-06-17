import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { BarChart3, Pencil, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { Base_Url } from "@/App";
import { useNavigate } from "react-router-dom";
import userStore from "@/store/UserStore";

const ProductControl = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = userStore((state) => state.user);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, plantedRes] = await Promise.all([
          // This call fetches all general products, accessible by any user
          axios.get(`${Base_Url}/products/products/`),
          // This call fetches only planted products owned by the authenticated user.
          // The backend's get_queryset handles filtering by self.request.user.
          axios.get(`${Base_Url}/products/planted-products/`, {
            // MODIFIED: Removed ?owner=${user.id}
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setProducts(productRes.data);
        setUserProducts(plantedRes.data);
      } catch (err) {
        console.error("Error loading data", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id, token]); // user.id and token are still dependencies to re-fetch if they change

  const handleDelete = async (productId: number) => {
    try {
      await axios.delete(
        `${Base_Url}/products/planted-products/${productId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // await axios.post(
      //   `${Base_Url}/accounts/log-activity/`,
      //   {
      //     action: "DELETE",
      //     model_name: "PlantedProduct",
      //     object_name: `Deleted planted product ID: ${productId}`,
      //   },
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   },
      // );

      setUserProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Failed to delete planted product", err);
    }
  };

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
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      <Sidebar />
      <div className="flex-1 md:mr-80">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center space-x-4 mb-10">
            <div
              className={cn(
                "flex items-center justify-center w-14 h-14 rounded-xl",
                actualTheme === "dark" ? "bg-green-600" : "bg-green-500",
              )}
            >
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1
                className={cn(
                  "text-4xl font-bold",
                  actualTheme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                Product Control
              </h1>
              <p
                className={cn(
                  "text-lg",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                )}
              >
                Manage and view production data by product.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2
                className={cn(
                  "text-2xl font-bold mb-4",
                  actualTheme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                Products
              </h2>
              <div className="grid gap-6">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className={cn(
                      actualTheme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200",
                    )}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle
                        className={cn(
                          "text-xl font-semibold",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        {product.name}
                      </CardTitle>
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate(`/product-control/add/${product.id}`)
                        }
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {userProducts.length > 0 && (
              <div>
                <h2
                  className={cn(
                    "text-2xl font-bold mb-4",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  My Planted Products
                </h2>
                <div className="grid gap-6">
                  {userProducts.map((planted) => (
                    <Card
                      key={planted.id}
                      className={cn(
                        actualTheme === "dark"
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200",
                      )}
                    >
                      <CardHeader className="flex items-center justify-between">
                        <CardTitle
                          className={cn(
                            "text-lg",
                            actualTheme === "dark"
                              ? "text-white"
                              : "text-gray-900",
                          )}
                        >
                          {planted.product_name}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() =>
                              navigate(`/product-control/edit/${planted.id}`)
                            }
                          >
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(planted.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {userProducts.length === 0 && (
              <div>
                <h2
                  className={cn(
                    "text-2xl font-bold mb-4",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  My Planted Products
                </h2>
                <p
                  className={cn(
                    "text-sm text-center",
                    actualTheme === "dark" ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  You haven’t added any products yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductControl;
