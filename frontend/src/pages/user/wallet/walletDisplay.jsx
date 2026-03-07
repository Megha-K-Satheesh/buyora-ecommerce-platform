
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallet, setPage } from "../../../Redux/slices/walletSlice";
import Pagination from "../../../components/ui/Pagination";


const Wallet = () => {
  const dispatch = useDispatch();
  const { balance, transactions, totalTransactions, page, limit, loading, error } =
    useSelector((state) => state.wallet);


  useEffect(() => {
    dispatch(getWallet({ page, limit }));
  }, [dispatch, page, limit]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage)); 
  };

  const totalPages = Math.ceil(totalTransactions / limit);

  return (

    <>
  
    <div className="max-w-4xl ml-20  p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
  My Wallet
</h1>
      {/* Balance Card */}
    <div className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 hover:from-pink-400 hover:via-pink-500 hover:to-pink-600 text-white rounded-lg p-6 mb-6 shadow flex flex-col items-center justify-center h-50">
  <h2 className="text-xl font-semibold">Wallet Balance</h2>
  <p className="text-3xl  font-bold mt-2">₹{balance}</p>
</div>

      {/* Transactions */}
      <h3 className="text-lg font-semibold mb-4">Transactions</h3>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && transactions.length === 0 && <p>No transactions yet.</p>}

      <ul className="space-y-4">
        {transactions.map((tx) => (
          <li
            key={tx.createdAt}
            className="flex justify-between items-center  p-4 rounded shadow-sm"
          >
            <div >
              <p className="font-medium">{tx.reason}</p>
              {tx.orderNumber && (
                <p className="text-sm text-gray-500">Order: {tx.orderNumber}</p>
              )}
              <p className="text-sm text-gray-400">
                {new Date(tx.createdAt).toLocaleString()}
              </p>
            </div>
            <div
              className={
                tx.type === "CREDIT"
                  ? "text-green-500 font-bold"
                  : "text-red-500 font-bold"
              }
            >
              {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount}
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>





    
    </>
  );
};

export default Wallet;
