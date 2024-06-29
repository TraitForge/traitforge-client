const TransactionsDisplay = () => {
  const transactions: any[] = [];

  return (
    <div className="transactions-container">
      <h1 className="transactions-header"> Activity </h1>
      {transactions.length > 0 ? (
        transactions.map((tx: any, index: number) => (
          <div key={index} className="transaction">
            <p>Type: {tx.type}</p>
            <p>From: {tx.from}</p>
            <p>To: {tx.to || 'N/A'}</p>
            <p>Amount: {tx.amount || 'N/A'}</p>
            <p>Token ID: {tx.tokenId || 'N/A'}</p>
            <p>Parent IDs: {tx.parentIds ? tx.parentIds.join(', ') : 'N/A'}</p>
            <p>Time: {new Date(tx.timestamp).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No transactions have occurred.</p>
      )}
    </div>
  );
};

export default TransactionsDisplay;
