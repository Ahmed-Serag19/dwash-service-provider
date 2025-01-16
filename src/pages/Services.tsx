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
import { X, Plus } from "lucide-react";
import { endpoints } from "@/constants/endPoints";

interface ExtraService {
  extraNameAr: string;
  extraNameEn: string;
  extraDescriptionsAr: string;
  extraDescriptionsEn: string;
  extraPrice: number | null;
}

interface AddServiceRequest {
  servicesNameAr: string;
  servicesNameEn: string;
  servicesDescriptionsAr: string;
  servicesDescriptionsEn: string;
  servicesPrice: number;
  servicesTypeId: number;
  extraServices: ExtraService[];
  serviceImages: File[];
}

const Services: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExtraServices, setShowExtraServices] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddServiceRequest>({
    servicesNameAr: "",
    servicesNameEn: "",
    servicesDescriptionsAr: "",
    servicesDescriptionsEn: "",
    servicesPrice: 0,
    servicesTypeId: 1,
    extraServices: [],
    serviceImages: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "servicesPrice" || name === "servicesTypeId"
          ? Math.max(Number(value), 0)
          : value,
    }));
  };

  const handleExtraServiceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      extraServices: prev.extraServices.map((service, i) =>
        i === index
          ? {
              ...service,
              [name]:
                name === "extraPrice" ? Math.max(Number(value), 0) : value,
            }
          : service
      ),
    }));
  };

  const addExtraService = () => {
    setFormData((prev) => ({
      ...prev,
      extraServices: [
        ...prev.extraServices,
        {
          extraNameAr: "",
          extraNameEn: "",
          extraDescriptionsAr: "",
          extraDescriptionsEn: "",
          extraPrice: null,
        },
      ],
    }));
  };

  const removeExtraService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      extraServices: prev.extraServices.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    if (newFiles.length + formData.serviceImages.length > 5) {
      toast.error(t("maxImagesError"));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      serviceImages: [...prev.serviceImages, ...newFiles],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      serviceImages: prev.serviceImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const form = new FormData();
    form.append("servicesNameAr", formData.servicesNameAr);
    form.append("servicesNameEn", formData.servicesNameEn);
    form.append("servicesDescriptionsAr", formData.servicesDescriptionsAr);
    form.append("servicesDescriptionsEn", formData.servicesDescriptionsEn);
    form.append("servicesPrice", formData.servicesPrice.toString());
    form.append("servicesTypeId", formData.servicesTypeId.toString());
    form.append("extraServices", JSON.stringify(formData.extraServices));
    formData.serviceImages.forEach((image) =>
      form.append("serviceImages", image)
    );

    try {
      await axios.post(endpoints.addService, form, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });

      toast.success(t("serviceAddedSuccessfully"));
      setIsModalOpen(false);
      setFormData({
        servicesNameAr: "",
        servicesNameEn: "",
        servicesDescriptionsAr: "",
        servicesDescriptionsEn: "",
        servicesPrice: 0,
        servicesTypeId: 1,
        extraServices: [],
        serviceImages: [],
      });
      setShowExtraServices(false);
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error(t("errorAddingService"));
    } finally {
      setLoading(false);
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
          {/* Main service fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="servicesNameEn"
                className="block mb-2 text-md text-blue-950 mt-2"
              >
                {t("serviceNameEn")}
              </Label>
              <Input
                id="servicesNameEn"
                name="servicesNameEn"
                value={formData.servicesNameEn}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label
                htmlFor="servicesNameAr"
                className="block mb-2 text-md text-blue-950 mt-2"
              >
                {t("serviceNameAr")}
              </Label>
              <Input
                id="servicesNameAr"
                name="servicesNameAr"
                value={formData.servicesNameAr}
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
                htmlFor="servicesDescriptionsEn"
                className="text-md block text-blue-950 mt-2 mb-2"
              >
                {t("serviceDescriptionEn")}
              </Label>
              <Textarea
                id="servicesDescriptionsEn"
                name="servicesDescriptionsEn"
                value={formData.servicesDescriptionsEn}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label
                htmlFor="servicesDescriptionsAr"
                className="text-md text-blue-950 mt-2 mb-2 block"
              >
                {t("serviceDescriptionAr")}
              </Label>
              <Textarea
                id="servicesDescriptionsAr"
                name="servicesDescriptionsAr"
                value={formData.servicesDescriptionsAr}
                onChange={handleInputChange}
                required
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center">
            <div>
              <Label
                htmlFor="servicesPrice"
                className="text-md text-blue-950 mt-2 mb-2 block"
              >
                {t("servicePrice")}
              </Label>
              <Input
                id="servicesPrice"
                name="servicesPrice"
                type="number"
                value={formData.servicesPrice}
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
                      src={URL.createObjectURL(image) || "/placeholder.svg"}
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

          {/* Extra services section */}
          <div className="flex items-center gap-3">
            <Label
              htmlFor="extra-service"
              className="text-md text-blue-950 mt-2 mb-2 block"
            >
              {t("addExtraServices")}
            </Label>
            <span dir="ltr">
              <Switch
                id="extra-service"
                className="text-blue-950 mt-2 mb-2 block"
                checked={showExtraServices}
                onCheckedChange={setShowExtraServices}
              />
            </span>
          </div>

          {showExtraServices && (
            <div className="space-y-4 border p-4 rounded-md">
              {formData.extraServices.map((extraService, index) => (
                <div key={index} className="relative border p-4 rounded-md">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeExtraService(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor={`extraNameEn-${index}`}
                        className="text-md text-blue-950 mt-2 mb-2 block"
                      >
                        {t("extraServiceNameEn")}
                      </Label>
                      <Input
                        id={`extraNameEn-${index}`}
                        name="extraNameEn"
                        value={extraService.extraNameEn}
                        onChange={(e) => handleExtraServiceChange(index, e)}
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`extraNameAr-${index}`}
                        className="text-md text-blue-950 mt-2 mb-2 block"
                      >
                        {t("extraServiceNameAr")}
                      </Label>
                      <Input
                        id={`extraNameAr-${index}`}
                        name="extraNameAr"
                        value={extraService.extraNameAr}
                        onChange={(e) => handleExtraServiceChange(index, e)}
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label
                        htmlFor={`extraDescriptionsEn-${index}`}
                        className="text-md text-blue-950 mt-2 mb-2 block"
                      >
                        {t("extraServiceDescriptionEn")}
                      </Label>
                      <Textarea
                        id={`extraDescriptionsEn-${index}`}
                        name="extraDescriptionsEn"
                        value={extraService.extraDescriptionsEn}
                        onChange={(e) => handleExtraServiceChange(index, e)}
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`extraDescriptionsAr-${index}`}
                        className="text-md text-blue-950 mt-2 mb-2 block"
                      >
                        {t("extraServiceDescriptionAr")}
                      </Label>
                      <Textarea
                        id={`extraDescriptionsAr-${index}`}
                        name="extraDescriptionsAr"
                        value={extraService.extraDescriptionsAr}
                        onChange={(e) => handleExtraServiceChange(index, e)}
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label
                      htmlFor={`extraPrice-${index}`}
                      className="text-md text-blue-950 mt-2 mb-2 block"
                    >
                      {t("extraServicePrice")}
                    </Label>
                    <Input
                      id={`extraPrice-${index}`}
                      name="extraPrice"
                      type="number"
                      value={extraService.extraPrice || ""}
                      onChange={(e) => handleExtraServiceChange(index, e)}
                      required
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={addExtraService}
                className="mt-4 bg-green-600 text-white hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("addAnotherExtraService")}
              </Button>
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
              disabled={loading}
              size="lg"
              className="bg-blue-950 text-white hover:bg-blue-900 px-6 py-2 text-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
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
