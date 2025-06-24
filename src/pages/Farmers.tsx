import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Base_Url } from "@/App";

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await axios.get(`${Base_Url}/accounts/farmers/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setFarmers(response.data);
    } catch (error) {
      console.error("Error fetching farmers", error);
    }
  };

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <input
        type="text"
        placeholder="Search farmers..."
        className="border p-2 rounded w-full mb-4"
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
  );
};

export default Farmers;