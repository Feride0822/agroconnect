import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, } from "recharts";
import {
  regions,
  getTotalVolumeByRegion,
  getVolumeByRegion,
  products,
} from "@/lib/agricultural-data";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
// import { Leaf, Activity } from "lucide-react";

const RegionalStats = () => {
  const { actualTheme } = useTheme();

  // Prepare data for regional volume chart
  const regionalData = regions.map((region) => ({
    name: region.name,
    volume: getTotalVolumeByRegion(region.id),
    area: region.agriculturalArea,
  }));

  // Prepare data for product distribution pie chart
  const productData = products.map((product) => ({
    name: product.name,
    volume: regions.reduce((sum, region) => {
      return (
        sum +
        getVolumeByRegion(region.id)
          .filter((v) => v.productId === product.id)
          .reduce((productSum, v) => productSum + v.volume, 0)
      );
    }, 0),
  }));

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Regional Volume Chart */}
      {/* <Card
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
            <Activity className="h-5 w-5 mr-2 text-green-500" />
            Regional Production Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={actualTheme === "dark" ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                    fill: actualTheme === "dark" ? "#d1d5db" : "#6b7280",
                  }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{
                    fontSize: 12,
                    fill: actualTheme === "dark" ? "#d1d5db" : "#6b7280",
                  }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "volume"
                      ? `${value.toLocaleString()} tons`
                      : `${value.toLocaleString()} ha`,
                    name === "volume"
                      ? "Production Volume"
                      : "Agricultural Area",
                  ]}
                  contentStyle={{
                    backgroundColor:
                      actualTheme === "dark" ? "#1f2937" : "#ffffff",
                    border: `1px solid ${actualTheme === "dark" ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: actualTheme === "dark" ? "#ffffff" : "#000000",
                  }}
                />
                <Bar
                  dataKey="volume"
                  fill="#10b981"
                  name="volume"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card> */}

      {/* Product Distribution Pie Chart */}
      {/* <Card
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
            
            Product Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="volume"
                  stroke={actualTheme === "dark" ? "#374151" : "#e5e7eb"}
                  strokeWidth={2}
                >
                  {productData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `${value.toLocaleString()} tons`,
                    "Volume",
                  ]}
                  contentStyle={{
                    backgroundColor:
                      actualTheme === "dark" ? "#1f2937" : "#ffffff",
                    border: `1px solid ${actualTheme === "dark" ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: actualTheme === "dark" ? "#ffffff" : "#000000",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card> */}

      {/* Regional Statistics Table */}
      <Card
        className={cn(
          "lg:col-span-2",
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
            Regional Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={cn(
                    "border-b",
                    actualTheme === "dark"
                      ? "border-gray-600"
                      : "border-gray-200",
                  )}
                >
                  <th
                    className={cn(
                      "text-left py-4 px-4 font-semibold",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Region
                  </th>
                  {/* <th
                    className={cn(
                      "text-right py-4 px-4 font-semibold",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Population
                  </th> */}
                  <th
                    className={cn(
                      "text-right py-4 px-4 font-semibold",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Agricultural Area (ha)
                  </th>
                  <th
                    className={cn(
                      "text-right py-4 px-4 font-semibold",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Total Production (tons)
                  </th>
                  <th
                    className={cn(
                      "text-right py-4 px-4 font-semibold",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Efficiency Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {regionalData.map((region, index) => {
                  const regionData = regions.find(
                    (r) => r.name === region.name,
                  );
                  const productivity = region.volume / region.area;

                  return (
                    <tr
                      key={index}
                      className={cn(
                        "border-b transition-colors",
                        actualTheme === "dark"
                          ? "border-gray-700 hover:bg-gray-700/50"
                          : "border-gray-100 hover:bg-gray-50",
                      )}
                    >
                      <td
                        className={cn(
                          "py-4 px-4 font-medium",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        {region.name}
                      </td>
                      <td
                        className={cn(
                          "text-right py-4 px-4",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-600",
                        )}
                      >
                        {regionData?.population.toLocaleString()}
                      </td>
                      <td
                        className={cn(
                          "text-right py-4 px-4",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-600",
                        )}
                      >
                        {region.area.toLocaleString()}
                      </td>
                      <td
                        className={cn(
                          "text-right py-4 px-4",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-600",
                        )}
                      >
                        {region.volume.toLocaleString()}
                      </td>
                      <td className="text-right py-4 px-4">
                        <span
                          className={cn(
                            "inline-flex px-3 py-1 rounded-full text-xs font-medium border",
                            productivity > 2.5
                              ? "bg-green-500/20 text-green-500 border-green-500/30"
                              : productivity > 2.0
                                ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                                : "bg-red-500/20 text-red-500 border-red-500/30",
                          )}
                        >
                          {productivity.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegionalStats;
