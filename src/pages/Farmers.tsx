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
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50"
      )}
    >
      <div className="w-full container py-8 px-4">
        <input
          type="text"
          placeholder="Search farmers..."
          className="text-black border p-2 rounded w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFarmers.map((farmer) => (
            <Card key={farmer.id}>
              <CardHeader>
                <CardTitle>
                  {farmer.first_name} {farmer.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Email:</strong> {farmer.email}</p>
                <p><strong>Phone:</strong> {farmer.phone_number}</p>
                <p><strong>Region:</strong> {farmer.region}</p>

                <div className="mt-4">
                  <h4 className="font-bold mb-2">Planted Products:</h4>
                  {farmer.planted_products && farmer.planted_products.length > 0 ? (
                    <ul className="list-disc ml-6 space-y-1">
                      {farmer.planted_products.map((product, index) => (
                        <li key={index}>
                          <strong>{product.product.name}</strong> —{" "}
                          {product.planting_area} ha /{" "}
                          {product.expecting_weight} tons /{" "}
                          {product.wph} % 
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No planted products.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFarmers.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No farmers found.</p>
        )}
      </div>
      <Sidebar />
    </div>
  );
};

export default Farmers;