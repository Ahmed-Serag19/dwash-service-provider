import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkEnvironmentIssues } from "@/utils/enviroment-checker";

export const EnvironmentChecker = () => {
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    setIssues(checkEnvironmentIssues());
  }, []);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Environment Check</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {issues.map((issue, index) => (
            <li key={index} className="text-sm">
              {issue}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
