import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SummaryView } from "./components/SummaryView"
import { SalesByTypeView } from "./components/SalesByTypeView"
import { PersonnelView } from "./components/PersonnelView"

export default function DataAnalysisPage() {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-6 p-6">
        <Tabs defaultValue="summary" className="w-full">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-3">
            <TabsList className="bg-transparent border-b pb-px">
              <TabsTrigger 
                value="summary" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
              >
                ∑ Özet Veriler
              </TabsTrigger>
              <TabsTrigger 
                value="sales-by-type"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
              >
                ⭐ Satış Türüne Göre
              </TabsTrigger>
              <TabsTrigger 
                value="personnel"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
              >
                ⭐ Personele Göre
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="summary" className="mt-6">
            <SummaryView />
          </TabsContent>

          <TabsContent value="sales-by-type" className="mt-6">
            <SalesByTypeView />
          </TabsContent>

          <TabsContent value="personnel" className="mt-6">
            <PersonnelView />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}
