export function generateVariants(attributes) {
  const keys = Object.keys(attributes || {});
  if (!keys.length) return [];

  let variants = [{}];

  keys.forEach((key) => {
    let values = attributes[key];

    if (!Array.isArray(values)) {
      values = [values];
    }

    const temp = [];

    variants.forEach((variant) => {
      values.forEach((value) => {
        temp.push({
          ...variant,
          [key]: value,
        });
      });
    });

    variants = temp;
  });

  return variants;
}
