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

type Region = {
  id: number;
  name: string;
};

const ProductAdd = () => {
  const { actualTheme } = useTheme();
  const { productId } = useParams();
  const navigate = useNavigate();

  const { user } = userStore();

  const [area, setArea] = useState("");
  const [expectedVolume, setExpectedVolume] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [efficiency, setEfficiency] = useState<number | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);

  useEffect(() => {
    axios.get(`${Base_Url}/api/regions/`)
      .then(res => {
        setRegions(res.data);
        setLoadingRegions(false);
      })
      .catch(err => {
        console.error("Failed to load regions:", err);
        setLoadingRegions(false);
      });
  }, []);

  const calculateEfficiency = () => {
    const areaNum = parseFloat(area);
    const volumeNum = parseFloat(expectedVolume);
    if (areaNum > 0 && volumeNum > 0) {
      setEfficiency(volumeNum / areaNum);
    } else {
      alert("Please enter valid numbers for area and expected volume.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedRegion || !efficiency) {
      alert("Please select a region and calculate efficiency before submitting.");
      return;
    }

    const dataToSend = {
      user_id: user.id,
      region_id: selectedRegion,
      product_id: productId,
      planting_area: parseFloat(area),
      expecting_weight: parseFloat(expectedVolume),
      efficiency: efficiency
    };

    try {
      const response = await axios.post(`${Base_Url}/products/add/`, dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      if (response.status === 201) {
        alert("Product added successfully!");
        navigate("/product/control");
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className={cn("min-h-screen", actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50")}>
      <Sidebar />
      <div className="container mx-auto py-10 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Add Product Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Area (hectares)</Label>
                <Input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter area in hectares"
                />
              </div>
              <div>
                <Label>Expected Volume (tons)</Label>
                <Input
                  value={expectedVolume}
                  onChange={(e) => setExpectedVolume(e.target.value)}
                  placeholder="Enter expected volume"
                />
              </div>
              <div>
                <Label>Region</Label>
                <Select value={selectedRegion?.toString()} onValueChange={(value) => setSelectedRegion(Number(value))} disabled={loadingRegions}>
                  <SelectTrigger>
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
              <Button onClick={calculateEfficiency}>Calculate Efficiency</Button>
              {efficiency !== null && (
                <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded">
                  <strong>Efficiency:</strong> {efficiency.toFixed(2)} tons/hectare
                </div>
              )}
              <Button onClick={handleSubmit} className="mt-4">Submit Product</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductAdd;
