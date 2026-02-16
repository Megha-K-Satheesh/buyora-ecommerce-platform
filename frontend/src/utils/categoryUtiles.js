

export const CategoryUtils = {
  flattenCategories: (nestedCategories) => {
    const result = [];

    nestedCategories.forEach(level1 => {
      if (level1.children && level1.children.length > 0) {
        const level2List = level1.children.map(level2 => ({
          id: level2._id,
          name: level2.name
        }));

        result.push({
          heading: level1.name,
          options: level2List
        });
      }
    });

    return result;
  },
 

 getBrandsForCategory: (categories, brands, selectedCategoryId) => {
    if (!categories || !brands || !selectedCategoryId) return [];

     const selectedCategory = categories
    .flatMap(cat => [cat, ...(cat.children || [])])
    .flatMap(cat => [cat, ...(cat.children || [])])
    .find(cat => cat._id === selectedCategoryId);

  if (!selectedCategory) return [];


    // get parent L2 ID
    const parentL2Id = selectedCategory.parentId;
    if (!parentL2Id) return [];

    // filter brands linked to this L2
    const filteredBrands = brands.filter(brand =>Array.isArray(brand.categories) &&
    brand.categories.some(c => c.toString() === parentL2Id.toString())
  );

    return filteredBrands;
  }}
