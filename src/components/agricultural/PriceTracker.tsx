import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { products, getPriceStability } from "@/lib/agricultural-data";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Leaf,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const PriceTracker = () => {
  const { actualTheme } = useTheme();
  const { t } = useTranslation();

  const getStabilityColor = (stability: number) => {
    if (stability >= 80) return "bg-green-500";
    if (stability >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStabilityBadgeColor = (stability: number) => {
    if (stability >= 80) return "bg-green-500 text-white border-0";
    if (stability >= 60) return "bg-yellow-500 text-white border-0";
    return "bg-red-500 text-white border-0";
  };

  const getTrendIcon = (product: any) => {
    if (product.priceHistory.length < 2)
      return <Minus className="h-4 w-4 text-gray-400" />;
    const first = product.priceHistory[0].price;
    const last = product.priceHistory[product.priceHistory.length - 1].price;

    if (last > first) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (last < first) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="space-y-8">
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
            {t("price_stab")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const stability = getPriceStability(product.id);
              return (
                <div
                  key={product.id}
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
                        actualTheme === "dark" ? "text-white" : "text-gray-900",
                      )}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(product)}
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span
                        className={cn(
                          "text-sm",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-600",
                        )}
                      >
                        {t("cur_price")}:
                      </span>
                      <span
                        className={cn(
                          "font-bold text-lg",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        ${product.currentPrice}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span
                          className={cn(
                            "text-sm",
                            actualTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-600",
                          )}
                        >
                          {t("stab_score")}:
                        </span>
                        <Badge className={getStabilityBadgeColor(stability)}>
                          {stability}%
                        </Badge>
                      </div>
                      <div
                        className={cn(
                          "w-full rounded-full h-3",
                          actualTheme === "dark"
                            ? "bg-gray-600"
                            : "bg-gray-200",
                        )}
                      >
                        <div
                          className={`${getStabilityColor(stability)} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${stability}%` }}
                        ></div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex items-center justify-between pt-2 border-t",
                        actualTheme === "dark"
                          ? "border-gray-600"
                          : "border-gray-200",
                      )}
                    >
                      <span className="text-green-500 text-xs">
                      {t("mar_anal")}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          stability >= 80
                            ? "text-green-500"
                            : stability >= 60
                              ? "text-yellow-500"
                              : "text-red-500"
                        }`}
                      >
                        {stability >= 80
                          ? "Stable"
                          : stability >= 60
                            ? "Moderate"
                            : "Volatile"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card
        className={cn(
          "border-l-4 border-l-orange-500",
          actualTheme === "dark"
            ? "bg-orange-900/20 border-orange-800/50"
            : "bg-orange-50 border-orange-200",
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-orange-600">
            <AlertTriangle className="h-6 w-6 mr-3" />
            {t("mar_risk")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products
              .filter((product) => getPriceStability(product.id) < 70)
              .map((product) => {
                const stability = getPriceStability(product.id);
                const isUrgent = stability < 50;

                return (
                  <div
                    key={product.id}
                    className={cn(
                      "p-4 rounded-xl border-l-4 transition-all duration-300",
                      isUrgent ? "border-red-500" : "border-yellow-500",
                      actualTheme === "dark"
                        ? isUrgent
                          ? "bg-red-900/20 border-red-800/50"
                          : "bg-yellow-900/20 border-yellow-800/50"
                        : isUrgent
                          ? "bg-red-50 border-red-200"
                          : "bg-yellow-50 border-yellow-200",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-lg",
                            isUrgent
                              ? actualTheme === "dark"
                                ? "bg-red-600/20"
                                : "bg-red-500/20"
                              : actualTheme === "dark"
                                ? "bg-yellow-600/20"
                                : "bg-yellow-500/20",
                          )}
                        >
                          <Leaf
                            className={`h-5 w-5 ${
                              isUrgent ? "text-red-500" : "text-yellow-500"
                            }`}
                          />
                        </div>
                        <div>
                          <h4
                            className={cn(
                              "font-bold text-lg",
                              actualTheme === "dark"
                                ? "text-white"
                                : "text-gray-900",
                            )}
                          >
                            {product.name}
                          </h4>
                          <p
                            className={`text-sm ${
                              isUrgent ? "text-red-500" : "text-yellow-500"
                            }`}
                          >
                            {isUrgent ? "Critical" : "Medium"} {t("vol_det")}
                          </p>
                          <p
                            className={cn(
                              "text-xs mt-1",
                              actualTheme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600",
                            )}
                          >
                            {t("recommendation")}:{" "}
                            {isUrgent
                              ? "Immediate price monitoring"
                              : "Monitor closely"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={cn(
                            "mb-2 border-0",
                            isUrgent
                              ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-white",
                          )}
                        >
                          {stability}% {t("stable")}
                        </Badge>
                        <div
                          className={cn(
                            "w-20 rounded-full h-2",
                            actualTheme === "dark"
                              ? "bg-gray-600"
                              : "bg-gray-200",
                          )}
                        >
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              isUrgent ? "bg-red-500" : "bg-yellow-500"
                            }`}
                            style={{ width: `${stability}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            {products.every(
              (product) => getPriceStability(product.id) >= 70,
            ) && (
              <div className="text-center py-12">
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
                    actualTheme === "dark" ? "bg-green-600" : "bg-green-500",
                  )}
                >
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3
                  className={cn(
                    "text-xl font-bold mb-2",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  {t("all_stable")}
                </h3>
                <p className="text-green-500">{t("product_stable")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceTracker;
