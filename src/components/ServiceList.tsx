import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Service {
  serviceId: number;
  brandId: number;
  brandNameAr: string;
  brandNameEn: string;
  servicesNameAr: string;
  servicesNameEn: string;
  servicesDescriptionsAr: string;
  servicesDescriptionsEn: string;
  servicesPrice: number;
  servicesTypeId: number;
  serviceTypeNameAr: string;
  serviceTypeNameEn: string;
  servicesStatus: number;
  serviceImages: { id: number; serviceId: number; imagePath: string }[];
  extraServices: {
    id: number;
    extraNameAr: string;
    extraNameEn: string;
    extraDescriptionsAr: string;
    extraDescriptionsEn: string;
    extraPrice: number;
  }[];
}

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onActivate: (serviceId: number) => void;
  onDeactivate: (serviceId: number) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onEdit,
  onActivate,
  onDeactivate,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <Card key={service.serviceId} className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">
              {isArabic ? service.servicesNameAr : service.servicesNameEn}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {isArabic
                ? service.servicesDescriptionsAr
                : service.servicesDescriptionsEn}
            </p>
            <p className="font-bold">
              {t("price")}: {service.servicesPrice}
            </p>
            <Badge
              variant={service.servicesStatus === 0 ? "success" : "destructive"}
              className="mt-2"
            >
              {service.servicesStatus === 0 ? t("active") : t("inactive")}
            </Badge>
          </CardContent>
          <CardFooter className="bg-gray-50 p-4 flex justify-between">
            <Button variant="outline" onClick={() => onEdit(service)}>
              {t("edit")}
            </Button>
            {service.servicesStatus === 0 ? (
              <Button
                variant="destructive"
                onClick={() => onDeactivate(service.serviceId)}
              >
                {t("deactivate")}
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => onActivate(service.serviceId)}
              >
                {t("activate")}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ServiceList;
