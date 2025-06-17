import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
        axios.get(`${Base_Url}/products/products/`),
        axios.get(`${Base_Url}/products/planted-products/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProducts(productRes.data.results);  // explicitly access .results
      setUserProducts(plantedRes.data.results || plantedRes.data);  // explicitly handle planted products correctly
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [user.id, token]);


  const handleDelete = async (productId: number) => {
    try {
      await axios.delete(`${Base_Url}/products/planted-products/${productId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Failed to delete planted product", err);
    }
  };

  if (loading) return <p className="text-center text-sm my-10">Loading products...</p>;
  if (error) return <p className="text-center text-sm text-red-500 my-10">{error}</p>;

  return (
    <div className={cn("min-h-screen", actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50")}>
      <Sidebar />
      <div className="w-full container mx-2 px-2 py-8 max-w-6xl">
        <header className="mb-6 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-green-500" />
          <h1 className={cn("text-3xl font-bold", actualTheme === "dark" ? "text-white" : "text-gray-900")}>Product Control</h1>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
  <Card className="shadow-sm overflow-auto">
    <CardHeader>
      <CardTitle>Products</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-2">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md"
        >
          <span className="truncate">{product.name}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/product-control/add/${product.id}`)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </CardContent>
  </Card>

  <Card className="shadow-sm overflow-auto">
    <CardHeader>
      <CardTitle>My Planted Products</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-2">
      {userProducts.length > 0 ? (
        userProducts.map((planted) => (
          <div
            key={planted.id}
            className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md"
          >
            <span className="truncate">{planted.product_name}</span>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/product-control/edit/${planted.id}`)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(planted.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-center py-4">No products added yet.</p>
      )}
    </CardContent>
  </Card>
</section>

      </div>
    </div>
  );
};

export default ProductControl;
