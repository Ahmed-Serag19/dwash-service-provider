import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Service } from "../interface/interfaces";

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] rounded-md ">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isArabic ? service.servicesNameAr : service.servicesNameEn}
          </DialogTitle>
          <DialogDescription>
            <Badge
              variant={service.servicesStatus === 0 ? "default" : "secondary"}
              className="mt-2"
            >
              {service.servicesStatus === 0 ? t("active") : t("inactive")}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">{t("price")}:</span>
            <span className="col-span-3">{service.servicesPrice}</span>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>{t("description")}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  <strong>{t("descriptionAr")}:</strong>{" "}
                  {service.servicesDescriptionsAr}
                </p>
                <p>
                  <strong>{t("descriptionEn")}:</strong>{" "}
                  {service.servicesDescriptionsEn}
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="extraServices">
              <AccordionTrigger>{t("extraServices")}</AccordionTrigger>
              <AccordionContent>
                {service.extraServices.length > 0 ? (
                  <ul className="space-y-4">
                    {service.extraServices.map((extra, index) => (
                      <li key={index} className="border-b pb-2">
                        <p className="font-semibold">
                          {isArabic ? extra.extraNameAr : extra.extraNameEn}
                        </p>
                        <p className="text-sm text-gray-600">
                          {isArabic
                            ? extra.extraDescriptionsAr
                            : extra.extraDescriptionsEn}
                        </p>
                        <p className="text-sm font-bold mt-1">
                          {t("price")}: {extra.extraPrice}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t("noExtraServices")}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("serviceImages")}</h3>
            {service.serviceImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {service.serviceImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.imagePath || "/placeholder.svg"}
                    alt={`Service Image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            ) : (
              <p>{t("noImagesAvailable")}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsModal;
