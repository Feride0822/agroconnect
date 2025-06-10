import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/layout/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  TrendingUp,
  Shield,
  Globe,
  Smartphone,
  Leaf,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Sprout,
  TreePine,
  Wheat,
  Star,
  Calendar,
  MapPin,
  Activity,
  DollarSign,
  Award,
  PlayCircle,
  Eye,
  MessageCircle,
  FileText,
  Truck,
  CloudRain,
  Sun,
  Thermometer,
  ChevronRight,
  TrendingDown,
  Phone,
  Mail,
} from "lucide-react";

const Index = () => {
  const { actualTheme } = useTheme();
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    // Auto-cycle through stats
    const statInterval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % 4);
    }, 3000);

    // Auto-cycle through testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(statInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description:
        "Advanced data analysis tools to track your farm performance, monitor crop health, and optimize agricultural operations",
      color: "from-blue-500 to-blue-600",
      highlight: "📊 Better insights",
    },
    {
      icon: Users,
      title: "Farmer Network",
      description:
        "Connect with 15,000+ verified farmers worldwide. Share knowledge, trade products, and grow your agricultural network",
      color: "from-green-500 to-green-600",
      highlight: "🌍 15K+ Farmers",
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description:
        "Real-time commodity prices, market trends, and export opportunities to help you make informed business decisions",
      color: "from-purple-500 to-purple-600",
      highlight: "📈 Live market data",
    },
    {
      icon: Shield,
      title: "Crop Management",
      description:
        "Monitor crop conditions, track weather patterns, and get alerts for potential threats to your agricultural investments",
      color: "from-red-500 to-red-600",
      highlight: "🛡️ Crop protection",
    },
    {
      icon: Globe,
      title: "Regional Coverage",
      description:
        "Comprehensive agricultural data and networking opportunities across all regions of Uzbekistan and beyond",
      color: "from-teal-500 to-teal-600",
      highlight: "🎯 Full coverage",
    },
    {
      icon: Smartphone,
      title: "Mobile Access",
      description:
        "Access your farm data and connect with the agricultural community from anywhere using our mobile-friendly platform",
      color: "from-orange-500 to-orange-600",
      highlight: "📱 Mobile ready",
    },
  ];

  const stats = [
    {
      label: "Active Farmers",
      value: "15,247",
      icon: Users,
      change: "+1,247 this month",
      trend: "up",
    },
    {
      label: "Hectares Monitored",
      value: "2.8M",
      icon: TreePine,
      change: "+300K this year",
      trend: "up",
    },
    {
      label: "Crop Varieties",
      value: "180+",
      icon: Wheat,
      change: "+30 varieties added",
      trend: "up",
    },
    {
      label: "Average Yield Increase",
      value: "47%",
      icon: TrendingUp,
      change: "+5% vs last season",
      trend: "up",
    },
  ];

  const testimonials = [
    {
      name: "Akram Nazarov",
      location: "Tashkent Region",
      role: "Cotton Farmer",
      rating: 5,
      image: "👨‍🌾",
      quote:
        "AgroConnect helped me track my cotton yield better and connect with direct buyers. The market data is incredibly helpful for planning!",
      metric: "40% better planning",
    },
    {
      name: "Malika Karimova",
      location: "Fergana Valley",
      role: "Fruit Exporter",
      rating: 5,
      image: "👩‍💼",
      quote:
        "The farmer network feature connected me with apple growers across Uzbekistan. We've improved coordination and reduced waste significantly.",
      metric: "Better coordination",
    },
    {
      name: "Dilshod Umarov",
      location: "Samarkand",
      role: "Organic Farmer",
      rating: 5,
      image: "🧑‍🌾",
      quote:
        "The weather alerts and market trends help me plan my organic vegetable farming schedule much more effectively.",
      metric: "Improved planning",
    },
  ];

  const liveData = [
    {
      title: "Wheat Price",
      value: "$285/ton",
      change: "+2.3%",
      trend: "up",
      icon: Wheat,
    },
    {
      title: "Weather Alert",
      value: "Light Rain",
      change: "Next 2 days",
      trend: "neutral",
      icon: CloudRain,
    },
    {
      title: "Active Trades",
      value: "127",
      change: "+15 today",
      trend: "up",
      icon: Truck,
    },
    {
      title: "Soil Temp",
      value: "18°C",
      change: "Optimal",
      trend: "up",
      icon: Thermometer,
    },
  ];

  const recentNews = [
    {
      title: "New Export Opportunities to Russia Open",
      summary:
        "Government announces increased quotas for agricultural exports...",
      time: "2 hours ago",
      category: "Export",
      icon: Globe,
    },
    {
      title: "Modern Farming Equipment Exhibition",
      summary:
        "Latest agricultural technology and equipment showcase opens in Tashkent...",
      time: "5 hours ago",
      category: "Technology",
      icon: Eye,
    },
    {
      title: "Sustainable Farming Grants Available",
      summary:
        "Apply now for up to $50,000 in funding for eco-friendly practices...",
      time: "1 day ago",
      category: "Funding",
      icon: Leaf,
    },
  ];

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      <Sidebar />

      <div className="flex-1 md:mr-80">
        {/* Hero Section with Animation */}
        <section
          className={cn(
            "relative py-20 px-4 overflow-hidden",
            actualTheme === "dark"
              ? "bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900"
              : "bg-gradient-to-br from-green-50 via-emerald-100 to-green-50",
          )}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-32 right-20 w-48 h-48 bg-blue-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-32 w-24 h-24 bg-yellow-200/20 rounded-full blur-xl animate-pulse delay-2000"></div>
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center">
              <div
                className={cn(
                  "flex items-center justify-center mb-8 transition-all duration-1000 transform",
                  isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0",
                )}
              >
                <div className="relative">
                  <div
                    className={cn(
                      "flex items-center justify-center w-24 h-24 rounded-full relative z-10",
                      actualTheme === "dark" ? "bg-green-600" : "bg-green-500",
                    )}
                  >
                    <img src="/AgroConnect 4.png" alt="Logo" />
                    {/* <Leaf className="h-12 w-12 text-white animate-pulse" /> */}
                  </div>
                  <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping"></div>
                </div>
              </div>

              <h1
                className={cn(
                  "text-5xl md:text-7xl font-bold mb-8 transition-all duration-1000 delay-300",
                  actualTheme === "dark" ? "text-white" : "text-gray-900",
                  isVisible
                    ? "transform translate-y-0 opacity-100"
                    : "transform translate-y-10 opacity-0",
                )}
              >
                Modern Agriculture
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                  Made Simple
                </span>
              </h1>

              <p
                className={cn(
                  "text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-500",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-700",
                  isVisible
                    ? "transform translate-y-0 opacity-100"
                    : "transform translate-y-10 opacity-0",
                )}
              >
                Join{" "}
                <span className="text-green-500 font-semibold">
                  15,247 farmers
                </span>{" "}
                using modern agricultural tools and market insights to increase
                yields by{" "}
                <span className="text-green-500 font-semibold">47%</span> while
                reducing costs and connecting with agricultural professionals.
              </p>

              <div
                className={cn(
                  "flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-700",
                  isVisible
                    ? "transform translate-y-0 opacity-100"
                    : "transform translate-y-10 opacity-0",
                )}
              >
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-6 text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Zap className="mr-3 h-6 w-6" />
                    Join The Platform
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                      "px-10 py-6 text-xl border-2 hover:scale-105 transition-all duration-300",
                      actualTheme === "dark"
                        ? "border-green-600 text-green-400 hover:bg-green-600/10"
                        : "border-green-500 text-green-600 hover:bg-green-50",
                    )}
                  >
                    <PlayCircle className="mr-3 h-6 w-6" />
                    Explore Platform
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-70">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span
                    className={cn(
                      "text-sm",
                      actualTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600",
                    )}
                  >
                    Government Certified
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-500" />
                  <span
                    className={cn(
                      "text-sm",
                      actualTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600",
                    )}
                  >
                    Award Winning Platform
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <span
                    className={cn(
                      "text-sm",
                      actualTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600",
                    )}
                  >
                    15K+ Active Users
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-green-500" />
                  <span
                    className={cn(
                      "text-sm",
                      actualTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600",
                    )}
                  >
                    Regional Coverage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Data Dashboard */}
        <section
          className={cn(
            "py-12 px-4 border-b",
            actualTheme === "dark"
              ? "bg-gray-800/30 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h3
                className={cn(
                  "text-2xl font-bold flex items-center",
                  actualTheme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                <Activity className="h-6 w-6 mr-3 text-green-500" />
                Live Market Data
              </h3>
              <Badge className="bg-green-500 text-white animate-pulse">
                LIVE
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {liveData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={index}
                    className={cn(
                      "relative overflow-hidden group hover:shadow-lg transition-all duration-300",
                      actualTheme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200",
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="h-8 w-8 text-green-500" />
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full animate-pulse",
                            item.trend === "up"
                              ? "bg-green-500"
                              : item.trend === "down"
                                ? "bg-red-500"
                                : "bg-gray-500",
                          )}
                        />
                      </div>
                      <div
                        className={cn(
                          "text-2xl font-bold mb-1",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        {item.value}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {item.title}
                      </div>
                      <div
                        className={cn(
                          "text-sm flex items-center",
                          item.trend === "up"
                            ? "text-green-500"
                            : item.trend === "down"
                              ? "text-red-500"
                              : "text-gray-500",
                        )}
                      >
                        {item.trend === "up" && (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        )}
                        {item.trend === "down" && (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {item.change}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Animated Stats Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2
                className={cn(
                  "text-4xl font-bold mb-4",
                  actualTheme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                Growing Success Stories
              </h2>
              <p
                className={cn(
                  "text-xl",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                )}
              >
                Real results from real farmers
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isActive = index === currentStatIndex;
                return (
                  <Card
                    key={index}
                    className={cn(
                      "text-center transition-all duration-500 transform hover:scale-105",
                      actualTheme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200",
                      isActive
                        ? "ring-2 ring-green-500 shadow-xl scale-105"
                        : "",
                    )}
                  >
                    <CardContent className="pt-8 pb-6">
                      <div className="flex items-center justify-center mb-4">
                        <div
                          className={cn(
                            "flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300",
                            actualTheme === "dark"
                              ? "bg-green-600"
                              : "bg-green-500",
                            isActive ? "animate-pulse scale-110" : "",
                          )}
                        >
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div
                        className={cn(
                          "text-4xl font-bold mb-2 transition-all duration-300",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                          isActive ? "text-green-500" : "",
                        )}
                      >
                        {stat.value}
                      </div>
                      <div
                        className={cn(
                          "text-sm font-medium mb-2",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700",
                        )}
                      >
                        {stat.label}
                      </div>
                      <div className="text-xs text-green-500 flex items-center justify-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.change}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section
          className={cn(
            "py-20 px-4",
            actualTheme === "dark"
              ? "bg-gray-800/30"
              : "bg-gradient-to-br from-gray-50 to-green-50",
          )}
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2
                className={cn(
                  "text-5xl font-bold mb-6",
                  actualTheme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                Modern Farm Management
              </h2>
              <p
                className={cn(
                  "text-2xl max-w-4xl mx-auto",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                )}
              >
                Digital tools that help you manage, monitor, and grow your
                agricultural business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className={cn(
                      "relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2",
                      actualTheme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200",
                    )}
                  >
                    {/* Gradient background */}
                    <div
                      className={cn(
                        "absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-300 group-hover:h-2",
                        feature.color,
                      )}
                    />

                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={cn(
                            "flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r transition-all duration-300 group-hover:scale-110",
                            feature.color,
                          )}
                        >
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs text-green-600 border-green-300"
                        >
                          {feature.highlight}
                        </Badge>
                      </div>
                      <CardTitle
                        className={cn(
                          "text-xl mb-2",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p
                        className={cn(
                          "leading-relaxed",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-600",
                        )}
                      >
                        {feature.description}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 text-green-600 hover:text-green-700 p-0 h-auto font-semibold group"
                      >
                        Learn more
                        <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2
                className={cn(
                  "text-4xl font-bold mb-4",
                  actualTheme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                Success Stories from Our Community
              </h2>
              <p
                className={cn(
                  "text-xl",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                )}
              >
                Real farmers, real results
              </p>
            </div>

            <div className="relative">
              <Card
                className={cn(
                  "max-w-4xl mx-auto text-center p-8 relative overflow-hidden",
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600" />

                <div className="mb-8">
                  <div className="text-6xl mb-4">
                    {testimonials[currentTestimonial].image}
                  </div>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-500 fill-current"
                        />
                      ),
                    )}
                  </div>
                </div>

                <blockquote
                  className={cn(
                    "text-2xl font-medium mb-8 leading-relaxed",
                    actualTheme === "dark" ? "text-gray-200" : "text-gray-800",
                  )}
                >
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>

                <div className="flex items-center justify-center space-x-8">
                  <div>
                    <div
                      className={cn(
                        "font-bold text-lg",
                        actualTheme === "dark" ? "text-white" : "text-gray-900",
                      )}
                    >
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-green-600 font-medium">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div
                      className={cn(
                        "text-sm flex items-center justify-center mt-1",
                        actualTheme === "dark"
                          ? "text-gray-400"
                          : "text-gray-500",
                      )}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {testimonials[currentTestimonial].location}
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                      {testimonials[currentTestimonial].metric}
                    </Badge>
                  </div>
                </div>

                {/* Testimonial indicators */}
                <div className="flex justify-center space-x-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300",
                        index === currentTestimonial
                          ? "bg-green-500 w-8"
                          : "bg-gray-300",
                      )}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* News & Updates */}
        <section
          className={cn(
            "py-16 px-4",
            actualTheme === "dark" ? "bg-gray-800/30" : "bg-gray-100",
          )}
        >
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2
                  className={cn(
                    "text-3xl font-bold mb-2",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  Latest Agriculture News
                </h2>
                <p
                  className={cn(
                    "text-lg",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Stay updated with industry trends
                </p>
              </div>
              <Link to="/news">
                <Button variant="outline" className="hidden sm:flex">
                  View All News
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentNews.map((news, index) => {
                const Icon = news.icon;
                return (
                  <Card
                    key={index}
                    className={cn(
                      "group hover:shadow-lg transition-all duration-300 cursor-pointer",
                      actualTheme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200",
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {news.category}
                        </Badge>
                        <Icon className="h-5 w-5 text-green-500" />
                      </div>
                      <h3
                        className={cn(
                          "font-bold text-lg mb-3 group-hover:text-green-600 transition-colors",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        {news.title}
                      </h3>
                      <p
                        className={cn(
                          "text-sm mb-4 line-clamp-2",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-600",
                        )}
                      >
                        {news.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {news.time}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600" />
          <div className="absolute inset-0 bg-black/20" />

          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-5xl font-bold text-white mb-6">
                Ready to Transform Your Farm?
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
                Join thousands of smart farmers who've improved their
                agricultural operations using our comprehensive platform and
                community network.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 px-10 py-6 text-xl font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Sprout className="mr-3 h-6 w-6" />
                  Get Started Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-10 py-6 text-xl bg-transparent"
              >
                <Phone className="mr-3 h-6 w-6" />
                Contact Support
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className={cn(
            "py-16 px-4",
            actualTheme === "dark"
              ? "bg-gray-900 border-gray-800"
              : "bg-gray-900 text-white",
          )}
        >
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-600">
                  <img src="/AgroConnect 3.png" alt="Logo" />
                    {/* <Leaf className="h-6 w-6 text-white" /> */}
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">
                      AgroConnect
                    </span>
                    <p className="text-green-400 text-sm">
                      Agricultural Platform
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 max-w-md mb-6 leading-relaxed">
                  Empowering farmers across Uzbekistan with modern tools,
                  real-time market data, and a comprehensive network of
                  agricultural professionals.
                </p>
                <div className="flex space-x-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Us
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Live Chat
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-white">Platform</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-green-400 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/farmers"
                      className="hover:text-green-400 transition-colors"
                    >
                      Farmers Network
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/statistics"
                      className="hover:text-green-400 transition-colors"
                    >
                      Market Analytics
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="hover:text-green-400 transition-colors"
                    >
                      My Profile
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-white">Account</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>
                    <Link
                      to="/login"
                      className="hover:text-green-400 transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="hover:text-green-400 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="hover:text-green-400 transition-colors"
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2025 AgroConnect. All rights reserved. Made with 💚 for
                farmers.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 text-sm transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 text-sm transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 text-sm transition-colors"
                >
                  Help Center
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
