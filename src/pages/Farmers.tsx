import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/layout/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  farmers,
  getFarmersByRegion,
  getFarmersBySpecialization,
  getTotalFarmValue,
  getTotalProductArea,
  getAverageYieldPerHectare,
  getRegionName,
  type Farmer,
} from "@/lib/farmers-data";
import { regions } from "@/lib/agricultural-data";
import {
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  Leaf,
  Search,
  Filter,
  MessageCircle,
  Award,
  Calendar,
  Truck,
  DollarSign,
  Package,
  Shield,
  Globe,
  ChevronRight,
  Contact,
} from "lucide-react";

const Farmers = () => {
  const { actualTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("all");
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  // Filter farmers based on search and filters
  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.specialization.some((spec) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesRegion =
      selectedRegion === "all" || farmer.regionId === selectedRegion;

    const matchesSpecialization =
      selectedSpecialization === "all" ||
      farmer.specialization.some((spec) =>
        spec.toLowerCase().includes(selectedSpecialization.toLowerCase()),
      );

    return matchesSearch && matchesRegion && matchesSpecialization;
  });

  const specializations = Array.from(
    new Set(farmers.flatMap((farmer) => farmer.specialization)),
  );

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;

  const getQualityColor = (grade: "A" | "B" | "C") => {
    switch (grade) {
      case "A":
        return "bg-green-500 text-white";
      case "B":
        return "bg-yellow-500 text-white";
      case "C":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  useEffect(() => {
    if(selectedFarmer) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [selectedFarmer]);

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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div
                className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-xl",
                  actualTheme === "dark" ? "bg-green-600" : "bg-green-500",
                )}
              >
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1
                  className={cn(
                    "text-5xl font-bold",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  Farmers Network
                </h1>
                <p
                  className={cn(
                    "text-xl",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Connect with verified farmers and explore their premium
                  products
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
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
                Search & Filter Farmers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                  <label
                    className={cn(
                      "text-sm font-medium mb-2 block",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Search Farmers
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, farm, or specialization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={cn(
                        "pl-10",
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300",
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={cn(
                      "text-sm font-medium mb-2 block",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Region
                  </label>
                  <Select
                    value={selectedRegion}
                    onValueChange={setSelectedRegion}
                  >
                    <SelectTrigger
                      className={cn(
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300",
                      )}
                    >
                      <SelectValue placeholder="All Regions" />
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

                <div>
                  <label
                    className={cn(
                      "text-sm font-medium mb-2 block",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Specialization
                  </label>
                  <Select
                    value={selectedSpecialization}
                    onValueChange={setSelectedSpecialization}
                  >
                    <SelectTrigger
                      className={cn(
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300",
                      )}
                    >
                      <SelectValue placeholder="All Specializations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec.toLowerCase()}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div
            className={cn(
              "mb-6 text-sm",
              actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
            )}
          >
            Showing {filteredFarmers.length} of {farmers.length} farmers
          </div>

          {/* Farmers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFarmers.map((farmer) => (
              <Card
                key={farmer.id}
                className={cn(
                  "hover:shadow-lg transition-all duration-300 cursor-pointer",
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700 hover:border-green-600/50"
                    : "bg-white border-gray-200 hover:border-green-500/50",
                )}
                onClick={() => setSelectedFarmer(farmer)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={farmer.profileImage} alt="Avatar Image"/>
                        <AvatarFallback className="bg-green-500 text-white text-lg font-bold">
                          {farmer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3
                          className={cn(
                            "text-xl font-bold",
                            actualTheme === "dark"
                              ? "text-white"
                              : "text-gray-900",
                          )}
                        >
                          {farmer.name}
                        </h3>
                        <p className="text-green-500 font-medium">
                          {farmer.farmName}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span
                            className={cn(
                              "text-xs",
                              actualTheme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500",
                            )}
                          >
                            {getRegionName(farmer.regionId)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {farmer.verified && (
                        <Badge className="bg-green-500 text-white border-0">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span
                          className={cn(
                            "text-sm font-medium",
                            actualTheme === "dark"
                              ? "text-white"
                              : "text-gray-900",
                          )}
                        >
                          {farmer.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Farm Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700",
                        )}
                      >
                        Farm Size
                      </p>
                      <p
                        className={cn(
                          "text-lg font-bold",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        {farmer.farmSize} ha
                      </p>
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700",
                        )}
                      >
                        Experience
                      </p>
                      <p
                        className={cn(
                          "text-lg font-bold",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        {farmer.experience} years
                      </p>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium mb-2",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      Specializations
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {farmer.specialization.slice(0, 2).map((spec, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={cn(
                            "text-xs",
                            actualTheme === "dark"
                              ? "border-gray-600 text-gray-300"
                              : "border-gray-300 text-gray-600",
                          )}
                        >
                          {spec}
                        </Badge>
                      ))}
                      {farmer.specialization.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-xs text-green-500 border-green-500"
                        >
                          +{farmer.specialization.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Available Products */}
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium mb-2",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      Available Products (
                      {farmer.products.filter((p) => p.available).length})
                    </p>
                    <div className="space-y-2">
                      {farmer.products
                        .filter((p) => p.available)
                        .slice(0, 2)
                        .map((product) => (
                          <div
                            key={product.id}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-lg",
                              actualTheme === "dark"
                                ? "bg-gray-700/50"
                                : "bg-gray-50",
                            )}
                          >
                            <div>
                              <p
                                className={cn(
                                  "font-medium text-sm",
                                  actualTheme === "dark"
                                    ? "text-white"
                                    : "text-gray-900",
                                )}
                              >
                                {product.name}
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500",
                                )}
                              >
                                {product.amount} {product.unit} • {product.area}{" "}
                                ha
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-green-500 font-bold text-sm">
                                {formatPrice(product.pricePerUnit)}/
                                {product.unit}
                              </p>
                              <Badge
                                className={`text-xs ${getQualityColor(product.qualityGrade)}`}
                              >
                                Grade {product.qualityGrade}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Contact & Total Value */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm">
                      <p
                        className={cn(
                          "font-medium",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700",
                        )}
                      >
                        Total Value
                      </p>
                      <p className="text-green-500 font-bold text-lg">
                        {formatPrice(getTotalFarmValue(farmer))}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredFarmers.length === 0 && (
            <Card
              className={cn(
                "text-center py-12",
                actualTheme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200",
              )}
            >
              <CardContent>
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3
                  className={cn(
                    "text-xl font-bold mb-2",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  No Farmers Found
                </h3>
                <p
                  className={cn(
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Try adjusting your search criteria or filters to find farmers.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Farmer Detail Modal/Drawer */}
      {selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className={cn(
              "w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl",
              actualTheme === "dark" ? "bg-gray-800" : "bg-white",
            )}
          >
            <div className="sticky z-10 top-0 bg-inherit border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2
                className={cn(
                  "text-2xl font-bold",
                  actualTheme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                {selectedFarmer.name} - Profile Details
              </h2>
              <Button
                variant="outline"
                onClick={() => setSelectedFarmer(null)}
                className={cn(
                  actualTheme === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50",
                )}
              >
                Close
              </Button>
            </div>

            <div className="p-6">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList
                  className={cn(
                    "grid w-full grid-cols-3",
                    actualTheme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-100 border-gray-200",
                  )}
                >
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    <Contact className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="products"
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Products
                  </TabsTrigger>
                  <TabsTrigger
                    value="contact"
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Farmer Profile */}
                  <Card
                    className={cn(
                      actualTheme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200",
                    )}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-6">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={selectedFarmer.profileImage} />
                          <AvatarFallback className="bg-green-500 text-white text-2xl font-bold">
                            {selectedFarmer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3
                              className={cn(
                                "text-2xl font-bold",
                                actualTheme === "dark"
                                  ? "text-white"
                                  : "text-gray-900",
                              )}
                            >
                              {selectedFarmer.name}
                            </h3>
                            {selectedFarmer.verified && (
                              <Badge className="bg-green-500 text-white">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-green-500 font-medium text-lg mb-2">
                            {selectedFarmer.farmName}
                          </p>
                          <p
                            className={cn(
                              "mb-4",
                              actualTheme === "dark"
                                ? "text-gray-300"
                                : "text-gray-600",
                            )}
                          >
                            {selectedFarmer.description}
                          </p>

                          {/* Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Farm Size
                              </p>
                              <p
                                className={cn(
                                  "text-xl font-bold",
                                  actualTheme === "dark"
                                    ? "text-white"
                                    : "text-gray-900",
                                )}
                              >
                                {selectedFarmer.farmSize} ha
                              </p>
                            </div>
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Cultivated Area
                              </p>
                              <p className="text-xl font-bold text-green-500">
                                {getTotalProductArea(selectedFarmer)} ha
                              </p>
                            </div>
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Experience
                              </p>
                              <p
                                className={cn(
                                  "text-xl font-bold",
                                  actualTheme === "dark"
                                    ? "text-white"
                                    : "text-gray-900",
                                )}
                              >
                                {selectedFarmer.experience} years
                              </p>
                            </div>
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Rating
                              </p>
                              <div className="flex items-center space-x-1">
                                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                <span
                                  className={cn(
                                    "text-xl font-bold",
                                    actualTheme === "dark"
                                      ? "text-white"
                                      : "text-gray-900",
                                  )}
                                >
                                  {selectedFarmer.rating}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Transactions
                              </p>
                              <p
                                className={cn(
                                  "text-xl font-bold",
                                  actualTheme === "dark"
                                    ? "text-white"
                                    : "text-gray-900",
                                )}
                              >
                                {selectedFarmer.totalTransactions}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Specializations & Certifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card
                      className={cn(
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200",
                      )}
                    >
                      <CardHeader>
                        <CardTitle
                          className={cn(
                            "flex items-center",
                            actualTheme === "dark"
                              ? "text-white"
                              : "text-gray-900",
                          )}
                        >
                          <img src="/AgroConnect 2.png" alt="Logo" className="w-8 h-8 mr-3"/>
                          {/* <Leaf className="h-5 w-5 mr-2 text-green-500" /> */}
                          Specializations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedFarmer.specialization.map((spec, index) => (
                            <Badge
                              key={index}
                              className="bg-green-500 text-white"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={cn(
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200",
                      )}
                    >
                      <CardHeader>
                        <CardTitle
                          className={cn(
                            "flex items-center",
                            actualTheme === "dark"
                              ? "text-white"
                              : "text-gray-900",
                          )}
                        >
                          <Award className="h-5 w-5 mr-2 text-green-500" />
                          Certifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedFarmer.certifications.map((cert, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <Award className="h-4 w-4 text-green-500" />
                              <span
                                className={cn(
                                  "text-sm",
                                  actualTheme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-700",
                                )}
                              >
                                {cert}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="products" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedFarmer.products.map((product) => (
                      <Card
                        key={product.id}
                        className={cn(
                          actualTheme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-gray-50 border-gray-200",
                        )}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle
                              className={cn(
                                "flex items-center",
                                actualTheme === "dark"
                                  ? "text-white"
                                  : "text-gray-900",
                              )}
                            >
                              <Package className="h-5 w-5 mr-2 text-green-500" />
                              {product.name}
                            </CardTitle>
                            <div className="flex space-x-2">
                              <Badge
                                className={getQualityColor(
                                  product.qualityGrade,
                                )}
                              >
                                Grade {product.qualityGrade}
                              </Badge>
                              {product.organic && (
                                <Badge className="bg-green-500 text-white">
                                  Organic
                                </Badge>
                              )}
                              <Badge
                                className={
                                  product.available
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-500 text-white"
                                }
                              >
                                {product.available ? "Available" : "Sold Out"}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Amount Available
                              </p>
                              <p
                                className={cn(
                                  "text-xl font-bold",
                                  actualTheme === "dark"
                                    ? "text-white"
                                    : "text-gray-900",
                                )}
                              >
                                {product.amount} {product.unit}
                              </p>
                            </div>
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Cultivated Area
                              </p>
                              <p
                                className={cn(
                                  "text-xl font-bold",
                                  actualTheme === "dark"
                                    ? "text-white"
                                    : "text-gray-900",
                                )}
                              >
                                {product.area} ha
                              </p>
                            </div>
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Price per {product.unit}
                              </p>
                              <p className="text-xl font-bold text-green-500">
                                {formatPrice(product.pricePerUnit)}
                              </p>
                            </div>
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Yield per Hectare
                              </p>
                              <p
                                className={cn(
                                  "text-xl font-bold",
                                  actualTheme === "dark"
                                    ? "text-white"
                                    : "text-gray-900",
                                )}
                              >
                                {(product.amount / product.area).toFixed(1)}{" "}
                                t/ha
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Harvest Date
                              </p>
                              <p
                                className={cn(
                                  "font-bold",
                                  actualTheme === "dark"
                                    ? "text-white"
                                    : "text-gray-900",
                                )}
                              >
                                {new Date(
                                  product.harvestDate,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-6">
                  <Card
                    className={cn(
                      actualTheme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200",
                    )}
                  >
                    <CardHeader>
                      <CardTitle
                        className={cn(
                          "flex items-center",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        <Contact className="h-5 w-5 mr-2 text-green-500" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-green-500" />
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Email
                              </p>
                              <a
                                href={`mailto:${selectedFarmer.email}`}
                                className="text-green-500 hover:text-green-600"
                              >
                                {selectedFarmer.email}
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-green-500" />
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Phone
                              </p>
                              <a
                                href={`tel:${selectedFarmer.phone}`}
                                className="text-green-500 hover:text-green-600"
                              >
                                {selectedFarmer.phone}
                              </a>
                            </div>
                          </div>

                          {selectedFarmer.whatsapp && (
                            <div className="flex items-center space-x-3">
                              <MessageCircle className="h-5 w-5 text-green-500" />
                              <div>
                                <p
                                  className={cn(
                                    "text-sm font-medium",
                                    actualTheme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-600",
                                  )}
                                >
                                  WhatsApp
                                </p>
                                <a
                                  href={`https://wa.me/${selectedFarmer.whatsapp.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-500 hover:text-green-600"
                                >
                                  {selectedFarmer.whatsapp}
                                </a>
                              </div>
                            </div>
                          )}

                          {selectedFarmer.telegram && (
                            <div className="flex items-center space-x-3">
                              <MessageCircle className="h-5 w-5 text-green-500" />
                              <div>
                                <p
                                  className={cn(
                                    "text-sm font-medium",
                                    actualTheme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-600",
                                  )}
                                >
                                  Telegram
                                </p>
                                <a
                                  href={`https://t.me/${selectedFarmer.telegram}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-500 hover:text-green-600"
                                >
                                  @{selectedFarmer.telegram}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-green-500" />
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Location
                              </p>
                              <p
                                className={cn(
                                  actualTheme === "dark"
                                    ? "text-white"
                                    : "text-gray-900",
                                )}
                              >
                                {getRegionName(selectedFarmer.regionId)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-green-500" />
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  actualTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600",
                                )}
                              >
                                Member Since
                              </p>
                              <p
                                className={cn(
                                  actualTheme === "dark"
                                    ? "text-white"
                                    : "text-gray-900",
                                )}
                              >
                                {new Date(
                                  selectedFarmer.joinDate,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Actions */}
                      <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                        <Button
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-50"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                        {selectedFarmer.whatsapp && (
                          <Button
                            variant="outline"
                            className="border-green-500 text-green-500 hover:bg-green-50"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Farmers;
