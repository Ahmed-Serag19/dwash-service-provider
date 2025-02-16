// Mock data and API calls
const mockOrders = [
  {
    id: 1,
    service: "Exterior Wash",
    customer: "Alice Johnson",
    status: "In Progress",
    amount: 50,
  },
  {
    id: 2,
    service: "Interior Wash",
    customer: "Bob Smith",
    status: "Pending",
    amount: 100,
  },
  {
    id: 3,
    service: "Car Polishing",
    customer: "Charlie Brown",
    status: "In Progress",
    amount: 190,
  },
];

const mockServices = [
  {
    serviceId: 1,
    brandId: 1,
    brandNameAr: "غسيل سيارات 1",
    brandNameEn: "Car Wash 1",
    servicesNameAr: "غسيل خارجي",
    servicesNameEn: "Exterior Wash",
    servicesDescriptionsAr: "غسيل خارجي شامل للسيارة",
    servicesDescriptionsEn: "Comprehensive exterior wash for the car",
    servicesPrice: 50,
    servicesTypeId: 1,
    serviceTypeNameAr: "غسيل",
    serviceTypeNameEn: "Wash",
    servicesStatus: 0,
    serviceImages: [],
    extraServices: [],
  },
  {
    serviceId: 2,
    brandId: 2,
    brandNameAr: "غسيل سيارات 2",
    brandNameEn: "Car Wash 2",
    servicesNameAr: "غسيل داخلي",
    servicesNameEn: "Interior Wash",
    servicesDescriptionsAr: "تنظيف داخلي شامل للسيارة",
    servicesDescriptionsEn: "Comprehensive interior cleaning for the car",
    servicesPrice: 70,
    servicesTypeId: 2,
    serviceTypeNameAr: "تنظيف",
    serviceTypeNameEn: "Cleaning",
    servicesStatus: 1,
    serviceImages: [],
    extraServices: [
      {
        extraNameAr: "تلميع داخلي",
        extraNameEn: "Interior Polishing",
        extraDescriptionsAr: "تلميع داخلي للسيارة",
        extraDescriptionsEn: "Interior polishing for the car",
        extraPrice: 30,
      },
    ],
  },
  {
    serviceId: 3,
    brandId: 3,
    brandNameAr: "غسيل سيارات 3",
    brandNameEn: "Car Wash 3",
    servicesNameAr: "تلميع السيارة",
    servicesNameEn: "Car Polishing",
    servicesDescriptionsAr: "تلميع شامل للسيارة",
    servicesDescriptionsEn: "Comprehensive car polishing",
    servicesPrice: 100,
    servicesTypeId: 3,
    serviceTypeNameAr: "تلميع",
    serviceTypeNameEn: "Polishing",
    servicesStatus: 0,
    serviceImages: [],
    extraServices: [
      {
        extraNameAr: "تلميع خارجي",
        extraNameEn: "Exterior Polishing",
        extraDescriptionsAr: "تلميع خارجي للسيارة",
        extraDescriptionsEn: "Exterior polishing for the car",
        extraPrice: 40,
      },
      {
        extraNameAr: "تنظيف المحرك",
        extraNameEn: "Engine Cleaning",
        extraDescriptionsAr: "تنظيف شامل للمحرك",
        extraDescriptionsEn: "Comprehensive engine cleaning",
        extraPrice: 50,
      },
    ],
  },
];

const mockWallet = { balance: 0 };

const mockTimeSlots = [
  { id: 1, time: "09:00 AM" },
  { id: 2, time: "11:00 AM" },
  { id: 3, time: "02:00 PM" },
];

export const fetchOrders = () => Promise.resolve(mockOrders);
export const fetchServices = () => Promise.resolve(mockServices);
export const fetchWallet = () => Promise.resolve(mockWallet);
export const fetchTimeSlots = () => Promise.resolve(mockTimeSlots);
[
  {
    extraNameAr: " خدمة غسيل اضافية",
    extraDescriptionsAr: "خدمة تعطير السيارات",
    extraPrice: 50,
  },
  {
    extraNameAr: "2خدمة غسيل اضافه",
    extraDescriptionsAr: "2خدمة غسيل اضافه",
    extraPrice: 60,
  },
];
