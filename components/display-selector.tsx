"use client";
import Skeleton from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
const DisplaySelector = ({ displayType, setDisplayType }: any) => {
  const displayGrid = () => {
    setDisplayType("grid");
  };
  const displayColumns = () => {
    setDisplayType("columns");
  };

  return (
    <div className="flex gap-2 w-fit   ">
      <Button
        onClick={displayGrid}
        className={`flex items-center justify-center whitespace-nowrap 
        ${
          displayType == "grid"
            ? "border-border bg-background hover:bg-background hover:text-primary"
            : "hover:bg-transparent hover:border-border"
        }
        `}
        variant={displayType == "grid" ? "outline" : "ghost"}
        size="sm"
      >
        <Icons.grid className="h-6 w-6" />
      </Button>
      <Button
        onClick={displayColumns}
        className={`flex items-center justify-center whitespace-nowrap 
        ${
          displayType == "columns"
            ? "border-border bg-background hover:bg-background hover:text-primary"
            : "hover:bg-transparent hover:border-border"
        }
        `}
        variant={displayType == "columns" ? "outline" : "ghost"}
        size="sm"
      >
        <Icons.chart className="h-6 w-6" />
      </Button>
    </div>
  );
};
export default DisplaySelector;
