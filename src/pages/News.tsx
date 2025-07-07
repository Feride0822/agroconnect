import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/layout/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  Globe,
  Eye,
  Leaf,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  Clock,
  User,
  MapPin,
  ChevronLeft,
  BookOpen,
  Truck,
  DollarSign,
  CloudRain,
  Sprout,
  Award,
  Building,
  Zap,
  MessageCircle,
  Share2,
  Bookmark,
  Heart,
} from "lucide-react";

const News = () => {
  const { actualTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const categories = [
    { id: "all", name: "All Categories", icon: BookOpen },
    { id: "export", name: "Export", icon: Globe },
    { id: "technology", name: "Technology", icon: Eye },
    { id: "funding", name: "Funding", icon: DollarSign },
    { id: "weather", name: "Weather", icon: CloudRain },
    { id: "market", name: "Market", icon: TrendingUp },
    { id: "agriculture", name: "Agriculture", icon: Sprout },
    { id: "policy", name: "Policy", icon: Building },
  ];

  const regions = [
    { id: "all", name: "All Regions" },
    { id: "tashkent", name: "Tashkent" },
    { id: "fergana", name: "Fergana Valley" },
    { id: "samarkand", name: "Samarkand" },
    { id: "bukhara", name: "Bukhara" },
    { id: "khorezm", name: "Khorezm" },
  ];

  const allNews = [
    {
      id: 1,
      title: "New Export Opportunities to Russia Open for Uzbek Farmers",
      summary:
        "Government announces increased quotas for agricultural exports with simplified procedures and reduced tariffs for cotton, wheat, and fruit producers.",
      content:
        "The Ministry of Agriculture has announced new export opportunities to Russia, including increased quotas and streamlined procedures...",
      time: "2 hours ago",
      readTime: "3 min read",
      category: "export",
      region: "all",
      author: "Ministry of Agriculture",
      image: "/api/placeholder/400/250",
      tags: ["Export", "Russia", "Cotton", "Wheat"],
      featured: true,
      views: 1247,
      likes: 89,
    },
    {
      id: 2,
      title: "Modern Farming Equipment Exhibition Opens in Tashkent",
      summary:
        "Latest agricultural technology and equipment showcase featuring precision farming tools, drones, and automated irrigation systems from international manufacturers.",
      content:
        "The annual AgriTech Uzbekistan exhibition has opened in Tashkent, showcasing the latest in agricultural technology...",
      time: "5 hours ago",
      readTime: "4 min read",
      category: "technology",
      region: "tashkent",
      author: "AgroTech News",
      image: "/api/placeholder/400/250",
      tags: ["Technology", "Equipment", "Innovation"],
      featured: false,
      views: 892,
      likes: 64,
    },
    {
      id: 3,
      title:
        "Sustainable Farming Grants: $50,000 Available for Eco-Friendly Projects",
      summary:
        "Apply now for government grants supporting organic farming, solar irrigation systems, and sustainable agriculture practices across all regions.",
      content:
        "The government has allocated $10 million in grants for sustainable farming projects...",
      time: "1 day ago",
      readTime: "5 min read",
      category: "funding",
      region: "all",
      author: "Green Agriculture Initiative",
      image: "/api/placeholder/400/250",
      tags: ["Funding", "Sustainability", "Grants"],
      featured: true,
      views: 2156,
      likes: 178,
    },
    {
      id: 4,
      title: "Weather Alert: Optimal Conditions for Spring Planting",
      summary:
        "Meteorological department forecasts favorable weather conditions for the next two weeks, ideal for cotton and wheat planting across central regions.",
      content:
        "The National Weather Service reports optimal conditions for spring planting...",
      time: "6 hours ago",
      readTime: "2 min read",
      category: "weather",
      region: "fergana",
      author: "Weather Service",
      image: "/api/placeholder/400/250",
      tags: ["Weather", "Planting", "Spring"],
      featured: false,
      views: 756,
      likes: 45,
    },
    {
      id: 5,
      title: "Cotton Prices Surge 15% Following International Demand Increase",
      summary:
        "Global cotton market sees significant price increases due to supply chain improvements and increased demand from textile manufacturers worldwide.",
      content:
        "Cotton prices have surged 15% this month following increased international demand...",
      time: "8 hours ago",
      readTime: "3 min read",
      category: "market",
      region: "all",
      author: "Market Analysis Team",
      image: "/api/placeholder/400/250",
      tags: ["Cotton", "Prices", "Market"],
      featured: false,
      views: 1834,
      likes: 124,
    },
    {
      id: 6,
      title: "Precision Agriculture Program Launches in Samarkand Region",
      summary:
        "New government initiative introduces GPS-guided farming, soil analysis, and data-driven crop management to improve yields and reduce costs.",
      content:
        "The precision agriculture program has officially launched in Samarkand region...",
      time: "12 hours ago",
      readTime: "4 min read",
      category: "agriculture",
      region: "samarkand",
      author: "Regional Development Office",
      image: "/api/placeholder/400/250",
      tags: ["Precision", "Technology", "Yields"],
      featured: false,
      views: 643,
      likes: 52,
    },
    {
      id: 7,
      title: "New Agricultural Policy Supports Small-Scale Farmers",
      summary:
        "Government introduces comprehensive support package including low-interest loans, free training programs, and equipment subsidies for small farms.",
      content:
        "The new agricultural policy aims to support small-scale farmers with comprehensive assistance...",
      time: "1 day ago",
      readTime: "6 min read",
      category: "policy",
      region: "all",
      author: "Policy Research Institute",
      image: "/api/placeholder/400/250",
      tags: ["Policy", "Support", "Small Farms"],
      featured: true,
      views: 2891,
      likes: 267,
    },
    {
      id: 8,
      title: "Organic Farming Certification Program Expands Nationwide",
      summary:
        "International organic certification now available for Uzbek farmers, opening doors to premium export markets in Europe and North America.",
      content:
        "The organic farming certification program has expanded to cover all regions...",
      time: "2 days ago",
      readTime: "4 min read",
      category: "agriculture",
      region: "all",
      author: "Organic Agriculture Board",
      image: "/api/placeholder/400/250",
      tags: ["Organic", "Certification", "Export"],
      featured: false,
      views: 1456,
      likes: 98,
    },
  ];

  // Filter news based on search and filters
  const filteredNews = allNews.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || news.category === selectedCategory;
    const matchesRegion =
      selectedRegion === "all" ||
      news.region === selectedRegion ||
      news.region === "all";

    return matchesSearch && matchesCategory && matchesRegion;
  });

  const featuredNews = filteredNews.filter((news) => news.featured);
  const regularNews = filteredNews.filter((news) => !news.featured);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.icon : BookOpen;
  };

  const getCategoryColor = (categoryId: string) => {
    const colors = {
      export: "bg-blue-500",
      technology: "bg-purple-500",
      funding: "bg-green-500",
      weather: "bg-cyan-500",
      market: "bg-orange-500",
      agriculture: "bg-emerald-500",
      policy: "bg-red-500",
    };
    return colors[categoryId as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      <Sidebar />

      <div className="flex-1 md:mr-[16rem]">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className={cn(
                  actualTheme === "dark"
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                )}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div
                className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-xl",
                  actualTheme === "dark" ? "bg-green-600" : "bg-green-500",
                )}
              >
                <BookOpen className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1
              className={cn(
                "text-5xl font-bold mb-4",
                actualTheme === "dark" ? "text-white" : "text-gray-900",
              )}
            >
              Agriculture News
            </h1>
            <p
              className={cn(
                "text-xl",
                actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
              )}
            >
              Stay updated with the latest developments in agriculture, market
              trends, and industry insights
            </p>
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
                Search & Filter News
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
                    Search News
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search articles, topics, or keywords..."
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
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger
                      className={cn(
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300",
                      )}
                    >
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
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
            Showing {filteredNews.length} articles
          </div>

          {/* Featured News */}
          {featuredNews.length > 0 && (
            <div className="mb-12">
              <h2
                className={cn(
                  "text-3xl font-bold mb-6 flex items-center",
                  actualTheme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                <Zap className="h-7 w-7 mr-3 text-yellow-500" />
                Featured Stories
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredNews.map((news) => {
                  const CategoryIcon = getCategoryIcon(news.category);
                  return (
                    <Card
                      key={news.id}
                      className={cn(
                        "group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden",
                        actualTheme === "dark"
                          ? "bg-gray-800 border-gray-700 hover:border-green-600/50"
                          : "bg-white border-gray-200 hover:border-green-500/50",
                      )}
                    >
                      <div className="relative">
                        <div className="h-48 bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                          <CategoryIcon className="h-16 w-16 text-white/80" />
                        </div>
                        <Badge className="absolute top-4 left-4 bg-yellow-500 text-black border-0">
                          <Award className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                        <Badge
                          className={cn(
                            "absolute top-4 right-4 text-white border-0",
                            getCategoryColor(news.category),
                          )}
                        >
                          {
                            categories.find((cat) => cat.id === news.category)
                              ?.name
                          }
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {news.time}
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {news.readTime}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {news.views}
                          </div>
                        </div>

                        <h3
                          className={cn(
                            "text-xl font-bold mb-3 group-hover:text-green-600 transition-colors line-clamp-2",
                            actualTheme === "dark"
                              ? "text-white"
                              : "text-gray-900",
                          )}
                        >
                          {news.title}
                        </h3>

                        <p
                          className={cn(
                            "mb-4 line-clamp-3",
                            actualTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-600",
                          )}
                        >
                          {news.summary}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {news.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <User className="h-3 w-3" />
                              {news.author}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="p-1 h-auto"
                            >
                              <Heart className="h-4 w-4" />
                              <span className="ml-1 text-xs">{news.likes}</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="p-1 h-auto"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="p-1 h-auto"
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Regular News */}
          <div className="mb-12">
            <h2
              className={cn(
                "text-3xl font-bold mb-6 flex items-center",
                actualTheme === "dark" ? "text-white" : "text-gray-900",
              )}
            >
              <BookOpen className="h-7 w-7 mr-3 text-green-500" />
              Latest News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews.map((news) => {
                const CategoryIcon = getCategoryIcon(news.category);
                return (
                  <Card
                    key={news.id}
                    className={cn(
                      "group hover:shadow-lg transition-all duration-300 cursor-pointer",
                      actualTheme === "dark"
                        ? "bg-gray-800 border-gray-700 hover:border-green-600/50"
                        : "bg-white border-gray-200 hover:border-green-500/50",
                    )}
                  >
                    <div className="relative">
                      <div className="h-32 bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center">
                        <CategoryIcon className="h-10 w-10 text-white/80" />
                      </div>
                      <Badge
                        className={cn(
                          "absolute top-3 right-3 text-white border-0 text-xs",
                          getCategoryColor(news.category),
                        )}
                      >
                        {
                          categories.find((cat) => cat.id === news.category)
                            ?.name
                        }
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {news.time}
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {news.readTime}
                        </div>
                      </div>

                      <h3
                        className={cn(
                          "font-bold mb-2 group-hover:text-green-600 transition-colors line-clamp-2",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        {news.title}
                      </h3>

                      <p
                        className={cn(
                          "text-sm mb-3 line-clamp-2",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-600",
                        )}
                      >
                        {news.summary}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Eye className="h-3 w-3" />
                          {news.views}
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* No Results */}
          {filteredNews.length === 0 && (
            <Card
              className={cn(
                "text-center py-12",
                actualTheme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200",
              )}
            >
              <CardContent>
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3
                  className={cn(
                    "text-xl font-bold mb-2",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  No News Found
                </h3>
                <p
                  className={cn(
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Try adjusting your search criteria or filters to find relevant
                  news articles.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
