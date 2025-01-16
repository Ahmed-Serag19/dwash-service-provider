import React, { useState, useEffect } from "react";
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
import ExtraServiceForm from "@/components/ExtraServiceForm";
import { Service, AddServiceRequest } from "@/interface/interfaces";
const Services: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExtraServices, setShowExtraServices] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
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

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(endpoints.getServices, {
        params: { size: 8, page: 0, servicesTypeId: 0 },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setServices(response.data.content.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error(t("errorFetchingServices"));
    }
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      if (editingService) {
        await axios.put(
          `${endpoints.editService}?serviceId=${editingService.serviceId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          }
        );
        toast.success(t("serviceUpdatedSuccessfully"));
      } else {
        await axios.post(endpoints.addService, form, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });
        toast.success(t("serviceAddedSuccessfully"));
      }
      setIsModalOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Error adding/updating service:", error);
      toast.error(t("errorAddingUpdatingService"));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      servicesNameAr: service.servicesNameAr,
      servicesNameEn: service.servicesNameEn,
      servicesDescriptionsAr: service.servicesDescriptionsAr,
      servicesDescriptionsEn: service.servicesDescriptionsEn,
      servicesPrice: service.servicesPrice,
      servicesTypeId: service.servicesTypeId,
      extraServices: service.extraServices,
      serviceImages: [],
    });
    setShowExtraServices(service.extraServices.length > 0);
    setIsModalOpen(true);
  };

  const handleActivate = async (serviceId: number) => {
    try {
      await axios.put(
        `${endpoints.activateService}?serviceId=${serviceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success(t("serviceActivatedSuccessfully"));
      fetchServices();
    } catch (error) {
      console.error("Error activating service:", error);
      toast.error(t("errorActivatingService"));
    }
  };

  const handleDeactivate = async (serviceId: number) => {
    try {
      await axios.put(
        `${endpoints.deactivateService}?serviceId=${serviceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success(t("serviceDeactivatedSuccessfully"));
      fetchServices();
    } catch (error) {
      console.error("Error deactivating service:", error);
      toast.error(t("errorDeactivatingService"));
    }
  };

  const resetForm = () => {
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
    setEditingService(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("services")}</h1>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-950 text-white hover:bg-blue-900"
        >
          {t("addService")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.serviceId}
            className="border rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-2">
              {i18n.language === "ar"
                ? service.servicesNameAr
                : service.servicesNameEn}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {i18n.language === "ar"
                ? service.servicesDescriptionsAr
                : service.servicesDescriptionsEn}
            </p>
            <p className="font-bold">
              {t("price")}: {service.servicesPrice}
            </p>
            <p
              className={`mt-2 ${
                service.servicesStatus === 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {service.servicesStatus === 0 ? t("active") : t("inactive")}
            </p>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => handleEdit(service)}>
                {t("edit")}
              </Button>
              {service.servicesStatus === 0 ? (
                <Button
                  variant="destructive"
                  onClick={() => handleDeactivate(service.serviceId)}
                >
                  {t("deactivate")}
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => handleActivate(service.serviceId)}
                >
                  {t("activate")}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingService ? t("editService") : t("addNewService")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <ExtraServiceForm
              onAdd={addExtraService}
              onChange={handleExtraServiceChange}
              onRemove={removeExtraService}
              extraServices={formData.extraServices}
            />
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
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
              {editingService ? t("update") : t("save")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Services;
