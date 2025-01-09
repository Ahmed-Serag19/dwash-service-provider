import React from "react";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile: React.FC = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/edit-profile", { state: { user } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative mb-8">
        <img
          src={user?.brandBackgroundImage || ""}
          alt="Brand Background"
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <div className="flex items-end">
            <img
              src={user?.brandLogo || ""}
              alt="Brand Logo"
              className="w-24 h-24 rounded-full border-4 border-white mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">
                {user?.userDto?.nameEn}
              </h1>
              <p className="text-gray-200">{user?.userDto?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="brand">
        <TabsList className="mb-8">
          <TabsTrigger value="brand">{t("brandInformation")}</TabsTrigger>
          <TabsTrigger value="bank">{t("bankInformation")}</TabsTrigger>
          <TabsTrigger value="images">{t("images")}</TabsTrigger>
        </TabsList>
        <TabsContent value="brand" className="min-h-52">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileField
                  label={t("brandNameAr")}
                  value={user?.userDto?.nameAr || ""}
                />
                <ProfileField
                  label={t("brandNameEn")}
                  value={user?.userDto?.nameEn || ""}
                />
                <ProfileField
                  label={t("email")}
                  value={user?.userDto?.email || ""}
                />
                <ProfileField
                  label={t("brandDescriptionsAr")}
                  value={user?.brandDescriptionsAr || ""}
                />
                <ProfileField
                  label={t("brandDescriptionsEn")}
                  value={user?.brandDescriptionsEn || ""}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bank" className="min-h-52">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileField
                  label={t("iban")}
                  value={user?.brandWalletDto?.iban || ""}
                />
                <ProfileField
                  label={t("bankAccountNumber")}
                  value={user?.brandWalletDto?.bankAccountNumber || ""}
                />
                <ProfileField
                  label={t("bankName")}
                  value={user?.brandWalletDto?.bankName || ""}
                />
              </div>
              {user?.brandWalletDto?.bankCertificate && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("bankCertificate")}
                  </h3>
                  <ProfileImage
                    label={t("bankCertificate")}
                    src={user?.brandWalletDto?.bankCertificate}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="images" className="min-h-52">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileImage
                  label={t("brandLogo")}
                  src={user?.brandLogo || ""}
                />
                <ProfileImage
                  label={t("brandBackgroundImage")}
                  src={user?.brandBackgroundImage || ""}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Button className="absolute top-4 right-4" onClick={handleEdit}>
        {t("edit")}
      </Button>
    </div>
  );
};

const ProfileField: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="mb-4">
    <span className="font-semibold text-gray-700">{label}: </span>
    <span>{value || "Not Provided"}</span>
  </div>
);

const ProfileImage: React.FC<{ label: string; src: string }> = ({
  label,
  src,
}) => (
  <div className="mb-4">
    <span className="font-semibold text-gray-700">{label}: </span>
    <img src={src} alt={label} className="mt-2 max-w-full h-auto rounded" />
  </div>
);

export default Profile;
