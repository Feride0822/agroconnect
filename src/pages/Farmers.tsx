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
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className={cn(
        "min-h-screen flex",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredFarmers.map((farmer) => (
            <Card key={farmer.id}>
              <CardHeader>
                <CardTitle>{farmer.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{farmer.farmName}</p>
                <p>Specialization: {farmer.specialization.join(", ")}</p>
                <p>Region: {farmer.region}</p>
                <p>Experience: {farmer.experience} years</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFarmers.length === 0 && <p>No farmers found.</p>}
      </div>
      <Sidebar />
    </div>
  );
};

export default Farmers;
