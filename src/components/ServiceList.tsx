import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { ServiceListProps, Service } from "../interface/interfaces";
import ServiceDetailsModal from "./ServiceDetailsModal";

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onEdit,
  onActivate,
  onDeactivate,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const openDetails = (service: Service) => {
    setSelectedService(service);
  };

  const closeDetails = () => {
    setSelectedService(null);
  };

  return (
    <>
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-y-10 gap-x-5">
        {services.map((service) => (
          <Card key={service.serviceId} className="overflow-hidden max-w-md">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {isArabic ? service.servicesNameAr : service.servicesNameEn}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {isArabic
                  ? service.servicesDescriptionsAr
                  : service.servicesDescriptionsEn}
              </p>
              <p className="font-bold">
                {t("price")}: {service.servicesPrice}
              </p>
              <Badge
                variant={service.servicesStatus === 0 ? "default" : "secondary"}
                className="mt-2"
              >
                {service.servicesStatus === 0 ? t("active") : t("inactive")}
              </Badge>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4 flex flex-col flex-wrap justify-between gap-2">
              <div className="gap-3 flex flex-1 w-full">
                <Button
                  variant="outline"
                  onClick={() => onEdit(service)}
                  className="flex-1 w-1/2 text-[17px]"
                >
                  {t("edit")}
                </Button>
                {service.servicesStatus === 0 ? (
                  <Button
                    variant="destructive"
                    onClick={() => onDeactivate(service.serviceId)}
                    className="flex-1 w-1/2 text-[17px]"
                  >
                    {t("deactivate")}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => onActivate(service.serviceId)}
                    className="flex-1 w-1/2 text-[17px]"
                  >
                    {t("activate")}
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => openDetails(service)}
                className="flex-1 w-full text-[17px]"
              >
                {t("details")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ServiceDetailsModal
        isOpen={!!selectedService}
        onClose={closeDetails}
        service={selectedService}
      />
    </>
  );
};

export default ServiceList;
