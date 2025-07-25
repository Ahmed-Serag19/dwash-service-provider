import React, { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DummyUser from "@/assets/images/dummy-user.webp";
import DummyBg from "@/assets/images/dummy-bg.webp";
import { Copy } from "lucide-react";

const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoading, refreshUser } = useUser();

  const handleEdit = () => {
    navigate("/edit-profile", { state: { user } });
  };

  useEffect(() => {
    refreshUser();
  }, []);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader" />
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8" style={{ direction }}>
      {/* Hero Section */}
      <div className="relative mb-4 sm:mb-8">
        <img
          src={`http://161.97.122.116${user?.brandBackgroundImage} ` || DummyBg}
          alt={t("brandBackground")}
          className="w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] object-cover rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end">
            <img
              src={`http://161.97.122.116${user?.brandLogo}` || DummyUser}
              alt={t("brandLogo")}
              className="w-20 h-20 sm:w-36 sm:h-36 rounded-full border-4 border-white mb-2 sm:mb-0 sm:mr-4"
            />
            <div className="text-center sm:text-left mx-2 sm:mx-5">
              <h1
                className="text-2xl sm:text-3xl font-bold text-white"
                style={{ textAlign: i18n.language === "ar" ? "right" : "left" }}
              >
                {user?.userDto?.nameAr || t("notProvided")}
              </h1>
              <p className="text-sm sm:text-base text-gray-200">
                {user?.userDto?.email || t("notProvided")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs
        defaultValue="brand"
        className="space-y-4 "
        dir={i18n.language === "en" ? "ltr" : "rtl"}
      >
        <TabsList className="flex flex-wrap justify-center items-center mb-4 sm:mb-8 max-w-sm ">
          <TabsTrigger value="brand" className="flex-grow sm:flex-grow-0">
            {t("brandInformation")}
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex-grow sm:flex-grow-0">
            {t("bankInformation")}
          </TabsTrigger>
          <TabsTrigger value="images" className="flex-grow sm:flex-grow-0">
            {t("images")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="brand">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 sm:gap-8">
                <div>
                  <p>{t("shareProfile")}</p>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`https://dw.dussur.sa/service-provider/${user?.brandId}`}
                      className="text-blue-900 font-semibold"
                      target="_blank"
                    >
                      {`https://dw.dussur.sa/service-provider/${user?.brandId}`}
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://dw.dussur.sa/service-provider/${user?.brandId}`
                        );
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
        <TabsContent value="bank">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1  gap-4 sm:gap-8">
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
                <div className="mt-4 sm:mt-8">
                  <h3 className="text-lg font-semibold mb-2 sm:mb-4">
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
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1  gap-4 sm:gap-8">
                <ProfileImage
                  label={t("brandLogo")}
                  src={`http://161.97.122.116${user?.brandLogo}` || ""}
                />
                <ProfileImage
                  label={t("brandBackgroundImage")}
                  src={
                    `http://161.97.122.116${user?.brandBackgroundImage}` || ""
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-4 sm:mt-8">
        <Button
          onClick={handleEdit}
          size={"lg"}
          className=" text-lg  sm:w-auto"
        >
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
  <div className="mb-2 sm:mb-4 flex flex-col">
    <span className="font-semibold text-gray-700 block sm:inline sm:mr-2 mb-3">
      {label}:
    </span>
    <span className="block sm:inline">{value || "Not Provided"}</span>
  </div>
);

const ProfileImage: React.FC<{ label: string; src: string }> = ({
  label,
  src,
}) => (
  <div className="mb-2 sm:mb-4">
    <span className="font-semibold text-gray-700 block mb-1">{label}: </span>
    <img src={src} alt={label} className="w-full max-w-md h-auto rounded" />
  </div>
);

export default Profile;
