import type React from "react";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface ChatButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1 hover:bg-green-50 hover:border-green-300 transition-colors"
      title={t("chatWithCustomer", { defaultValue: "Chat with customer" })}
    >
      <MessageCircle size={16} className="text-green-600" />
      <span className="hidden sm:inline">
        {t("chat", { defaultValue: "Chat" })}
      </span>
    </Button>
  );
};
