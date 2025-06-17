import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Base_Url } from "@/App";
import userStore from "@/store/UserStore";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Save, X } from "lucide-react";

type Region = {
  id: number;
  name: string;
};

type PlantedProduct = {
  id: number;
  owner: number;
  region: number;
  product: number;
  product_name: string; // Assuming you'll get product name from backend
  planting_area: number;
  expecting_weight: number;
  efficiency: number;
};

const ProductEdit = () => {
  const { actualTheme } = useTheme();
  const { plantedProductId } = useParams<{ plantedProductId: string }>(); // Get the ID from the URL
  const navigate = useNavigate();

  const { user } = userStore();
  const token = localStorage.getItem("access_token");

  const [planting_area, setArea] = useState("");
  const [expecting_weight, setExpectedVolume] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [efficiency, setEfficiency] = useState<number | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch regions
    axios.get(`${Base_Url}/regions/`)
      .then(res => {
        setRegions(res.data);
        setLoadingRegions(false);
      })
      .catch(err => {
        console.error("Failed to load regions:", err);
        setError("Failed to load regions.");
        setLoadingRegions(false);
      });

    // Fetch existing planted product data
    if (plantedProductId) {
      axios.get<PlantedProduct>(`${Base_Url}/products/planted-products/${plantedProductId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          const data = res.data;
          setArea(data.planting_area.toString());
          setExpectedVolume(data.expecting_weight.toString());
          setSelectedRegion(data.region);
          setEfficiency(data.efficiency);
          setLoadingProduct(false);
        })
        .catch(err => {
          console.error("Failed to load planted product:", err);
          setError("Failed to load product data.");
          setLoadingProduct(false);
        });
    }
  }, [plantedProductId, token]);

  const calculateEfficiency = () => {
    const areaNum = parseFloat(planting_area);
    const volumeNum = parseFloat(expecting_weight);
    if (areaNum > 0 && volumeNum > 0) {
      setEfficiency(volumeNum / areaNum);
    } else {
      alert("Please enter valid numbers for area and expected volume.");
      setEfficiency(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRegion || efficiency === null) {
      alert("Please select a region and calculate efficiency before submitting.");
      return;
    }

    setIsSaving(true);
    setError(null);

    // const dataToSend = {
    //   region: selectedRegion,
    //   planting_area: parseFloat(planting_area),
    //   expecting_weight: parseFloat(expecting_weight),
    //   efficiency: efficiency
    // };

    try {
      const response = await axios.put(`${Base_Url}/products/planted-products/${plantedProductId}/`, plantedProductId, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Log activity for profile
        await axios.post(`${Base_Url}/accounts/recent-activities/`, {
          action: "UPDATE",
          model_name: "PlantedProduct",
          object_name: `Updated planted product ID: ${plantedProductId}`,
          // You might want to include more specific details about what was updated
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        alert("Product updated successfully!");
        navigate("/product-control");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      setError("Failed to update product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingProduct || loadingRegions) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50")}>
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
        <p className={cn("ml-3 text-lg", actualTheme === "dark" ? "text-gray-300" : "text-gray-600")}>Loading product data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50")}>
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <Button onClick={() => navigate("/product-control")} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50")}>
      <Sidebar />
      <div className="container mx-auto py-10 max-w-3xl">
        <Card className={cn(actualTheme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
          <CardHeader>
            <CardTitle className={cn(actualTheme === "dark" ? "text-white" : "text-gray-900")}>Edit Product Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="planting_area" className={cn(actualTheme === "dark" ? "text-gray-300" : "text-gray-700")}>Area (hectares)</Label>
                <Input
                  id="planting_area"
                  value={planting_area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter area in hectares"
                  className={cn(actualTheme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300")}
                />
              </div>
              <div>
                <Label htmlFor="expecting_weight" className={cn(actualTheme === "dark" ? "text-gray-300" : "text-gray-700")}>Expected Volume (tons)</Label>
                <Input
                  id="expecting_weight"
                  value={expecting_weight}
                  onChange={(e) => setExpectedVolume(e.target.value)}
                  placeholder="Enter expected volume"
                  className={cn(actualTheme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300")}
                />
              </div>
              <div>
                <Label htmlFor="region" className={cn(actualTheme === "dark" ? "text-gray-300" : "text-gray-700")}>Region</Label>
                <Select
                  value={selectedRegion?.toString() || ""}
                  onValueChange={(value) => setSelectedRegion(Number(value))}
                  disabled={loadingRegions}
                >
                  <SelectTrigger className={cn(actualTheme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300")}>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent className={cn(actualTheme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200")}>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id.toString()} className={cn(actualTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100")}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateEfficiency} className="mr-3 bg-green-600 hover:bg-green-700 text-white">Calculate Efficiency</Button>
              {efficiency !== null && (
                <div className={cn("mt-4 p-3 rounded", actualTheme === "dark" ? "bg-green-900/30 border border-green-800 text-green-300" : "bg-green-100 border border-green-200 text-green-800")}>
                  <strong>Efficiency:</strong> {efficiency.toFixed(2)} tons/hectare
                </div>
              )}
              {error && (
                <div className={cn("mt-4 p-3 rounded text-red-700", actualTheme === "dark" ? "bg-red-900/30 border border-red-800 text-red-300" : "bg-red-100 border border-red-200")}>
                  {error}
                </div>
              )}
              <div className="flex space-x-2 mt-4">
                <Button onClick={handleSubmit} className="bg-green-800 hover:bg-green-900 text-white" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button onClick={() => navigate("/product-control")} variant="outline" className={cn(actualTheme === "dark" ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50")}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductEdit;