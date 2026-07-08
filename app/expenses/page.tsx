import { prisma } from "@/lib/db";
import { Receipt, Coins } from "lucide-react";

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({ orderBy: { date: 'desc' } }).catch(() => []);
  const transactions = await prisma.transaction.findMany({ orderBy: { date: 'desc' } }).catch(() => []);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <main className="min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Mandir Seva Record</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Transparent records of temple expenses and public transactions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Expenses Table */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Receipt className="text-temple-saffron" size={32} />
            <h2 className="text-2xl font-bold">Seva Material Expenses</h2>
          </div>
          
          <div className="mb-6 p-4 bg-temple-saffron/10 rounded-xl text-temple-saffron font-bold text-lg flex justify-between">
            <span>Total Expenditure:</span>
            <span>₹{totalExpense.toLocaleString("en-IN")}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Remark</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map(exp => (
                    <tr key={exp.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 whitespace-nowrap">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{exp.category}</td>
                      <td className="py-3 px-4 font-medium text-red-500">₹{exp.amount.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{exp.remark || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">No expense records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Coins className="text-temple-gold" size={32} />
            <h2 className="text-2xl font-bold">Public Transactions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map(txn => (
                    <tr key={txn.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 whitespace-nowrap">{new Date(txn.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold">
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-green-600">₹{txn.amount.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{txn.description || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">No public transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
