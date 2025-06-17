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
import { toast } from "sonner"; // Assuming sonner is used for toasts

type Region = {
  id: number;
  name: string;
};

const ProductAdd = () => {
  const { actualTheme } = useTheme();
  const { productId } = useParams(); // This productId is for the 'general product' type to add, not a planted product ID
  const navigate = useNavigate();

  const { user } = userStore();

  const [planting_area, setArea] = useState("");
  const [expecting_weight, setExpectedVolume] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [efficiency, setEfficiency] = useState<number | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);

  useEffect(() => {
    axios.get(`${Base_Url}/regions/`)
      .then(res => {
        setRegions(res.data);
        setLoadingRegions(false);
      })
      .catch(err => {
        console.error("Failed to load regions", err);
        toast.error("Failed to load regions.");
        setLoadingRegions(false);
      });
  }, []);

  const calculateEfficiency = () => {
    const area = parseFloat(planting_area);
    const volume = parseFloat(expecting_weight);
    if (!isNaN(area) && !isNaN(volume) && area > 0) {
      setEfficiency(volume / area);
    } else {
      setEfficiency(null);
      toast.error("Please enter valid numbers for planting area and expected volume.");
    }
  };

  const handleSubmit = async () => {
  if (!planting_area || !expecting_weight || selectedRegion === null || !productId) {
    toast.error("Please fill all required fields and ensure a product type is selected.");
    return;
  }

  try {
    const payload = {
      owner: user.id,  // Explicitly include owner here
      product: parseInt(productId),
      planting_area: parseFloat(planting_area),
      expecting_weight: parseFloat(expecting_weight),
      region: selectedRegion,
    };

    await axios.post(`${Base_Url}/products/planted-products/`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    toast.success("Product added successfully!");
    navigate("/profile");
  } catch (error: any) {
    console.error("Failed to add product:", error.response.data);
    toast.error(`Failed to add product: ${JSON.stringify(error.response.data)}`);
  }
};

  return (
    <div className={cn("flex min-h-screen", actualTheme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900")}>
      <Sidebar />
      <div className="flex-1 p-8">
        <Card className={cn("w-full max-w-2xl mx-auto", actualTheme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
          <CardHeader>
            <CardTitle className={cn("text-2xl font-bold", actualTheme === "dark" ? "text-white" : "text-gray-900")}>Add New Planted Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="planting_area">Planting Area (hectares)</Label>
                <Input
                  id="planting_area"
                  type="number"
                  value={planting_area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter planting area"
                />
              </div>
              <div>
                <Label htmlFor="expecting_weight">Expected Volume (tons)</Label>
                <Input
                  id="expecting_weight"
                  type="number"
                  value={expecting_weight}
                  onChange={(e) => setExpectedVolume(e.target.value)}
                  placeholder="Enter expected volume"
                />
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <Select value={selectedRegion?.toString() || ""} onValueChange={(value) => setSelectedRegion(Number(value))} disabled={loadingRegions}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id.toString()}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateEfficiency} className="mr-3">Calculate Efficiency</Button>
              {efficiency !== null && (
                <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded">
                  <strong>Efficiency:</strong> {efficiency.toFixed(2)} tons/hectare
                </div>
              )}
              <Button onClick={handleSubmit} className="mt-4 bg-green-800">Submit Product</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductAdd;