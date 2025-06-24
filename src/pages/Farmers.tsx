import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Base_Url } from "@/App";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { actualTheme } = useTheme();

  useEffect(() => {
    fetchFarmers();
  }, []);
  //Fetch

  const fetchFarmers = async () => {
    try {
      const response = await axios.get(`${Base_Url}/farmers/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setFarmers(response.data);
    } catch (error) {
      console.error("Error fetching farmers", error);
    }
  };

  const filteredFarmers = farmers.filter(
    (farmer) =>
      `${farmer.first_name} ${farmer.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (farmer.email && farmer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (farmer.phone_number && farmer.phone_number.includes(searchTerm))
  );

  return (
    <div
      className={cn(
        "min-h-screen flex",
        actualTheme === "dark" ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-800"
      )}
    >
      <div className="w-full container py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold mb-8 text-center tracking-tight">
          Farmers Directory
        </h2>
        <input
          type="text"
          placeholder="Search by name, email, or phone number..."
          className={cn(
            "w-full p-4 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-green-400 focus:border-transparent transition-all duration-300 mb-8 text-lg",
            actualTheme === "dark" ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          )}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFarmers.map((farmer) => (
            <Card
              key={farmer.id}
              className={cn(
                "rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1",
                actualTheme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              )}
            >
              <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-3xl font-bold text-green-500">
                  {farmer.first_name} {farmer.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 text-base">
                <p>
                  <strong className="text-gray-700 dark:text-gray-300">Email:</strong>{" "}
                  <span className={actualTheme === "dark" ? "text-gray-300" : "text-gray-600"}>
                    {farmer.email || "N/A"}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-700 dark:text-gray-300">Phone:</strong>{" "}
                  <span className={actualTheme === "dark" ? "text-gray-300" : "text-gray-600"}>
                    {farmer.phone_number || "N/A"}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-700 dark:text-gray-300">Region:</strong>{" "}
                  <span className={actualTheme === "dark" ? "text-gray-300" : "text-gray-600"}>
                    {farmer.region || "N/A"}
                  </span>
                </p>

                <div className="mt-5 pt-5 border-t border-dashed border-gray-300 dark:border-gray-700">
                  <h4 className="font-bold mb-3 text-xl text-green-400">Planted Products:</h4>
                  {farmer.planted_products && farmer.planted_products.length > 0 ? (
                    <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-300">
                      {farmer.planted_products.map((product, index) => (
                        <li key={index} className="text-base leading-relaxed">
                          <strong className="text-green-600 dark:text-green-300">{product.product.name}</strong> —{" "}
                          <span className="font-semibold">{product.planting_area} ha</span> /{" "}
                          <span className="font-semibold">{product.expecting_weight} tons</span> /{" "}
                          <span className="font-semibold">{product.wph ? `${product.wph.toFixed(2)} %` : 'N/A'}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic text-center mt-4">No planted products recorded for this farmer.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFarmers.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-xl font-medium">
            No farmers found matching your search criteria. Try a different search term.
          </p>
        )}
      </div>
      <Sidebar />
    </div>
  );
};

export default Farmers;