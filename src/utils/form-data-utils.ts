import type { EditProfileFormData } from "@/interface/interfaces"

export const buildFormData = (data: EditProfileFormData): FormData => {
  const formData = new FormData()

  // Text fields
  const textFields = [
    "brandNameAr",
    "brandNameEn",
    "brandDescriptionsAr",
    "brandDescriptionsEn",
    "iban",
    "bankAccountNumber",
    "bankName",
  ] as const

  textFields.forEach((field) => {
    formData.append(field, data[field].trim())
  })

  // File fields
  const fileFields = ["brandLogo", "brandBackgroundImage", "bankCertificate"] as const

  fileFields.forEach((field) => {
    if (data[field]?.[0]) {
      formData.append(field, data[field][0])
    }
  })

  return formData
}
