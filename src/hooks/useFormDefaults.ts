import { useMemo } from "react";
import type { User, EditProfileFormData } from "@/interface/interfaces";

export const useFormDefaults = (user?: User): Partial<EditProfileFormData> => {
  return useMemo(
    () => ({
      brandNameAr: user?.userDto?.nameAr || "",
      brandNameEn: user?.userDto?.nameEn || "",
      email: user?.userDto?.email || "",
      brandDescriptionsAr: user?.brandDescriptionsAr || "",
      brandDescriptionsEn: user?.brandDescriptionsEn || "",
      iban: user?.brandWalletDto?.iban || "",
      bankAccountNumber: user?.brandWalletDto?.bankAccountNumber || "",
      bankName: user?.brandWalletDto?.bankName || "",
    }),
    [user]
  );
};
