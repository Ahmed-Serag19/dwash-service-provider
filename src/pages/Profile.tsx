import React from "react";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DummyUser from "@/assets/images/dummy-user.webp";
import DummyBg from "@/assets/images/dummy-bg.webp";
const Profile: React.FC = () => {
  const { user, isLoading } = useUser();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/edit-profile", { state: { user } });
  };

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader" />
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8" style={{ direction }}>
      {/* Hero Section */}
      <div className="relative mb-8">
        <img
          src={user?.brandBackgroundImage || DummyBg}
          alt={t("brandBackground")}
          className="w-full h-96 object-cover rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <div className="flex items-end">
            <img
              src={user?.brandLogo || DummyUser}
              alt={t("brandLogo")}
              className="w-24 h-24 rounded-full border-4 border-white mr-4"
            />
            <div className="mx-5">
              <h1
                className="text-3xl font-bold text-white"
                style={{ textAlign: i18n.language === "ar" ? "right" : "left" }}
              >
                {user?.userDto?.nameAr || t("notProvided")}
              </h1>
              <p className="text-gray-200">
                {user?.userDto?.email || t("notProvided")}
              </p>
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
        <TabsContent value="brand">
          <Card className="min-h-52">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileField
                  label={t("brandNameAr")}
                  value={user?.userDto?.nameAr || ""}
                />
                {i18n.language === "en" ? (
                  <ProfileField
                    label={t("brandNameEn")}
                    value={user?.userDto?.nameEn || ""}
                  />
                ) : (
                  <div className="mb-4">
                    <span>{user?.userDto?.nameEn || ""} </span>
                    <span className="font-semibold text-gray-700 mx-2">
                      {" "}
                      :{t("brandNameEn")}
                    </span>
                  </div>
                )}
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
        <TabsContent value="bank">
          <Card className="min-h-52">
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
        <TabsContent value="images">
          <Card className="min-h-52">
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
      <div className="my-5">
        <Button className="" onClick={handleEdit}>
          {t("edit")}
        </Button>
      </div>
    </div>
  );
};

const ProfileField: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="mb-4">
    <span className="font-semibold text-gray-700 mx-2">{label}: </span>
    <span>{value || ""}</span>
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
