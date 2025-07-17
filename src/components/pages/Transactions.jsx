import { useState, useEffect } from "react";
import { format } from "date-fns";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import transactionsData from "@/services/mockData/transactions.json";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTransactions(transactionsData);
    } catch (err) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="table" className="max-w-4xl mx-auto" />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Error message={error} onRetry={loadTransactions} />
      </div>
    );
  }

  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
            <p className="text-gray-600">
              {transactions.length > 0 
                ? `${transactions.length} transactions totaling $${totalAmount.toFixed(2)}`
                : "No transactions found"
              }
            </p>
          </div>
        </div>

        {transactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-reddit-orange rounded-lg flex items-center justify-center">
                  <ApperIcon name="CreditCard" className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-reddit-blue rounded-lg flex items-center justify-center">
                  <ApperIcon name="Hash" className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-reddit-light rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(totalAmount / transactions.length).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {transactions.length === 0 ? (
        <Empty
          icon="CreditCard"
          title="No transactions found"
          description="Transaction history will appear here once you make your first purchase."
          actionLabel="View Pricing"
          onAction={() => {}}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(transaction.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ApperIcon name="Receipt" className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{transaction.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;