import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { endpoints } from "@/constants/endPoints";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { downloadPDF } from "@/utils/downloadUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownToLine, Wallet } from "lucide-react";

interface BalanceDetails {
  balanceId: number;
  totalAmount: number;
  deductionPrs: number;
  deductionAmount: number;
  dueAmount: number;
}

interface WalletData {
  totalAmount: number;
  totalDeductionAmount: number;
  dueAmount: number;
  balanceDetails: BalanceDetails[];
}

const WalletComponent: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData | null>({
    totalAmount: 5931.0,
    totalDeductionAmount: 6524.1,
    dueAmount: -593.1,
    balanceDetails: [
      {
        balanceId: 4,
        totalAmount: 900.0,
        deductionPrs: 10,
        deductionAmount: 90.0,
        dueAmount: -90.0,
      },
      {
        balanceId: 5,
        totalAmount: -100.0,
        deductionPrs: 10,
        deductionAmount: -10.0,
        dueAmount: 10.0,
      },
      {
        balanceId: 7,
        totalAmount: 2331.0,
        deductionPrs: 10,
        deductionAmount: 233.1,
        dueAmount: -233.1,
      },
      {
        balanceId: 8,
        totalAmount: 900.0,
        deductionPrs: 10,
        deductionAmount: 90.0,
        dueAmount: -90.0,
      },
      {
        balanceId: 9,
        totalAmount: 500.0,
        deductionPrs: 10,
        deductionAmount: 50.0,
        dueAmount: -50.0,
      },
      {
        balanceId: 10,
        totalAmount: 900.0,
        deductionPrs: 10,
        deductionAmount: 90.0,
        dueAmount: -90.0,
      },
      {
        balanceId: 11,
        totalAmount: 500.0,
        deductionPrs: 10,
        deductionAmount: 50.0,
        dueAmount: -50.0,
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // useEffect(() => {
  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(endpoints.getWallet, {
        headers: {
          Authorization: `Bearer {sessionStorage.getItem("accessToken")}`,
        },
      });
      if (response.data.success) {
        setWalletData(response.data.content);
      } else {
        toast.error(t("walletFetchError"));
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error(t("walletFetchError"));
    } finally {
      setLoading(false);
    }
  };
  console.log(fetchWalletData);
  //   fetchWalletData();
  // }, [t]);

  const handleDownload = () => {
    if (!walletData) return;
    downloadPDF(walletData, t("walletDetails"));
  };

  if (loading) {
    return <p className="text-center py-8">{t("loading")}</p>;
  }

  if (!walletData) {
    return <p className="text-center py-8">{t("noWalletData")}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-950 flex items-center">
            <Wallet className="mr-2" />
            {t("walletSummary")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t("totalBalance")}
                </p>
                <p className="text-2xl font-bold">
                  {walletData.totalDeductionAmount.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t("netBalance")}
                </p>
                <p className="text-2xl font-bold">
                  {walletData.totalAmount.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t("outstandingAmount")}
                </p>
                <p className="text-2xl font-bold">
                  {walletData.dueAmount.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions">
                {t("transactions")}
              </TabsTrigger>
              <TabsTrigger value="details">{t("details")}</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions" className="min-h-72">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("balanceId")}</TableHead>
                    <TableHead>{t("grossBalance")}</TableHead>
                    <TableHead>{t("deductionPrs")}</TableHead>
                    <TableHead>{t("deductionAmount")}</TableHead>
                    <TableHead>{t("netDue")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {walletData.balanceDetails.map((detail) => (
                    <TableRow key={detail.balanceId}>
                      <TableCell>{detail.balanceId}</TableCell>
                      <TableCell>{detail.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{detail.deductionPrs}%</TableCell>
                      <TableCell>{detail.deductionAmount.toFixed(2)}</TableCell>
                      <TableCell>{detail.dueAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="details" className="min-h-72">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {t("totalTransactions")}
                    </span>
                    <span>{walletData.balanceDetails.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {t("averageTransaction")}
                    </span>
                    <span>
                      {(
                        walletData.totalAmount /
                        walletData.balanceDetails.length
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {t("highestTransaction")}
                    </span>
                    <span>
                      {Math.max(
                        ...walletData.balanceDetails.map((d) => d.totalAmount)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {t("lowestTransaction")}
                    </span>
                    <span>
                      {Math.min(
                        ...walletData.balanceDetails.map((d) => d.totalAmount)
                      ).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleDownload}>
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              {t("downloadPDF")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletComponent;
