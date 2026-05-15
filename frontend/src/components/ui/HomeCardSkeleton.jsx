const HomeCardSkeleton = () => {
  return (
    <div className="px-2 animate-pulse">
      <div className="rounded-2xl overflow-hidden border border-gray-200">
        <div className="w-full h-[300px] bg-gray-200" />

        <div className="p-3 flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-200 rounded-md" />

          <div className="h-5 w-20 bg-gray-200 rounded-full mt-3" />
        </div>
      </div>
    </div>
  );
};

export default HomeCardSkeleton;
