import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/layout/Sidebar";
import RegionalStats from "@/components/agricultural/RegionalStats";
import {
  products,
  regions,
  getVolumeByProduct,
  getVolumeByRegion,
  getTotalVolumeByRegion,
} from "@/lib/agricultural-data";
import { cn } from "@/lib/utils";
import {
  Download,
  Filter,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Leaf,
} from "lucide-react";

const ProductControl = () => {
  const { actualTheme } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [timeFrame, setTimeFrame] = useState<string>("monthly");

  const comparativeData = regions.map((region) => {
    const regionProducts = products.map((product) => {
      const productVolumes = getVolumeByRegion(region.id).filter(
        (v) => v.productId === product.id,
      );
      const totalVolume = productVolumes.reduce((sum, v) => sum + v.volume, 0);
      return {
        product: product.name,
        volume: totalVolume,
      };
    });

    return {
      region: region.name,
      totalVolume: getTotalVolumeByRegion(region.id),
      products: regionProducts,
      efficiency: getTotalVolumeByRegion(region.id) / region.agriculturalArea,
    };
  });

  // Prepare trend data (monthly)
  const trendData = ["January", "February", "March", "April"].map((month) => {
    const monthData: any = { month };

    products.forEach((product) => {
      const volumes = regions.map((region) => {
        const regionVolumes = getVolumeByRegion(region.id).filter(
          (v) => v.productId === product.id && v.month === month,
        );
        return regionVolumes.reduce((sum, v) => sum + v.volume, 0);
      });
      monthData[product.name] = volumes.reduce((sum, v) => sum + v, 0);
    });

    return monthData;
  });

  const getFilteredData = () => {
    if (selectedRegion === "all" && selectedProduct === "all") {
      return comparativeData;
    }

    let filtered = [...comparativeData];

    if (selectedRegion !== "all") {
      filtered = filtered.filter((data) => {
        const region = regions.find((r) => r.name === data.region);
        return region?.id === selectedRegion;
      });
    }

    return filtered;
  };

  const exportData = () => {
    const data = getFilteredData();
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Region,Total Volume,Efficiency\n" +
      data
        .map((d) => `${d.region},${d.totalVolume},${d.efficiency.toFixed(2)}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agricultural_statistics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      <Sidebar />
      <div>
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12">
            <div className="flex items-center space-x-4 mb-6 lg:mb-0">
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
                    "text-5xl font-bold",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  Product Center
                </h1>
                <p
                  className={cn(
                    "text-xl",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Comprehensive agricultural data insights across Uzbekistan
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={exportData}
                className="bg-green-500 hover:bg-green-600 text-white shadow-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default ProductControl;
