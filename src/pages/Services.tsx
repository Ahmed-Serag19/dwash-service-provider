import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Modal from "@/components/ui/Modal";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { endpoints } from "@/constants/endPoints";

interface ExtraService {
  extraNameAr: string;
  extraNameEn: string;
  extraDescriptionsAr: string;
  extraDescriptionsEn: string;
  extraPrice: number | null;
}

interface AddServiceRequest {
  addServiceReq: {
    servicesNameAr: string;
    servicesNameEn: string;
    servicesDescriptionsAr: string;
    servicesDescriptionsEn: string;
    servicesPrice: number;
    servicesTypeId: number;
    extraServices: string;
  };
  serviceImages: string[];
}

const Services: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExtraService, setShowExtraService] = useState(false);
  const [formData, setFormData] = useState<AddServiceRequest>({
    addServiceReq: {
      servicesNameAr: "",
      servicesNameEn: "",
      servicesDescriptionsAr: "",
      servicesDescriptionsEn: "",
      servicesPrice: 0,
      servicesTypeId: 1,
      extraServices: "",
    },
    serviceImages: [],
  });
  const [extraService, setExtraService] = useState<ExtraService>({
    extraNameAr: "",
    extraNameEn: "",
    extraDescriptionsAr: "",
    extraDescriptionsEn: "",
    extraPrice: null,
  });
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length + formData.serviceImages.length > 5) {
      toast.error(t("maxImagesError"));
      return;
    }

    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setFormData((prev) => ({
      ...prev,
      serviceImages: [...prev.serviceImages, ...newImages],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      serviceImages: prev.serviceImages.filter((_, i) => i !== index),
    }));
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      addServiceReq: {
        ...prev.addServiceReq,
        [name]:
          name === "servicesPrice" || name === "servicesTypeId"
            ? Number(value)
            : value,
      },
    }));
  };

  const handleExtraServiceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExtraService((prev) => ({
      ...prev,
      [name]: name === "extraPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (showExtraService) {
        formData.addServiceReq.extraServices = JSON.stringify(extraService);
      }

      await axios.post(endpoints.addService, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });

      toast.success(t("serviceAddedSuccessfully"));
      setIsModalOpen(false);
      setFormData({
        addServiceReq: {
          servicesNameAr: "",
          servicesNameEn: "",
          servicesDescriptionsAr: "",
          servicesDescriptionsEn: "",
          servicesPrice: 0,
          servicesTypeId: 1,
          extraServices: "",
        },
        serviceImages: [],
      });
      setExtraService({
        extraNameAr: "",
        extraNameEn: "",
        extraDescriptionsAr: "",
        extraDescriptionsEn: "",
        extraPrice: null,
      });
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error(t("errorAddingService"));
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-full py-5">
        <div className="ml-auto">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-950 text-white hover:bg-blue-900"
          >
            {t("addService")}
          </Button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {t("addNewService")}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="servicesNameEn"
                className="block mb-2 text-md text-blue-950 mt-2 "
              >
                {t("serviceNameEn")}
              </Label>
              <Input
                id="servicesNameEn"
                name="servicesNameEn"
                value={formData.addServiceReq.servicesNameEn}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label
                htmlFor="servicesNameAr"
                className="block mb-2 text-md text-blue-950 mt-2 "
              >
                {t("serviceNameAr")}
              </Label>
              <Input
                id="servicesNameAr"
                name="servicesNameAr"
                value={formData.addServiceReq.servicesNameAr}
                onChange={handleInputChange}
                required
                dir="rtl"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                className="text-md block text-blue-950 mt-2 mb-2 "
                htmlFor="servicesDescriptionsEn"
              >
                {t("serviceDescriptionEn")}
              </Label>
              <Textarea
                id="servicesDescriptionsEn"
                name="servicesDescriptionsEn"
                value={formData.addServiceReq.servicesDescriptionsEn}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label
                className="text-md text-blue-950 mt-2 mb-2 block"
                htmlFor="servicesDescriptionsAr"
              >
                {t("serviceDescriptionAr")}
              </Label>
              <Textarea
                id="servicesDescriptionsAr"
                name="servicesDescriptionsAr"
                value={formData.addServiceReq.servicesDescriptionsAr}
                onChange={handleInputChange}
                required
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center">
            <div>
              <Label
                className="text-md text-blue-950 mt-2 mb-2 block"
                htmlFor="servicesPrice"
              >
                {t("servicePrice")}
              </Label>
              <Input
                id="servicesPrice"
                name="servicesPrice"
                type="number"
                value={formData.addServiceReq.servicesPrice}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label
                htmlFor="serviceImages"
                className="block mb-2 text-gray-700"
              >
                {t("serviceImages")} (Max 5)
              </Label>
              <Input
                id="serviceImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full"
                disabled={formData.serviceImages.length >= 5}
              />
              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.serviceImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Service Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Label
              className="text-md text-blue-950 mt-2 mb-2 block"
              htmlFor="extra-service"
            >
              {t("addExtraService")}
            </Label>
            <span dir="ltr">
              <Switch
                id="extra-service"
                className=" text-blue-950 mt-2 mb-2 block"
                checked={showExtraService}
                onCheckedChange={setShowExtraService}
              />
            </span>
          </div>

          {showExtraService && (
            <div className="space-y-4 border p-4 rounded-md relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setShowExtraService(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    className="text-md text-blue-950 mt-2 mb-2 block"
                    htmlFor="extraNameEn"
                  >
                    {t("extraServiceNameEn")}
                  </Label>
                  <Input
                    id="extraNameEn"
                    name="extraNameEn"
                    value={extraService.extraNameEn}
                    onChange={handleExtraServiceChange}
                    required={showExtraService}
                  />
                </div>
                <div>
                  <Label
                    className="text-md text-blue-950 mt-2 mb-2 block"
                    htmlFor="extraNameAr"
                  >
                    {t("extraServiceNameAr")}
                  </Label>
                  <Input
                    id="extraNameAr"
                    name="extraNameAr"
                    value={extraService.extraNameAr}
                    onChange={handleExtraServiceChange}
                    required={showExtraService}
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    className="text-md text-blue-950 mt-2 mb-2 block"
                    htmlFor="extraDescriptionsEn"
                  >
                    {t("extraServiceDescriptionEn")}
                  </Label>
                  <Textarea
                    id="extraDescriptionsEn"
                    name="extraDescriptionsEn"
                    value={extraService.extraDescriptionsEn}
                    onChange={handleExtraServiceChange}
                    required={showExtraService}
                  />
                </div>
                <div>
                  <Label
                    className="text-md text-blue-950 mt-2 mb-2 block"
                    htmlFor="extraDescriptionsAr"
                  >
                    {t("extraServiceDescriptionAr")}
                  </Label>
                  <Textarea
                    id="extraDescriptionsAr"
                    name="extraDescriptionsAr"
                    value={extraService.extraDescriptionsAr}
                    onChange={handleExtraServiceChange}
                    required={showExtraService}
                    dir="rtl"
                  />
                </div>
              </div>
              <div>
                <Label
                  className="text-md text-blue-950 mt-2 mb-2 block"
                  htmlFor="extraPrice"
                >
                  {t("extraServicePrice")}
                </Label>
                <Input
                  id="extraPrice"
                  name="extraPrice"
                  type="number"
                  value={extraService.extraPrice || ""}
                  onChange={handleExtraServiceChange}
                  required={showExtraService}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 text-lg"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              size="lg"
              className="bg-blue-950 text-white hover:bg-blue-900 px-6 py-2 text-lg"
            >
              {t("save")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Services;
