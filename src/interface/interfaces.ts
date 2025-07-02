interface UserDto {
  id: number;
  username: string;
  email: string;
  identificationNumber: string;
  userType: string;
  nameAr: string;
  nameEn: string;
  status: number;
  agreementAccept: number;
  createdOn: string;
  identityTyNameAr: string;
  identityTyNameEn: string;
  mobile: string;
  identificationTypeId: string;
  userAddressDto: string | null;
}

interface BrandWalletDto {
  walletId: number;
  iban: string | null;
  bankAccountNumber: string | null;
  bankCertificate: string | null;
  bankId: string | null;
  bankName: string | null;
  totalAmount: number | null;
  deductionPrs: number;
  rejectTotalFine: number | null;
  transferDate: string | null;
  userId: number | null;
  updateOn: string | null;
}

export interface UserContent {
  brandId: number;
  brandNameAr: string;
  brandNameEn: string;
  brandDescriptionsAr: string | null;
  brandDescriptionsEn: string | null;
  brandLogo: string | null;
  brandBackgroundImage: string | null;
  brandArtistFirstNameAr: string | null;
  brandArtistFatherNameAr: string | null;
  brandArtistLastNameAr: string | null;
  brandArtistFirstNameEn: string | null;
  brandArtistFatherNameEn: string | null;
  brandArtistLastNameEn: string | null;
  brandStatus: string | null;
  brandCountryId: string | null;
  brandCityId: string | null;
  userDto: UserDto;
  brandDistrictId: string | null;
  brandCreatedNo: string | null;
  requestDto: string | null;
  brandWalletDto: BrandWalletDto;
}

export interface UserContextProps {
  user: UserContent | null;
  isLoading: boolean;
  error: string | null;
  notifications: Notification[];
  isNotificationsLoading: boolean;
  markNotificationAsRead: (id: number) => void;
}

export interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export interface Notification {
  notificationId: number;
  notificationTitleEn: string;
  notificationTitleAr: string;
  notificationDescriptionEn: string;
  notificationDescriptionAr: string;
  read: number;
  createdOn: string;
  new: boolean;
}
export interface TimePickerProps {
  label: string;
  selectedTime: string;
  onTimeChange: (hour: number, minute: number) => void;
}

export interface Slot {
  slotId: number;
  brandNameAr: string;
  brandNameEn: string;
  timeFrom: string;
  timeTo: string;
  date: string;
  reserved: number;
  username: string | null;
  mobile: string | null;
}

interface ExtraService {
  extraNameAr: string;
  extraNameEn: string;
  extraDescriptionsAr: string;
  extraDescriptionsEn: string;
  extraPrice: number | null;
}

export interface Service {
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
  extraServices: ExtraService[];
}

export interface AddServiceRequest {
  servicesNameAr: string;
  servicesNameEn: string;
  servicesDescriptionsAr: string;
  servicesDescriptionsEn: string;
  servicesPrice: number;
  servicesTypeId: number;
  extraServices: ExtraService[];
  serviceImages: File[];
}

export interface ExtraServiceFormProps {
  extraServices: ExtraService[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onActivate: (serviceId: number) => void;
  onDeactivate: (serviceId: number) => void;
}

export interface ItemExtra {
  itemExtraId: number;
  itemExtraNameAr: string;
  itemExtraNameEn: string;
  invoiceItemId: number;
  itemExtraPrice: number;
}

export interface Item {
  invoiceItemId: number;
  invoiceId: number;
  itemNameAr: string;
  itemNameEn: string;
  serviceTypeAr: string;
  serviceTypeEn: string;
  itemPrice: number;
  itemExtraDtos: ItemExtra[] | null;
}

export interface Request {
  id: number;
  requestCodeId: number;
  createdOn: string;
  waitingProcessId: number;
  status: number;
  statusName: "WAITING" | "ACCEPTED" | "UNDER_PROCESSING" | "COMPLETED";
  requestTypeNameAr: string;
  requestTypeNameEn: string;
  cancellation: boolean;
}

export interface Order {
  invoiceId: number;
  brandId: number;
  brandNameAr: string;
  brandNameEn: string;
  userNameAr: string;
  userNameEn: string;
  userPhoneNumber: string;
  userAddressDto: {
    latitude: string;
    longitude: string;
  };
  status: string;
  totalAmount: number;
  discountAmount: number;
  dueAmount: number;
  reviewed: boolean;
  fromTime: string;
  timeTo: string;
  reservationDate: string;
  request: Request;
  itemDto: Item;
}

export interface OrdersResponse {
  success: boolean;
  messageEn: string;
  messageAr: string;
  content: {
    data: Order[];
    totalPages: number;
    totalElements: number;
    numberOfElements: number;
  };
}

export interface ItemExtraDto {
  itemExtraNameEn: string;
  itemExtraNameAr: string;
  itemExtraPrice: number;
}

export interface ItemDto {
  itemNameEn: string;
  itemNameAr: string;
  serviceTypeEn: string;
  serviceTypeAr: string;
  itemPrice: number;
  itemExtraDtos: ItemExtraDto[];
}

export interface OpenOrder {
  invoiceId: number;
  brandNameEn: string;
  brandNameAr: string;
  userNameEn: string;
  userNameAr: string;
  userPhoneNumber: string;
  totalAmount: number;
  fromTime: string;
  timeTo: string;
  reservationDate: string;
  latitude: string;
  longitude: string;
  request: Request;
  itemDto: ItemDto;
  status: string;
  discountAmount: number;
  dueAmount: number;
  reviewed: boolean;
}

export interface ClosedOrder {
  invoiceId: number;
  brandNameEn: string;
  brandNameAr: string;
  userNameEn: string;
  userNameAr: string;
  userPhoneNumber: string;
  totalAmount: number;
  fromTime: string;
  timeTo: string;
  reservationDate: string;
  latitude: string;
  longitude: string;
  request: Request;
  itemDto: ItemDto;
  status: string;
  discountAmount: number;
  dueAmount: number;
  reviewed: boolean;
}

export interface InitiateFormData {
  email: string;
}

export interface FinalizeFormData {
  confirmationCode: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface User {
  userDto?: {
    nameAr?: string;
    nameEn?: string;
    email?: string;
  };
  brandDescriptionsAr?: string;
  brandDescriptionsEn?: string;
  brandWalletDto?: {
    iban?: string;
    bankAccountNumber?: string;
    bankName?: string;
  };
}

export interface EditProfileFormData {
  brandNameAr: string;
  brandNameEn: string;
  email: string;
  brandDescriptionsAr: string;
  brandDescriptionsEn: string;
  iban: string;
  bankAccountNumber: string;
  bankName: string;
  brandLogo: FileList;
  brandBackgroundImage: FileList;
  bankCertificate: FileList;
}

export interface ValidationRule {
  required?: string;
  maxLength?: { value: number; message: string };
  minLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
}

export interface FileValidationConfig {
  maxSize: number;
  allowedTypes: string[];
  errorMessages: {
    size: string;
    type: string;
  };
}

export interface OrderModalProps {
  language: string;
  order: Order;
  refetchCurrent: () => void;
  refetchClosed: () => void;
  isClosed?: boolean;
}

export interface OrderActionProps {
  order: Order;
  onAction: (id: number) => Promise<void>;
  loading: boolean;
  isClosed?: boolean;
}

export interface OrderSectionProps {
  order: Order;
  language: string;
}
// Define the order action types for better type safety
export type OrderAction = "accept" | "reject" | "proceed" | "complete";

// Define the order status enum for better maintainability
export enum OrderStatus {
  WAITING = "WAITING",
  ACCEPTED = "ACCEPTED",
  UNDER_PROCESSING = "UNDER_PROCESSING",
  COMPLETED = "COMPLETED",
  COMPLETED_BY_ADMIN = "COMPLETED_BY_ADMIN",
  CANCELLED = "CANCELLED",
  CANCELLED_BY_ADMIN = "CANCELLED_BY_ADMIN",
  REJECTED = "REJECTED",
}

// Define waiting process IDs
export enum WaitingProcessId {
  INITIAL = 1,
  READY_TO_PROCEED = 2,
}
