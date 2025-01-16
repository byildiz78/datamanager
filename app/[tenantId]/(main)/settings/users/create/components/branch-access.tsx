'use client';

import { Store, Globe, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface BranchAccessProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function BranchAccess({ formData, setFormData }: BranchAccessProps) {
  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm overflow-hidden">
      <CardContent className="pt-6 relative">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Şubelerde ara..."
              className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
            />
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20">
            {[
              {
                id: "01-m1",
                name: "01 ADANA M1",
                location: "TÜRKİYE",
                currency: "TL",
              },
              {
                id: "01-tb",
                name: "01 ADANA TÜRKMENBAŞI",
                location: "TÜRKİYE",
                currency: "TL",
              },
              {
                id: "02-m",
                name: "02 BURSA",
                location: "TÜRKİYE",
                currency: "TL",
              },
            ].map((branch) => (
              <div
                key={branch.id}
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-all duration-200 bg-background/40 border border-border/10 hover:border-border/20 group"
              >
                <Checkbox
                  id={branch.id}
                  checked={formData.branchAccess.includes(branch.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({
                        ...formData,
                        branchAccess: [...formData.branchAccess, branch.id],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        branchAccess: formData.branchAccess.filter(
                          (id: string) => id !== branch.id
                        ),
                      });
                    }
                  }}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={branch.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    <Store className="w-4 h-4 text-primary/80" />
                    {branch.name}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    {branch.location}
                  </p>
                </div>
                <div className="text-sm font-medium bg-primary/10 px-3 py-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                  {branch.currency}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
