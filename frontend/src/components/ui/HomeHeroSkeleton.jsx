const HomeHeroSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="w-full h-[260px] md:h-[460px] rounded-2xl bg-gray-200" />

      <div className="mt-5 flex flex-col items-center">
        <div className="h-8 w-52 bg-gray-200 rounded-md" />

        <div className="h-4 w-72 bg-gray-200 rounded-md mt-3" />

        <div className="h-5 w-24 bg-gray-200 rounded-md mt-4" />
      </div>
    </div>
  );
};

export default HomeHeroSkeleton;
