import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Base_Url } from "@/App";
import userStore from "@/store/UserStore";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type Region = {
  id: number;
  name: string;
};

type Product = {
  id: number; // PlantedProduct ID
  product: {
    id: number;
    name: string;
  };
  planting_area: string;
  expecting_weight: string;
  region: number;
  owner: number;
};

const formSchema = z.object({
  planting_area: z.string().min(1, { message: "Planting area is required." }),
  expecting_weight: z
    .string()
    .min(1, { message: "Expected volume is required." }),
  selectedRegion: z.string().min(1, { message: "Region is required." }),
});

const ProductEdit = () => {
  const { actualTheme } = useTheme();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = userStore();

  const [efficiency, setEfficiency] = useState<number | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const { t, i18n } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planting_area: "",
      expecting_weight: "",
      selectedRegion: "",
    },
  });

  useEffect(() => {
    // Fetch regions
    axios
      .get(`${Base_Url}/regions/`, {
        headers: {
          'Accept-Language': i18n.language
        }
      })
      .then((res) => {
        setRegions(res.data);
        setLoadingRegions(false);
      })
      .catch((err) => {
        console.error("Failed to load regions", err);
        toast.error("Failed to load regions.");
        setLoadingRegions(false);
      });

    // Fetch product data (the specific PlantedProduct to edit)
    if (productId) {
      axios
        .get(`${Base_Url}/products/planted-products/${productId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            'Accept-Language': i18n.language
          },
        })
        .then((res) => {
          setProduct(res.data);
          form.reset({
            planting_area: res.data.planting_area.toString(),
            expecting_weight: res.data.expecting_weight.toString(),
            selectedRegion: res.data.region.toString(),
          });
          setLoadingProduct(false);
        })
        .catch((err) => {
          console.error("Failed to load product", err);
          toast.error(
            "Failed to load product data. Make sure it's your product.",
          );
          setLoadingProduct(false);
        });
    }
  }, [productId, form, i18n.language]);

  const calculateEfficiency = () => {
    const area = parseFloat(form.getValues("planting_area"));
    const volume = parseFloat(form.getValues("expecting_weight"));
    if (!isNaN(area) && !isNaN(volume) && area > 0) {
      setEfficiency(volume / area);
    } else {
      setEfficiency(null);
      toast.error(
        "Please enter valid numbers for planting area and expected volume.",
      );
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!product) {
      toast.error("Product data not loaded. Cannot save changes.");
      return;
    }

    try {
      const payload = {
        planting_area: parseFloat(values.planting_area),
        expecting_weight: parseFloat(values.expecting_weight),
        region: parseInt(values.selectedRegion),
        owner: user.id, // MODIFIED: Explicitly send owner ID
        product: product.product.id,
      };

      await axios.put(
        `${Base_Url}/products/planted-products/${productId}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            'Accept-Language': i18n.language
          },
        },
      );
      toast.success("Product updated successfully!");
      navigate("/profile"); // Redirect to profile page after successful update
    } catch (error) {
      console.error("Failed to update product:", error);
      // More detailed error message from backend if available
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        toast.error(
          `Failed to update product: ${JSON.stringify(error.response.data)}`,
        );
      } else {
        toast.error("Failed to update product. Please try again.");
      }
    }
  };

  if (loadingProduct || loadingRegions) {
    return (
      <div
        className={cn(
          "flex min-h-screen",
          actualTheme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-900",
        )}
      >
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p>{t("load_data")}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className={cn(
          "flex min-h-screen",
          actualTheme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-900",
        )}
      >
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p>{t("pr_notfound")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-screen",
        actualTheme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900",
      )}
    >
      <div className="flex-1 p-8">
        <Card
          className={cn(
            "w-full max-w-2xl mx-auto",
            actualTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <CardHeader>
            <CardTitle
              className={cn(
                "text-2xl font-bold",
                actualTheme === "dark" ? "text-white" : "text-gray-900",
              )}
            >
              {t("edit_pr")}: {product.product.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="planting_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("pl_area")} ({t("hectares")})
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter planting area"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expecting_weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("ex_vol")} (tons)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter expected volume"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selectedRegion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("region")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loadingRegions}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem
                              key={region.id}
                              value={region.id.toString()}
                            >
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={calculateEfficiency}
                  className="mr-3"
                >
                  {t("cal_eff")}
                </Button>
                {efficiency !== null && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded">
                    <strong>{t("eff")}:</strong> {efficiency.toFixed(2)}{" "}
                    {t("ton_hec")}
                  </div>
                )}

                <Button type="submit" className="mt-4 bg-green-800">
                  {t("save_chn")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Sidebar />
    </div>
  );
};

export default ProductEdit;