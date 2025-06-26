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
import { useTranslation } from "react-i18next";

const ProductControl = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [nextProductsUrl, setNextProductsUrl] = useState(
    `${Base_Url}/products/products/`,
  );
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = userStore((state) => state.user);
  const token = localStorage.getItem("access_token");
  const { t } = useTranslation();

  const fetchNextProducts = async () => {
    if (!nextProductsUrl) return;
    try {
      const res = await axios.get(nextProductsUrl);
      const fetched = res.data.results || res.data;
      const combined = [...products, ...fetched];
      combined.sort((a, b) => a.name.localeCompare(b.name));
      setProducts(combined);
      setNextProductsUrl(res.data.next);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Failed to load products.");
    }
  };

  const fetchPlantedProducts = async () => {
    try {
      const res = await axios.get(
        `${Base_Url}/products/planted-products/?owner=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUserProducts(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch planted products", err);
      setError("Failed to load planted products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextProducts();
    fetchPlantedProducts();
  }, [user.id, token]);

  const handleDelete = async (productId: number) => {
    try {
      await axios.delete(
        `${Base_Url}/products/planted-products/${productId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUserProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Failed to delete planted product", err);
    }
  };

  if (loading)
    return <p className="text-center text-sm my-10">{t("loading_pr")}.</p>;
  if (error)
    return <p className="text-center text-sm text-red-500 my-10">{error}</p>;

  return (
    <div
      className={cn(
        "min-h-screen flex gap-1",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      <div className="w-full flex flex-col container py-8">
        <header className="mb-6 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-green-500" />
          <h1
            className={cn(
              "text-3xl font-bold",
              actualTheme === "dark" ? "text-white" : "text-gray-900",
            )}
          >
            {t("product_control")}
          </h1>
        </header>

        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
          <Card className="shadow-sm overflow-auto">
            <CardHeader>
              <CardTitle>{t("products")} (A–Z)</CardTitle>
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
                    onClick={() =>
                      navigate(`/product-control/add/${product.id}`)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {nextProductsUrl && (
                <Button
                  onClick={fetchNextProducts}
                  variant="secondary"
                  className="mt-2 w-full"
                >
                  {t("load_more")}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm overflow-auto">
            <CardHeader>
              <CardTitle>{t("my_pr")}</CardTitle>
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
                        onClick={() =>
                          navigate(`/product-control/edit/${planted.id}`)
                        }
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
                <p className="text-sm text-center py-4">
                  {t("no_pr")}
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
      <Sidebar />
    </div>
  );
};

export default ProductControl;
