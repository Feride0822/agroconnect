// src/pages/CompleteProfile.tsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { regions } from "@/lib/agricultural-data";
import { Base_Url } from "@/App";
import axios from "axios";

const RegiterGoogle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email"); // Or use location.state.email
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    password: "",
    re_password: "",
    role: "",
    region: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${Base_Url}/accounts/register/complete-profile/`, {
        email,
        ...formData,
      });
      console.log("Profile completed:", res.data);
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Profile completion error:", err);
      alert("Failed to complete profile.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* <div>
              <Label>First Name</Label>
              <Input value={formData.first_name} onChange={(e) => handleChange("first_name", e.target.value)} required />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={formData.last_name} onChange={(e) => handleChange("last_name", e.target.value)} required />
            </div> */}
            <div>
              <Label>Password</Label>
              <Input type="password" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} required />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input type="password" value={formData.re_password} onChange={(e) => handleChange("re_password", e.target.value)} required />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(val) => handleChange("role", val)} required>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Farmers">Farmer</SelectItem>
                  <SelectItem value="Exporters">Exporter</SelectItem>
                  <SelectItem value="Analysts">Market Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Region</Label>
              <Select value={formData.region} onValueChange={(val) => handleChange("region", val)} required>
                <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">Complete Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegiterGoogle;
