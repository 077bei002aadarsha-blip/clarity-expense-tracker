import React,{useState, useEffect} from "react";

import { useAuth } from "../context/AuthContext";

import  {transactionAPI, Transaction, CreateTransactionData} from '../services/api';

const Dashboard: React.FC = () => {
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
    
    // Dark mode state
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

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
  
  // Dark mode colors
  const colors = {
    bg: darkMode ? '#121212' : '#f5f5f5',
    text: darkMode ? '#ffffff' : '#000000',
    cardBg: darkMode ? '#1e1e1e' : '#ffffff',
    border: darkMode ? '#333' : '#e0e0e0',
    incomeText: '#4caf50', // Bright green
    expenseText: '#f44336', // Bright red
    balanceText: '#2196f3', // Bright blue
    tableHeader: darkMode ? '#2a2a2a' : '#fafafa',
  };
  
    return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', color: colors.text }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome, {user?.name}!</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '8px 16px',
              backgroundColor: darkMode ? '#ffd700' : '#333',
              color: darkMode ? '#000' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
            Logout
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: colors.cardBg, borderRadius: '12px', border: `2px solid ${colors.border}`, boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: colors.incomeText, fontSize: '16px', fontWeight: '500' }}>Total Income</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: colors.incomeText }}>${calculateTotals().totalIncome.toFixed(2)}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: colors.cardBg, borderRadius: '12px', border: `2px solid ${colors.border}`, boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: colors.expenseText, fontSize: '16px', fontWeight: '500' }}>Total Expenses</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: colors.expenseText }}>${calculateTotals().totalExpense.toFixed(2)}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: colors.cardBg, borderRadius: '12px', border: `2px solid ${colors.border}`, boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: colors.balanceText, fontSize: '16px', fontWeight: '500' }}>Balance</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: colors.balanceText }}>${calculateTotals().balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Add/Edit Transaction Form */}
      <div style={{ padding: '25px', marginBottom: '30px', backgroundColor: colors.cardBg, borderRadius: '12px', border: `2px solid ${colors.border}`, boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              style={{ width: '100%', padding: '8px', backgroundColor: darkMode ? '#3a3a3a' : '#fff', color: colors.text, border: `1px solid ${colors.border}` }}
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
              style={{ width: '100%', padding: '8px', backgroundColor: darkMode ? '#3a3a3a' : '#fff', color: colors.text, border: `1px solid ${colors.border}` }}
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
              style={{ width: '100%', padding: '8px', backgroundColor: darkMode ? '#3a3a3a' : '#fff', color: colors.text, border: `1px solid ${colors.border}` }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', backgroundColor: darkMode ? '#3a3a3a' : '#fff', color: colors.text, border: `1px solid ${colors.border}` }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              style={{ width: '100%', padding: '8px', backgroundColor: darkMode ? '#3a3a3a' : '#fff', color: colors.text, border: `1px solid ${colors.border}` }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', backgroundColor: darkMode ? '#3a3a3a' : '#fff', color: colors.text, border: `1px solid ${colors.border}` }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              style={{ width: '100%', padding: '8px', backgroundColor: darkMode ? '#3a3a3a' : '#fff', color: colors.text, border: `1px solid ${colors.border}` }}
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
      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: colors.cardBg, borderRadius: '12px', border: `2px solid ${colors.border}`, boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              style={{ width: '100%', padding: '6px', backgroundColor: darkMode ? '#3a3a3a' : '#fff', color: colors.text, border: `1px solid ${colors.border}` }}
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
              style={{ width: '100%', padding: '6px', backgroundColor: darkMode ? '#3a3a3a' : '#fff', color: colors.text, border: `1px solid ${colors.border}` }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '6px', backgroundColor: darkMode ? '#3a3a3a' : '#fff', color: colors.text, border: `1px solid ${colors.border}` }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: '100%', padding: '6px', backgroundColor: darkMode ? '#3a3a3a' : '#fff', color: colors.text, border: `1px solid ${colors.border}` }}
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div style={{ padding: '25px', backgroundColor: colors.cardBg, borderRadius: '12px', border: `2px solid ${colors.border}`, boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0 }}>Transactions ({filteredTransactions.length})</h2>
        {loading && <p>Loading...</p>}
        {!loading && filteredTransactions.length === 0 && (
          <p>No transactions found. Add your first transaction above!</p>
        )}
        {!loading && filteredTransactions.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: darkMode ? '#252525' : '#fafafa', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: colors.tableHeader }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `2px solid ${colors.border}` }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `2px solid ${colors.border}` }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `2px solid ${colors.border}` }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `2px solid ${colors.border}` }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: `2px solid ${colors.border}` }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: `2px solid ${colors.border}` }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: '12px' }}>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: transaction.type === 'income' 
                        ? (darkMode ? 'rgba(76, 175, 80, 0.2)' : '#c8e6c9') 
                        : (darkMode ? 'rgba(244, 67, 54, 0.2)' : '#ffcdd2'),
                      color: transaction.type === 'income' ? '#4caf50' : '#f44336'
                    }}>
                      {transaction.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{transaction.category}</td>
                  <td style={{ padding: '12px' }}>{transaction.description || '-'}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: transaction.type === 'income' ? colors.incomeText : colors.expenseText }}>
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
    </div>
  );
};

export default Dashboard;
