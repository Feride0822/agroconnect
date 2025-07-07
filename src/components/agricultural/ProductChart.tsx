import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Product } from "@/lib/agricultural-data";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Leaf } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProductChartProps {
  product: Product;
  className?: string;
}

const ProductChart = ({ product, className }: ProductChartProps) => {
  const { actualTheme } = useTheme();

  const formatPrice = (value: number) => `$${value}`;
  const { t } = useTranslation();

  const getChangeColor = () => {
    if (product.priceHistory.length < 2)
      return actualTheme === "dark" ? "text-gray-400" : "text-gray-600";
    const first = product.priceHistory[0].price;
    const last = product.priceHistory[product.priceHistory.length - 1].price;
    return last > first ? "text-green-500" : "text-red-500";
  };

  const getPriceChange = () => {
    if (product.priceHistory.length < 2) return { value: 0, percentage: 0 };
    const first = product.priceHistory[0].price;
    const last = product.priceHistory[product.priceHistory.length - 1].price;
    const change = last - first;
    const percentage = (change / first) * 100;
    return { value: change, percentage };
  };

  const change = getPriceChange();
  const isPositive = change.value > 0;

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        actualTheme === "dark"
          ? "bg-gray-800 border-gray-700 hover:border-green-600/50"
          : "bg-white border-gray-200 hover:border-green-500/50",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg",
                actualTheme === "dark" ? "bg-green-600" : "bg-green-500",
              )}
            >
              <img src="/AgroConnect 5.png" alt="Logo" className="w-7 h-7"/>
              {/* <Leaf className="h-5 w-5 text-white" /> */}
            </div>
            <CardTitle
              className={cn(
                "text-xl",
                actualTheme === "dark" ? "text-white" : "text-gray-900",
              )}
            >
              {product.name}
            </CardTitle>
          </div>
          <div className="text-right">
            <div
              className={cn(
                "text-3xl font-bold",
                actualTheme === "dark" ? "text-white" : "text-gray-900",
              )}
            >
              {formatPrice(product.currentPrice)}
            </div>
            <div className={`flex items-center text-sm ${getChangeColor()}`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>
                {change.value > 0 ? "+" : ""}
                {formatPrice(change.value)} ({change.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={product.priceHistory}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={actualTheme === "dark" ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 12,
                  fill: actualTheme === "dark" ? "#d1d5db" : "#6b7280",
                }}
              />
              <YAxis
                tick={{
                  fontSize: 12,
                  fill: actualTheme === "dark" ? "#d1d5db" : "#6b7280",
                }}
                tickFormatter={formatPrice}
              />
              <Tooltip
                formatter={(value: number) => [formatPrice(value), "Price"]}
                labelFormatter={(label) => `Period: ${label}`}
                contentStyle={{
                  backgroundColor:
                    actualTheme === "dark" ? "#1f2937" : "#ffffff",
                  border: `1px solid ${actualTheme === "dark" ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "8px",
                  color: actualTheme === "dark" ? "#ffffff" : "#000000",
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                activeDot={{
                  r: 8,
                  stroke: "#10b981",
                  strokeWidth: 3,
                  fill: "#ffffff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm">
            <span
              className={cn(
                actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
              )}
            >
              {t("category")}: {product.category}
            </span>
            <span
              className={cn(
                actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
              )}
            >
              {t("unit")}: {product.unit}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center space-x-2 px-3 py-1 rounded-full",
              actualTheme === "dark" ? "bg-green-600/20" : "bg-green-500/20",
            )}
          >
            {/* <Leaf className="h-3 w-3 text-green-500" /> */}
            <span className="text-green-500 text-xs font-medium">
            {t("mar_data")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductChart;
