import { memo, useMemo } from "react";
import { useWatch } from "react-hook-form";

const CategoryAttributeSelect = memo(
  ({ control, register, errors, categories }) => {
    const selectedCategoryId = useWatch({
      control,
      name: "category",
    });

    const leafCategories = useMemo(() => {
      if (!categories || categories.length === 0) return [];

      const result = [];

      categories.forEach((level1) => {
        level1.children?.forEach((level2) => {
          level2.children?.forEach((level3) => {
            if (level3.level === 3 && level3.isLeaf) {
              result.push({
                _id: level3._id,
                name: `${level1.name} → ${level2.name} → ${level3.name}`,
                allowedAttributes: level2.allowedAttributes || [],
              });
            }
          });
        });
      });

      return result;
    }, [categories]);

    const selectedCategory = useMemo(
      () => leafCategories.find((cat) => cat._id === selectedCategoryId),
      [leafCategories, selectedCategoryId]
    );

    return (
      <>
        <div className="flex flex-col gap-1 pb-3">
          <label className="text-sm md:text-lg text-gray-900">Category</label>

          <select
            {...register("category", { required: "Category is required" })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 lg:h-11 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select Category</option>
            {leafCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {errors.category && (
            <p className="text-red-600">{errors.category.message}</p>
          )}
        </div>

        {selectedCategory?.allowedAttributes?.map((attr) => (
          <div key={attr._id} className="mb-4">
            <label className="block font-medium mb-1">{attr.name}</label>

            <div className="flex gap-3 flex-wrap">
              {attr.values.map((value) => (
                <label key={value} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={value}
                    {...register(`attributes.${attr.name}`, {
                      required: true,
                    })}
                  />
                  {value}
                </label>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  }
);

export default CategoryAttributeSelect;

