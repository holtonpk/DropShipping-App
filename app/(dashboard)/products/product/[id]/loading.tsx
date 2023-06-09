import Skeleton from "@/components/ui/skeleton";

// ViewAccount skeleton
export default function Loading() {
  return (
    <div className="grid md:grid-cols-[30%_1fr] gap-4 p-4 container">
      <div className="md:hidden text-2xl font-bold capitalize">
        <Skeleton className="h-[40px] w-1/2" />
      </div>
      <div className=" grid md:grid-cols-1 grid-cols-[60%_1fr] sm:gap-4 gap-2 rounded-md h-fit ">
        <Skeleton className="h-[30px] w-[90%]" />
        <Skeleton className="h-[40px] w-full" />
        <Skeleton className="aspect-square w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4  w-full  rounded-md ">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
        </div>
      </div>

      <section className="gap-4 rounded-md  flex flex-col ">
        <div className="grid md:grid-cols-2 gap-4 h-[300px]">
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
        </div>
        <Skeleton className="h-[20px] w-[20%]" />
        <Skeleton className="h-[200px] w-[100%]" />
        <Skeleton className="h-[20px] w-[20%]" />

        <div className="grid md:grid-cols-6 grid-cols-3 gap-4 w-full">
          <Skeleton className="aspect-[9/16] w-full" />
          <Skeleton className="aspect-[9/16] w-full" />
          <Skeleton className="aspect-[9/16] w-full" />
          <Skeleton className="aspect-[9/16] w-full" />
          <Skeleton className="aspect-[9/16] w-full" />
          <Skeleton className="aspect-[9/16] w-full" />=
        </div>
      </section>
    </div>
  );
}
