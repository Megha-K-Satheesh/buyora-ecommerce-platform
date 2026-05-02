


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallet, setPage } from "../../../Redux/slices/walletSlice";
import Navbar from "../../../components/ui/Navbar";
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
     <div className="lg:hidden block">
      <Navbar/>
    </div>
    <div className="max-w-4xl ml-20  p-4 mt-25">
      <h1 className="text-3xl font-bold text-text-primary mb-6">
        My Wallet
      </h1>

      <div className="bg-primary hover:bg-primary-hover text-white rounded-lg p-6 mb-6 shadow flex flex-col items-center justify-center h-50">
        <h2 className="text-xl font-semibold">Wallet Balance</h2>
        <p className="text-3xl  font-bold mt-2">₹{balance}</p>
      </div>

      <h3 className="text-lg font-semibold mb-4 text-text-primary">Transactions</h3>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && transactions.length === 0 && <p>No transactions yet.</p>}

      <ul className="space-y-4">
        {transactions.map((tx) => (
          <li
            key={tx.createdAt}
            className="flex justify-between items-center p-4 rounded shadow-sm bg-bg-main"
          >
            <div>
              <p className="font-medium text-text-primary">{tx.reason}</p>
              {tx.orderNumber && (
                <p className="text-sm text-text-muted">Order: {tx.orderNumber}</p>
              )}
              <p className="text-sm text-text-light">
                {new Date(tx.createdAt).toLocaleString()}
              </p>
            </div>
            <div
              className={
                tx.type === "CREDIT"
                  ? "text-success font-bold"
                  : "text-danger font-bold"
              }
            >
              {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount}
            </div>
          </li>
        ))}
      </ul>

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
