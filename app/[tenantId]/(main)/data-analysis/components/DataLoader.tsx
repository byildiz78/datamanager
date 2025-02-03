import { Loader2 } from "lucide-react"

interface DataLoaderProps {
  fullscreen?: boolean;
}

export function DataLoader({ fullscreen = true }: DataLoaderProps) {
  const containerClass = fullscreen 
    ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
    : "w-full h-full min-h-[200px] flex items-center justify-center bg-background/50";

  const innerContainerClass = fullscreen
    ? "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
    : "flex flex-col items-center justify-center";

  return (
    <div className={containerClass}>
      <div className={innerContainerClass}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-lg font-semibold text-foreground">
              Veriler Yükleniyor
            </h3>
            <p className="text-sm text-muted-foreground">
              Lütfen bekleyin...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
