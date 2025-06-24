import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/layout/Sidebar";
import ProductChart from "@/components/agricultural/ProductChart";
import PriceTracker from "@/components/agricultural/PriceTracker";
import {
  products,
  regions,
  getTotalVolumeByRegion,
} from "@/lib/agricultural-data";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Users,
  AlertTriangle,
  Leaf,
  Zap,
  Target,
  Activity,
  TreePine,
  Wheat,
} from "lucide-react";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import userStore from "@/store/UserStore";
import { Base_Url } from "@/App";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { actualTheme } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
   const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = userStore((state) => state.login);
  const { t } = useTranslation();

  // Calculate key metrics
  const totalProduction = regions.reduce(
    (sum, region) => sum + getTotalVolumeByRegion(region.id),
    0,
  );

  const averagePrice =
    products.reduce((sum, product) => sum + product.currentPrice, 0) /
    products.length;

  const priceChanges = products.map((product) => {
    if (product.priceHistory.length < 2) return 0;
    const first = product.priceHistory[0].price;
    const last = product.priceHistory[product.priceHistory.length - 1].price;
    return ((last - first) / first) * 100;
  });

  const averagePriceChange =
    priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;

  const unstableProducts = products.filter((product) => {
    if (product.priceHistory.length < 2) return false;
    const prices = product.priceHistory.map((p) => p.price);
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance =
      prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) /
      prices.length;
    const stability = Math.max(0, 100 - (Math.sqrt(variance) / avg) * 100);
    return stability < 70;
  });
//   useEffect(() => {
//   const access_token = searchParams.get("access_token");
//   const refresh_token = searchParams.get("refresh_token");

//   if (access_token && refresh_token) {
//     localStorage.setItem("access_token", access_token);
//     localStorage.setItem("refresh_token", refresh_token);

//     const fetchUserDetails = async () => {
//       try {
//         const response = await fetch(`${Base_Url}/accounts/profile/`, {
//           headers: { Authorization: `Bearer ${access_token}` },
//         });

//         if (!response.ok) throw new Error("Token verification failed");

//         const userData = await response.json();
//         login(userData, access_token);
//       } catch (error) {
//         console.error("Error:", error);
//         navigate("/login", { state: { message: "Login failed, please retry." } });
//       }
//     };

//     fetchUserDetails();
//   } else {
//     navigate("/login");
//   }
// }, [searchParams, login, navigate]);


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
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-4">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl",
                  actualTheme === "dark" ? "bg-green-600" : "bg-green-500",
                )}
              >
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1
                  className={cn(
                    "text-4xl font-bold",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  {t("agri_dashboard")}
                </h1>
                <p
                  className={cn(
                    "text-lg",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  {t("dash_navbar")}
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card
              className={cn(
                "hover:shadow-lg transition-all duration-300",
                actualTheme === "dark"
                  ? "bg-gray-800 border-gray-700 hover:border-green-600/50"
                  : "bg-white border-gray-200 hover:border-green-500/50",
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  className={cn(
                    "text-sm font-medium",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Total Production
                </CardTitle>
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg",
                    actualTheme === "dark"
                      ? "bg-green-600/20"
                      : "bg-green-500/20",
                  )}
                >
                  <TreePine className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "text-3xl font-bold",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  {totalProduction.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% vs last month
                </p>
              </CardContent>
            </Card>

            <Card
              className={cn(
                "hover:shadow-lg transition-all duration-300",
                actualTheme === "dark"
                  ? "bg-gray-800 border-gray-700 hover:border-green-600/50"
                  : "bg-white border-gray-200 hover:border-green-500/50",
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  className={cn(
                    "text-sm font-medium",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Average Price
                </CardTitle>
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg",
                    actualTheme === "dark"
                      ? "bg-green-600/20"
                      : "bg-green-500/20",
                  )}
                >
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "text-3xl font-bold",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  ${averagePrice.toFixed(0)}
                </div>
                <div className="flex items-center text-xs mt-2">
                  {averagePriceChange > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span
                    className={
                      averagePriceChange > 0 ? "text-green-600" : "text-red-500"
                    }
                  >
                    {averagePriceChange > 0 ? "+" : ""}
                    {averagePriceChange.toFixed(1)}% change
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card
              className={cn(
                "hover:shadow-lg transition-all duration-300",
                actualTheme === "dark"
                  ? "bg-gray-800 border-gray-700 hover:border-green-600/50"
                  : "bg-white border-gray-200 hover:border-green-500/50",
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  className={cn(
                    "text-sm font-medium",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Active Regions
                </CardTitle>
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg",
                    actualTheme === "dark"
                      ? "bg-green-600/20"
                      : "bg-green-500/20",
                  )}
                >
                  <Users className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "text-3xl font-bold",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  {regions.length}
                </div>
                <p className="text-xs text-green-600 flex items-center mt-2">
                  <Zap className="h-3 w-3 mr-1" />
                  All regions active
                </p>
              </CardContent>
            </Card>

            <Card
              className={cn(
                "hover:shadow-lg transition-all duration-300",
                actualTheme === "dark"
                  ? "bg-gray-800 border-gray-700 hover:border-orange-600/50"
                  : "bg-white border-gray-200 hover:border-orange-500/50",
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  className={cn(
                    "text-sm font-medium",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Price Alerts
                </CardTitle>
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg",
                    actualTheme === "dark"
                      ? "bg-orange-600/20"
                      : "bg-orange-500/20",
                  )}
                >
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn("text-3xl font-bold text-orange-500")}>
                  {unstableProducts.length}
                </div>
                <p className="text-xs text-orange-500 flex items-center mt-2">
                  <Target className="h-3 w-3 mr-1" />
                  Needs attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Price Alerts */}
          {unstableProducts.length > 0 && (
            <Card
              className={cn(
                "mb-8 border-l-4 border-l-orange-500",
                actualTheme === "dark"
                  ? "bg-orange-900/20 border-orange-800/50"
                  : "bg-orange-50 border-orange-200",
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  Market Alert Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {unstableProducts.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border",
                        actualTheme === "dark"
                          ? "bg-orange-900/30 border-orange-800/50"
                          : "bg-orange-100 border-orange-200",
                      )}
                    >
                      <div>
                        <span
                          className={cn(
                            "font-medium",
                            actualTheme === "dark"
                              ? "text-white"
                              : "text-gray-900",
                          )}
                        >
                          {product.name}
                        </span>
                        <p className="text-orange-600 text-sm">
                          High volatility detected
                        </p>
                      </div>
                      <Badge className="bg-orange-500 text-white border-0">
                        RISK
                      </Badge>
                    </div>
                  ))}
                </div>
                {unstableProducts.length > 3 && (
                  <p className="text-orange-600 text-sm mt-4 text-center">
                    +{unstableProducts.length - 3} more products flagged for
                    review
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Product Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {products.slice(0, 4).map((product) => (
              <ProductChart key={product.id} product={product} />
            ))}
          </div>

          {/* Price Stability Tracker */}
          <div className="mb-8">
            <PriceTracker />
          </div>

          {/* Regional Performance */}
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
                <img
                  src="/AgroConnect 2.png"
                  alt="Logo"
                  className="h-8 w-8 mr-3"
                />
                {/* <Leaf className="h-6 w-6 mr-3 text-green-500" /> */}
                Regional Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {regions.slice(0, 8).map((region) => {
                  const volume = getTotalVolumeByRegion(region.id);
                  const productivity = volume / region.agriculturalArea;
                  const efficiency =
                    productivity > 2.5
                      ? "Excellent"
                      : productivity > 2.0
                        ? "Good"
                        : "Poor";
                  const efficiencyColor =
                    productivity > 2.5
                      ? "text-green-500"
                      : productivity > 2.0
                        ? "text-yellow-500"
                        : "text-red-500";

                  return (
                    <div
                      key={region.id}
                      className={cn(
                        "p-6 rounded-xl border transition-all duration-300 hover:shadow-lg",
                        actualTheme === "dark"
                          ? "bg-gray-700/50 border-gray-600 hover:border-green-600/50"
                          : "bg-gray-50 border-gray-200 hover:border-green-500/50",
                      )}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3
                          className={cn(
                            "font-bold text-lg",
                            actualTheme === "dark"
                              ? "text-white"
                              : "text-gray-900",
                          )}
                        >
                          {region.name}
                        </h3>
                        <Activity className="h-5 w-5 text-green-500" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span
                            className={cn(
                              actualTheme === "dark"
                                ? "text-gray-300"
                                : "text-gray-600",
                            )}
                          >
                            Production:
                          </span>
                          <span
                            className={cn(
                              "font-medium",
                              actualTheme === "dark"
                                ? "text-white"
                                : "text-gray-900",
                            )}
                          >
                            {volume.toLocaleString()}t
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span
                            className={cn(
                              actualTheme === "dark"
                                ? "text-gray-300"
                                : "text-gray-600",
                            )}
                          >
                            Efficiency:
                          </span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Badge
                                className={cn(
                                  efficiencyColor,
                                  "bg-transparent border cursor-pointer hover:opacity-80 transition-opacity",
                                  productivity > 2.5
                                    ? "border-green-500/30"
                                    : productivity > 2.0
                                      ? "border-yellow-500/30"
                                      : "border-red-500/30",
                                )}
                                onClick={() =>
                                  setSelectedRegion({
                                    ...region,
                                    productivity,
                                    efficiency,
                                    volume,
                                  })
                                }
                              >
                                {efficiency}
                              </Badge>
                            </DialogTrigger>
                            <DialogContent
                              className={cn(
                                "max-w-2xl",
                                actualTheme === "dark"
                                  ? "bg-gray-800 border-gray-700"
                                  : "bg-white border-gray-200",
                              )}
                            >
                              <DialogHeader>
                                <DialogTitle
                                  className={cn(
                                    "flex items-center space-x-2",
                                    actualTheme === "dark"
                                      ? "text-white"
                                      : "text-gray-900",
                                  )}
                                >
                                  <Activity className="h-6 w-6 text-green-500" />
                                  <span>
                                    Efficiency Analysis - {region.name}
                                  </span>
                                </DialogTitle>
                              </DialogHeader>

                              <div className="space-y-6 py-4">
                                {/* Current Performance */}
                                <div
                                  className={cn(
                                    "p-4 rounded-lg border",
                                    actualTheme === "dark"
                                      ? "bg-gray-700/50 border-gray-600"
                                      : "bg-gray-50 border-gray-200",
                                  )}
                                >
                                  <h3
                                    className={cn(
                                      "font-semibold mb-3 flex items-center",
                                      actualTheme === "dark"
                                        ? "text-white"
                                        : "text-gray-900",
                                    )}
                                  >
                                    <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                                    Current Performance
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p
                                        className={cn(
                                          "text-sm",
                                          actualTheme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-600",
                                        )}
                                      >
                                        Productivity Rate
                                      </p>
                                      <p className="text-2xl font-bold text-green-500">
                                        {productivity.toFixed(2)} t/ha
                                      </p>
                                    </div>
                                    <div>
                                      <p
                                        className={cn(
                                          "text-sm",
                                          actualTheme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-600",
                                        )}
                                      >
                                        Efficiency Status
                                      </p>
                                      <Badge
                                        className={cn(
                                          efficiencyColor,
                                          "bg-transparent border text-lg px-3 py-1",
                                          productivity > 2.5
                                            ? "border-green-500/30"
                                            : productivity > 2.0
                                              ? "border-yellow-500/30"
                                              : "border-red-500/30",
                                        )}
                                      >
                                        {efficiency}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                      <span
                                        className={cn(
                                          actualTheme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-600",
                                        )}
                                      >
                                        Performance Score
                                      </span>
                                      <span
                                        className={cn(
                                          "font-medium",
                                          actualTheme === "dark"
                                            ? "text-white"
                                            : "text-gray-900",
                                        )}
                                      >
                                        {Math.min(
                                          100,
                                          (productivity / 3) * 100,
                                        ).toFixed(0)}
                                        %
                                      </span>
                                    </div>
                                    <Progress
                                      value={Math.min(
                                        100,
                                        (productivity / 3) * 100,
                                      )}
                                      className="h-3"
                                    />
                                  </div>
                                </div>

                                {/* Detailed Metrics */}
                                <div
                                  className={cn(
                                    "p-4 rounded-lg border",
                                    actualTheme === "dark"
                                      ? "bg-gray-700/50 border-gray-600"
                                      : "bg-gray-50 border-gray-200",
                                  )}
                                >
                                  <h3
                                    className={cn(
                                      "font-semibold mb-3 flex items-center",
                                      actualTheme === "dark"
                                        ? "text-white"
                                        : "text-gray-900",
                                    )}
                                  >
                                    <Target className="h-5 w-5 mr-2 text-green-500" />
                                    Detailed Metrics
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center p-3 rounded border border-gray-200 dark:border-gray-600">
                                      <Wheat className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                      <p
                                        className={cn(
                                          "text-sm",
                                          actualTheme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-600",
                                        )}
                                      >
                                        Total Production
                                      </p>
                                      <p
                                        className={cn(
                                          "text-lg font-bold",
                                          actualTheme === "dark"
                                            ? "text-white"
                                            : "text-gray-900",
                                        )}
                                      >
                                        {volume.toLocaleString()}t
                                      </p>
                                    </div>
                                    <div className="text-center p-3 rounded border border-gray-200 dark:border-gray-600">
                                      <TreePine className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                      <p
                                        className={cn(
                                          "text-sm",
                                          actualTheme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-600",
                                        )}
                                      >
                                        Agricultural Area
                                      </p>
                                      <p
                                        className={cn(
                                          "text-lg font-bold",
                                          actualTheme === "dark"
                                            ? "text-white"
                                            : "text-gray-900",
                                        )}
                                      >
                                        {region.agriculturalArea.toLocaleString()}{" "}
                                        ha
                                      </p>
                                    </div>
                                    <div className="text-center p-3 rounded border border-gray-200 dark:border-gray-600">
                                      <Zap className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                      <p
                                        className={cn(
                                          "text-sm",
                                          actualTheme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-600",
                                        )}
                                      >
                                        Efficiency Index
                                      </p>
                                      <p
                                        className={cn(
                                          "text-lg font-bold",
                                          actualTheme === "dark"
                                            ? "text-white"
                                            : "text-gray-900",
                                        )}
                                      >
                                        {(productivity * 10).toFixed(0)}/30
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Improvement Suggestions */}
                                {productivity <= 2.0 && (
                                  <div
                                    className={cn(
                                      "p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
                                    )}
                                  >
                                    <h3 className="font-semibold mb-3 flex items-center text-red-700 dark:text-red-400">
                                      <AlertTriangle className="h-5 w-5 mr-2" />
                                      Improvement Recommendations
                                    </h3>
                                    <ul className="space-y-2 text-sm text-red-600 dark:text-red-300">
                                      <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>
                                          Consider implementing modern
                                          irrigation systems to improve water
                                          efficiency
                                        </span>
                                      </li>
                                      <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>
                                          Explore soil health improvement
                                          through crop rotation and organic
                                          fertilizers
                                        </span>
                                      </li>
                                      <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>
                                          Invest in precision agriculture
                                          technologies for better resource
                                          management
                                        </span>
                                      </li>
                                      <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>
                                          Provide farmer training programs on
                                          best agricultural practices
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                )}

                                {/* Benchmark Comparison */}
                                <div
                                  className={cn(
                                    "p-4 rounded-lg border",
                                    actualTheme === "dark"
                                      ? "bg-gray-700/50 border-gray-600"
                                      : "bg-gray-50 border-gray-200",
                                  )}
                                >
                                  <h3
                                    className={cn(
                                      "font-semibold mb-3 flex items-center",
                                      actualTheme === "dark"
                                        ? "text-white"
                                        : "text-gray-900",
                                    )}
                                  >
                                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                                    Performance Benchmarks
                                  </h3>
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <span
                                        className={cn(
                                          "text-sm",
                                          actualTheme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-600",
                                        )}
                                      >
                                        Poor (&lt; 2.0 t/ha)
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <div className="w-16 h-2 bg-red-200 dark:bg-red-800 rounded"></div>
                                        <span className="text-sm text-red-500">
                                          Below Average
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span
                                        className={cn(
                                          "text-sm",
                                          actualTheme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-600",
                                        )}
                                      >
                                        Good (2.0 - 2.5 t/ha)
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <div className="w-16 h-2 bg-yellow-200 dark:bg-yellow-800 rounded"></div>
                                        <span className="text-sm text-yellow-500">
                                          Average
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span
                                        className={cn(
                                          "text-sm",
                                          actualTheme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-600",
                                        )}
                                      >
                                        Excellent (&gt; 2.5 t/ha)
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <div className="w-16 h-2 bg-green-200 dark:bg-green-800 rounded"></div>
                                        <span className="text-sm text-green-500">
                                          Above Average
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div
                          className={cn(
                            "w-full rounded-full h-2",
                            actualTheme === "dark"
                              ? "bg-gray-600"
                              : "bg-gray-200",
                          )}
                        >
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, (productivity / 3) * 100)}%`,
                            }}
                          ></div>
                        </div>

                        <p
                          className={cn(
                            "text-xs",
                            actualTheme === "dark"
                              ? "text-gray-400"
                              : "text-gray-500",
                          )}
                        >
                          {productivity.toFixed(2)} tons/hectare
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
