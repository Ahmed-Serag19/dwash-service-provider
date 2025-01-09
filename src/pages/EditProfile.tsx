import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axios from "axios";
import { endpoints } from "@/constants/endPoints";

const EditProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};

  const [formData, setFormData] = useState({
    brandNameAr: user?.userDto?.nameAr || "",
    brandNameEn: user?.userDto?.nameEn || "",
    email: user?.userDto?.email || "",
    brandDescriptionsAr: user?.brandDescriptionsAr || "",
    brandDescriptionsEn: user?.brandDescriptionsEn || "",
    iban: user?.brandWalletDto?.iban || "",
    bankAccountNumber: user?.brandWalletDto?.bankAccountNumber || "",
    bankName: user?.brandWalletDto?.bankName || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(endpoints.editUser, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      toast.success("Profile updated successfully!");
      navigate("/profile"); // Navigate back to the profile page
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-950">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="brandNameAr"
          value={formData.brandNameAr}
          onChange={handleInputChange}
          placeholder="Brand Name (Arabic)"
        />
        <Input
          name="brandNameEn"
          value={formData.brandNameEn}
          onChange={handleInputChange}
          placeholder="Brand Name (English)"
        />
        <Textarea
          name="brandDescriptionsAr"
          value={formData.brandDescriptionsAr}
          onChange={handleInputChange}
          placeholder="Brand Description (Arabic)"
        />
        <Textarea
          name="brandDescriptionsEn"
          value={formData.brandDescriptionsEn}
          onChange={handleInputChange}
          placeholder="Brand Description (English)"
        />
        <Input
          name="iban"
          value={formData.iban}
          onChange={handleInputChange}
          placeholder="IBAN"
        />
        <Input
          name="bankAccountNumber"
          value={formData.bankAccountNumber}
          onChange={handleInputChange}
          placeholder="Bank Account Number"
        />
        <Input
          name="bankName"
          value={formData.bankName}
          onChange={handleInputChange}
          placeholder="Bank Name"
        />
        <div className="flex justify-center py-5 gap-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
