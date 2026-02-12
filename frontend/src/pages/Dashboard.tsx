import React,{useState, useEffect} from "react";

import { useAuth } from "../context/AuthContext";

import  {transactionAPI, Transaction, CreateTransactionData} from '../services/api';

const Dashboard: React.FC = ()=>
{
    const {user,logout} = useAuth();
    const [transactions,setTransactions] = useState<Transaction[]>([]);
    const [loading,setLoading] = useState(false);

    const  [type, setType] = useState<'income' | 'expense'>('expense');
    const  [category, setCategory] = useState('');
    const  [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [filterCategory, setFilterCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(()=>
    {
      fetchTransactions();
    },[]);
    
    const fetchTransactions = async()=>
    {
        setLoading(true);
        try{
            const data = await transactionAPI.getAll();
            console.log('Fetched transactions:', data);
            console.log('Is array?', Array.isArray(data));
            console.log('Length:', data?.length);
            setTransactions(data || []);
        } catch(error){
            console.error("Error fetching transactions:", error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async(e: React.FormEvent)=>
    {
        e.preventDefault();
        setLoading(true);

        const transactionData: CreateTransactionData = {
            type,
            category,
            amount: parseFloat(amount),
            description,
            date,
        };
        
        console.log('Submitting transaction:', transactionData);
        
        try{
      if (editingId) {
        // UPDATE existing transaction
        await transactionAPI.update(editingId, transactionData);
      } else {
        // CREATE new transaction
        await transactionAPI.create(transactionData);
      }
      
      // Refresh the list
      await fetchTransactions();
      
      // Clear form
      resetForm();
    } 
    catch (error) {
      console.error('Failed to save transaction:', error);
      alert('Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };
  
  // Load transaction into form for editing
  const handleEdit = (transaction: Transaction) => {
    setType(transaction.type);
    setCategory(transaction.category);
    setAmount(transaction.amount.toString());
    setDescription(transaction.description || '');
    setDate(transaction.date.split('T')[0]); // Remove time part
    setEditingId(transaction.id);
  };
   const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    
    setLoading(true);
    try {
      await transactionAPI.delete(id);
      await fetchTransactions();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      alert('Failed to delete transaction');
    } finally {
      setLoading(false);
    }
  };
   const resetForm = () => {
    setType('expense');
    setCategory('');
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setEditingId(null);
  };
  
  // Apply filters to transactions
  const getFilteredTransactions = () => {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter(t => {
      // Filter by type
      if (filterType !== 'all' && t.type !== filterType) return false;
      
      // Filter by category
      if (filterCategory && !t.category.toLowerCase().includes(filterCategory.toLowerCase())) return false;
      
      // Filter by start date
      if (startDate && t.date < startDate) return false;
      
      // Filter by end date
      if (endDate && t.date > endDate) return false;
      
      return true;
    });
  };
  
  // Calculate totals
  const calculateTotals = () => {
    const filtered = getFilteredTransactions();
    
    const totalIncome = filtered
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpense = filtered
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalIncome - totalExpense;
    
    return { totalIncome, totalExpense, balance };
  };
  
  const filteredTransactions = getFilteredTransactions();
  const { totalIncome, totalExpense, balance } = calculateTotals();
  
  console.log('Transactions:', transactions.length);
  console.log('Filtered:', filteredTransactions.length);
  console.log('Totals:', { totalIncome, totalExpense, balance });
  
    return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome, {user?.username}!</h1>
        <button
          onClick={logout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
          <h3>Total Income</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${totalIncome.toFixed(2)}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
          <h3>Total Expenses</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${totalExpense.toFixed(2)}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: balance >= 0 ? '#d1ecf1' : '#f8d7da', borderRadius: '8px' }}>
          <h3>Balance</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Add/Edit Transaction Form */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2>{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Food, Salary, Rent"
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Amount:</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : editingId ? 'Update Transaction' : 'Add Transaction'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              style={{ width: '100%', padding: '6px' }}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Category:</label>
            <input
              type="text"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              placeholder="Search..."
              style={{ width: '100%', padding: '6px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '6px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div>
        <h2>Transactions ({filteredTransactions.length})</h2>
        {loading && <p>Loading...</p>}
        {!loading && filteredTransactions.length === 0 && (
          <p>No transactions found. Add your first transaction above!</p>
        )}
        {!loading && filteredTransactions.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#e9ecef' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: transaction.type === 'income' ? '#d4edda' : '#f8d7da',
                      color: transaction.type === 'income' ? '#155724' : '#721c24'
                    }}>
                      {transaction.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{transaction.category}</td>
                  <td style={{ padding: '12px' }}>{transaction.description || '-'}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(transaction)}
                      style={{
                        padding: '4px 12px',
                        marginRight: '5px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
