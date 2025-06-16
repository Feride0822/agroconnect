import { useState } from "react";
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
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Download,
  Filter,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Leaf,
} from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import { Base_Url } from "@/App";


const Statistics = () => {
  const { actualTheme } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [timeFrame, setTimeFrame] = useState<string>("monthly");
  const [regions, setRegions] = useState<any[]>([]);
const [loadingRegions, setLoadingRegions] = useState<boolean>(true);


  // Prepare comparative data
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

  // Filter data based on selections
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

  useEffect(() => {
  const fetchRegions = async () => {
    setLoadingRegions(true);
    try {
      const response = await axios.get(`${Base_Url}/regions/`);
      setRegions(response.data);
    } catch (error) {
      console.error("Error fetching regions:", error);
      setRegions([]);
    } finally {
      setLoadingRegions(false);
    }
  };

  fetchRegions();
}, []);


  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      <Sidebar />

      <div className="flex-1 md:mr-80">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                  Analytics Center
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

          {/* Filters Panel */}
          <Card
            className={cn(
              "mb-8",
              actualTheme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200",
            )}
          >
            <CardHeader>
              <CardTitle
                className={cn(
                  "flex items-center",
                  actualTheme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                <Filter className="h-6 w-6 mr-3 text-green-500" />
                Data Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1">
                <div>
                  <label
                    className={cn(
                      "text-sm font-medium mb-3 block",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Region Analysis
                  </label>
                  <Select
  value={selectedRegion}
  onValueChange={setSelectedRegion}
  disabled={loadingRegions}
>
  <SelectTrigger
    className={cn(
      actualTheme === "dark"
        ? "bg-gray-700 border-gray-600 text-white"
        : "bg-white border-gray-300",
    )}
  >
    <SelectValue placeholder="Select region" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Regions</SelectItem>
    {regions.map((region) => (
      <SelectItem key={region.id} value={region.id}>
        {region.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                </div>

                {/* <div>
                  <label
                    className={cn(
                      "text-sm font-medium mb-3 block",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Product Focus
                  </label>
                  <Select
                    value={selectedProduct}
                    onValueChange={setSelectedProduct}
                  >
                    <SelectTrigger
                      className={cn(
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300",
                      )}
                    >
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}

                {/* <div>
                  <label
                    className={cn(
                      "text-sm font-medium mb-3 block",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Time Horizon
                  </label>
                  <Select value={timeFrame} onValueChange={setTimeFrame}>
                    <SelectTrigger
                      className={cn(
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300",
                      )}
                    >
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly Analysis</SelectItem>
                      <SelectItem value="monthly">Monthly Trends</SelectItem>
                      <SelectItem value="quarterly">
                        Quarterly Review
                      </SelectItem>
                      <SelectItem value="yearly">Annual Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

              </div>
            </CardContent>
          </Card>

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList
              className={cn(
                "grid w-full grid-cols-4",
                actualTheme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200",
              )}
            >
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="regional"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Regional
              </TabsTrigger>
              <TabsTrigger
                value="trends"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trends
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Leaf className="h-4 w-4 mr-2" />
                Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <RegionalStats />

              {/* Key Insights */}
              <Card
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "flex items-center text-2xl",
                      actualTheme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    <img src="/AgroConnect 2.png" alt="Logo" className="w-8 h-8 mr-3"/>
                    {/* <Leaf className="h-6 w-6 mr-3 text-green-500" /> */}
                    Key Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div
                      className={cn(
                        "p-6 rounded-xl border border-green-500/20",
                        actualTheme === "dark"
                          ? "bg-green-900/20"
                          : "bg-green-50",
                      )}
                    >
                      <h3 className="font-bold text-green-600 text-lg mb-3">
                        Top Performing Region
                      </h3>
                      <p
                        className={cn(
                          "text-xl font-bold mb-2",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        {
                          comparativeData.reduce((max, current) =>
                            current.totalVolume > max.totalVolume
                              ? current
                              : max,
                          ).region
                        }
                      </p>
                      <p className="text-green-600 text-sm mb-3">
                        {comparativeData
                          .reduce((max, current) =>
                            current.totalVolume > max.totalVolume
                              ? current
                              : max,
                          )
                          .totalVolume.toLocaleString()}{" "}
                        tons produced
                      </p>
                      <div
                        className={cn(
                          "w-full rounded-full h-2",
                          actualTheme === "dark"
                            ? "bg-green-900/30"
                            : "bg-green-200",
                        )}
                      >
                        <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "p-6 rounded-xl border border-blue-500/20",
                        actualTheme === "dark"
                          ? "bg-blue-900/20"
                          : "bg-blue-50",
                      )}
                    >
                      <h3 className="font-bold text-blue-600 text-lg mb-3">
                        Highest Efficiency
                      </h3>
                      <p
                        className={cn(
                          "text-xl font-bold mb-2",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        {
                          comparativeData.reduce((max, current) =>
                            current.efficiency > max.efficiency ? current : max,
                          ).region
                        }
                      </p>
                      <p className="text-blue-600 text-sm mb-3">
                        {comparativeData
                          .reduce((max, current) =>
                            current.efficiency > max.efficiency ? current : max,
                          )
                          .efficiency.toFixed(2)}{" "}
                        tons/hectare
                      </p>
                      <div
                        className={cn(
                          "w-full rounded-full h-2",
                          actualTheme === "dark"
                            ? "bg-blue-900/30"
                            : "bg-blue-200",
                        )}
                      >
                        <div className="bg-blue-500 h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "p-6 rounded-xl border border-purple-500/20",
                        actualTheme === "dark"
                          ? "bg-purple-900/20"
                          : "bg-purple-50",
                      )}
                    >
                      <h3 className="font-bold text-purple-600 text-lg mb-3">
                        Total Production
                      </h3>
                      <p
                        className={cn(
                          "text-xl font-bold mb-2",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        {comparativeData
                          .reduce((sum, region) => sum + region.totalVolume, 0)
                          .toLocaleString()}{" "}
                        tons
                      </p>
                      <p className="text-purple-600 text-sm mb-3">
                        Across all regions this month
                      </p>
                      <div
                        className={cn(
                          "w-full rounded-full h-2",
                          actualTheme === "dark"
                            ? "bg-purple-900/30"
                            : "bg-purple-200",
                        )}
                      >
                        <div className="bg-purple-500 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regional" className="space-y-8">
              <Card
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "flex items-center text-xl",
                      actualTheme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                    Regional Performance Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getFilteredData()}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={
                            actualTheme === "dark" ? "#374151" : "#e5e7eb"
                          }
                        />
                        <XAxis
                          dataKey="region"
                          tick={{
                            fontSize: 12,
                            fill:
                              actualTheme === "dark" ? "#d1d5db" : "#6b7280",
                          }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis
                          tick={{
                            fontSize: 12,
                            fill:
                              actualTheme === "dark" ? "#d1d5db" : "#6b7280",
                          }}
                        />
                        <Tooltip
                          formatter={(value: number) => [
                            `${value.toLocaleString()} tons`,
                            "Production",
                          ]}
                          contentStyle={{
                            backgroundColor:
                              actualTheme === "dark" ? "#1f2937" : "#ffffff",
                            border: `1px solid ${actualTheme === "dark" ? "#374151" : "#e5e7eb"}`,
                            borderRadius: "8px",
                            color:
                              actualTheme === "dark" ? "#ffffff" : "#000000",
                          }}
                        />
                        <Bar
                          dataKey="totalVolume"
                          fill="#10b981"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "flex items-center text-xl",
                      actualTheme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Efficiency Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getFilteredData()}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={
                            actualTheme === "dark" ? "#374151" : "#e5e7eb"
                          }
                        />
                        <XAxis
                          dataKey="region"
                          tick={{
                            fontSize: 12,
                            fill:
                              actualTheme === "dark" ? "#d1d5db" : "#6b7280",
                          }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis
                          tick={{
                            fontSize: 12,
                            fill:
                              actualTheme === "dark" ? "#d1d5db" : "#6b7280",
                          }}
                        />
                        <Tooltip
                          formatter={(value: number) => [
                            `${value.toFixed(2)} tons/ha`,
                            "Efficiency",
                          ]}
                          contentStyle={{
                            backgroundColor:
                              actualTheme === "dark" ? "#1f2937" : "#ffffff",
                            border: `1px solid ${actualTheme === "dark" ? "#374151" : "#e5e7eb"}`,
                            borderRadius: "8px",
                            color:
                              actualTheme === "dark" ? "#ffffff" : "#000000",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="efficiency"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-8">
              <Card
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "flex items-center text-xl",
                      actualTheme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Production Trends by Product
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={
                            actualTheme === "dark" ? "#374151" : "#e5e7eb"
                          }
                        />
                        <XAxis
                          dataKey="month"
                          tick={{
                            fontSize: 12,
                            fill:
                              actualTheme === "dark" ? "#d1d5db" : "#6b7280",
                          }}
                        />
                        <YAxis
                          tick={{
                            fontSize: 12,
                            fill:
                              actualTheme === "dark" ? "#d1d5db" : "#6b7280",
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor:
                              actualTheme === "dark" ? "#1f2937" : "#ffffff",
                            border: `1px solid ${actualTheme === "dark" ? "#374151" : "#e5e7eb"}`,
                            borderRadius: "8px",
                            color:
                              actualTheme === "dark" ? "#ffffff" : "#000000",
                          }}
                        />
                        {products.map((product, index) => {
                          const colors = [
                            "#10b981",
                            "#3b82f6",
                            "#8b5cf6",
                            "#f59e0b",
                            "#ef4444",
                          ];
                          return (
                            <Line
                              key={product.id}
                              type="monotone"
                              dataKey={product.name}
                              stroke={colors[index % colors.length]}
                              strokeWidth={3}
                              dot={{ r: 6, strokeWidth: 2 }}
                              activeDot={{ r: 8, strokeWidth: 2 }}
                            />
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-8">
              <Card
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "flex items-center text-xl",
                      actualTheme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    <img src="/AgroConnect 2.png" alt="Logo" className="w-8 h-8 mr-3"/>
                    {/* <Leaf className="h-5 w-5 mr-2 text-green-500" /> */}
                    Agricultural Market Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-orange-600 mb-6">
                        Growth Opportunities
                      </h3>
                      <div className="space-y-4">
                        {regions
                          .filter(
                            (region) =>
                              getTotalVolumeByRegion(region.id) /
                                region.agriculturalArea <
                              2.0,
                          )
                          .slice(0, 3)
                          .map((region) => (
                            <div
                              key={region.id}
                              className={cn(
                                "p-4 rounded-xl border border-orange-500/20",
                                actualTheme === "dark"
                                  ? "bg-orange-900/20"
                                  : "bg-orange-50",
                              )}
                            >
                              <h4 className="font-bold text-orange-600 text-lg">
                                {region.name}
                              </h4>
                              <p
                                className={cn(
                                  "mb-2",
                                  actualTheme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-700",
                                )}
                              >
                                Efficiency:{" "}
                                {(
                                  getTotalVolumeByRegion(region.id) /
                                  region.agriculturalArea
                                ).toFixed(2)}{" "}
                                tons/ha
                              </p>
                              <p className="text-orange-600 text-sm">
                                Potential for improvement through better farming
                                techniques
                              </p>
                              <div
                                className={cn(
                                  "w-full rounded-full h-2 mt-3",
                                  actualTheme === "dark"
                                    ? "bg-orange-900/30"
                                    : "bg-orange-200",
                                )}
                              >
                                <div
                                  className="bg-orange-500 h-2 rounded-full"
                                  style={{ width: "35%" }}
                                ></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-green-600 mb-6">
                        High Performers
                      </h3>
                      <div className="space-y-4">
                        {regions
                          .filter(
                            (region) =>
                              getTotalVolumeByRegion(region.id) /
                                region.agriculturalArea >
                              2.5,
                          )
                          .slice(0, 3)
                          .map((region) => (
                            <div
                              key={region.id}
                              className={cn(
                                "p-4 rounded-xl border border-green-500/20",
                                actualTheme === "dark"
                                  ? "bg-green-900/20"
                                  : "bg-green-50",
                              )}
                            >
                              <h4 className="font-bold text-green-600 text-lg">
                                {region.name}
                              </h4>
                              <p
                                className={cn(
                                  "mb-2",
                                  actualTheme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-700",
                                )}
                              >
                                Efficiency:{" "}
                                {(
                                  getTotalVolumeByRegion(region.id) /
                                  region.agriculturalArea
                                ).toFixed(2)}{" "}
                                tons/ha
                              </p>
                              <p className="text-green-600 text-sm">
                                Excellent farming practices and resource
                                utilization
                              </p>
                              <div
                                className={cn(
                                  "w-full rounded-full h-2 mt-3",
                                  actualTheme === "dark"
                                    ? "bg-green-900/30"
                                    : "bg-green-200",
                                )}
                              >
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: "95%" }}
                                ></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
