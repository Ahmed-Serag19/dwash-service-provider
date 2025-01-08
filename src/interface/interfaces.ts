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
  userAddressDto: any | null;
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
  requestDto: any | null;
  brandWalletDto: BrandWalletDto;
}

export interface UserContextProps {
  user: UserContent | null;
  isLoading: boolean;
  error: string | null;
}
