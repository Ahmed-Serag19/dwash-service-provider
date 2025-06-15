import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

export default function ApiDebugger() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const testEndpoint = async () => {
    setLoading(true);
    try {
      // Test with minimal data first
      const testData = new FormData();
      testData.append("brandNameAr", "Test");
      testData.append("brandNameEn", "Test");

      const token = sessionStorage.getItem("accessToken");

      const result = await axios.put(
        "https://api.stg.2025.dwash.cood2.dussur.sa/api/freelancer/request/editBrand",
        testData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponse(`Success: ${JSON.stringify(result.data, null, 2)}`);
    } catch (error: any) {
      setResponse(
        `Error: ${JSON.stringify(
          {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers,
          },
          null,
          2
        )}`
      );
    }
    setLoading(false);
  };

  const testTokenValidity = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("accessToken");

      // Test with a simple GET request to check token validity
      const result = await axios.get(
        "https://api.stg.2025.dwash.cood2.dussur.sa/api/freelancer/profile", // or any GET endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponse(`Token Valid: ${JSON.stringify(result.data, null, 2)}`);
    } catch (error: any) {
      setResponse(
        `Token Error: ${JSON.stringify(
          {
            status: error.response?.status,
            message: error.response?.data,
          },
          null,
          2
        )}`
      );
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>API Debug Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={testTokenValidity} disabled={loading}>
            Test Token Validity
          </Button>
          <Button onClick={testEndpoint} disabled={loading}>
            Test Edit Endpoint (Minimal Data)
          </Button>
        </div>

        <Textarea
          value={response}
          readOnly
          className="min-h-[400px] font-mono text-sm"
          placeholder="Response will appear here..."
        />
      </CardContent>
    </Card>
  );
}
