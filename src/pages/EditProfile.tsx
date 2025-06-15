import type React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EditProfileForm } from "@/components/edit-profile/EditProfileForm";

const EditProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <EditProfileForm user={user} onCancel={handleCancel} />
    </div>
  );
};

export default EditProfile;
