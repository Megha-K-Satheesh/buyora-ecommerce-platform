







const LowStockProductsTable = ({ products }) => {
  return (
    <div className="bg-bg-main p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text-primary">
          Low Stock Products
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="py-3 text-left">Product</th>
              <th className="py-3 text-left">Stock Left</th>
            </tr>
          </thead>

          <tbody>

            {products?.map((p, index) => (

              <tr
                key={p.productId}
                className={`border-b border-border hover:bg-bg-soft-hover transition ${
                  index % 2 === 0 ? "bg-bg-main" : "bg-bg-muted"
                }`}
              >

                <td className="py-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-11 h-auto object-cover rounded-lg"
                    />

                    <span className="font-medium text-text-secondary">
                      {p.name}
                    </span>

                  </div>

                </td>

                <td className="font-bold text-danger">
                  {p.stockLeft}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default LowStockProductsTable;
