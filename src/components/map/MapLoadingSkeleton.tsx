import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface MapLoadingSkeletonProps {
  progress?: number;
  locationsLoaded?: number;
}

const MapLoadingSkeleton = ({ progress = 0, locationsLoaded = 0 }: MapLoadingSkeletonProps) => {
  return (
    <div className="absolute inset-0 bg-muted/30 flex flex-col">
      {/* Map background skeleton */}
      <div className="flex-1 relative">
        <Skeleton className="absolute inset-0 rounded-none" />
        
        {/* Fake map grid lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-muted-foreground/10" />
            ))}
          </div>
        </div>
        
        {/* Animated marker placeholders */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Cluster of markers - top left area */}
          <div className="absolute top-[15%] left-[20%] animate-pulse">
            <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-primary/50" />
          </div>
          <div className="absolute top-[18%] left-[25%] animate-pulse delay-100">
            <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-primary/40" />
          </div>
          
          {/* Cluster - center area */}
          <div className="absolute top-[40%] left-[45%] animate-pulse delay-200">
            <div className="w-10 h-10 rounded-full bg-primary/40 border-2 border-primary/60 flex items-center justify-center">
              <span className="text-xs font-medium text-primary/70">...</span>
            </div>
          </div>
          <div className="absolute top-[35%] left-[50%] animate-pulse delay-75">
            <div className="w-6 h-6 rounded-full bg-green-500/30 border-2 border-green-500/50" />
          </div>
          <div className="absolute top-[45%] left-[55%] animate-pulse delay-150">
            <div className="w-7 h-7 rounded-full bg-yellow-500/30 border-2 border-yellow-500/50" />
          </div>
          
          {/* Cluster - bottom right */}
          <div className="absolute top-[65%] left-[70%] animate-pulse delay-300">
            <div className="w-8 h-8 rounded-full bg-blue-500/30 border-2 border-blue-500/50" />
          </div>
          <div className="absolute top-[70%] left-[75%] animate-pulse delay-200">
            <div className="w-6 h-6 rounded-full bg-purple-500/30 border-2 border-purple-500/50" />
          </div>
          
          {/* Scattered single markers */}
          <div className="absolute top-[25%] left-[60%] animate-pulse delay-100">
            <div className="w-5 h-5 rounded-full bg-primary/25 border-2 border-primary/45" />
          </div>
          <div className="absolute top-[55%] left-[30%] animate-pulse delay-250">
            <div className="w-5 h-5 rounded-full bg-green-500/25 border-2 border-green-500/45" />
          </div>
          <div className="absolute top-[75%] left-[40%] animate-pulse delay-150">
            <div className="w-5 h-5 rounded-full bg-yellow-500/25 border-2 border-yellow-500/45" />
          </div>
        </div>
        
        {/* Loading indicator overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-background/95 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border border-border flex flex-col items-center gap-3 min-w-[200px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm font-medium text-foreground">Loading map data...</span>
            {progress > 0 && (
              <>
                <Progress value={progress} className="w-full h-2" />
                <span className="text-xs text-muted-foreground">
                  {locationsLoaded > 0 ? `${locationsLoaded} locations loaded` : `${progress}% complete`}
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Fake zoom controls skeleton */}
        <div className="absolute right-3 bottom-20 flex flex-col gap-1">
          <Skeleton className="w-10 h-10 rounded" />
          <Skeleton className="w-10 h-10 rounded" />
        </div>
        
        {/* Fake map type control skeleton */}
        <div className="absolute right-3 top-3">
          <Skeleton className="w-24 h-8 rounded" />
        </div>
      </div>
    </div>
  );
};

export default MapLoadingSkeleton;
