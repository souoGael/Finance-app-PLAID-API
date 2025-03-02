import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePlaidLink } from 'react-plaid-link';

function PlaidAuth({publicToken}){
    const [account, setAccount] = useState()
    const [transactions, setTransactions] = useState(null);

    useEffect(() => {
        async function fetchData(){
            let accessToken = await axios.post("http://localhost:3001/exchange_public_token", { public_token: publicToken })

            const auth  = await axios.post("http://localhost:3001/auth", {access_token: accessToken.data.accessToken})
            setAccount(auth.data.numbers.ach[0])

            try {
                const cursor = null; // Pass null for the initial sync, or a saved cursor for subsequent calls
        
                const response = await axios.post('http://localhost:3001/transactions', {
                  access_token: accessToken.data.accessToken,
                  cursor,
                }); // I need to pass the userId in this body as well in order to add the transaction data properly
        
                const  transaction  = response.data.transactions;
        
                console.log('Transactions:', transaction);
                // console.log('Modified transactions:', modified);
                // console.log('Removed transactions:', removed);
        
                setTransactions( transaction );

                // // Send transactions data to MongoDB for the specific user
                // await axios.post('http://localhost:3001/addTransactions', {
                //     userId: '67263e118b4b4b01bbcb3954', // replace with dynamic userId if needed
                //     transactions,
                // });
        
              } catch (error) {
                console.error('Error fetching transactions:', error);
              }
        }
        fetchData()
    }, [])

    if (!transactions) return <p>Loading transactions...</p>;

    return account && (
        <>
             <p> Account number: { account.account } </p>
             <p> Routing number: { account.routing } </p>
             <table>
                <thead>
                    <tr>
                        {/* <th>ID</th> */}
                        <th>Name</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.added.map((t, index) => (
                    <tr key={index}>
                        {/* <td>{t.transaction_id}</td> */}
                        <td>{t.name}</td>
                        <td>{t.category[0]}</td>
                        <td>{t.amount}</td>
                        <td>{t.date}</td>
                        {/* <td>Added</td> */}
                    </tr>
                    ))}
                    {/* {transactions.modified.map((transaction) => (
                    <tr key={transaction.transaction_id}>
                        <td>{transaction.date}</td>
                        <td>{transaction.name}</td>
                        <td>{transaction.amount}</td>
                        <td>Modified</td>
                    </tr>
                    ))}
                    {transactions.removed.map((transaction) => (
                    <tr key={transaction.transaction_id}>
                        <td>N/A</td>
                        <td>{transaction.transaction_id}</td>
                        <td>N/A</td>
                        <td>Removed</td>
                    </tr>
                    ))} */}
                </tbody>
                </table>
        </>
       
    )
}

function Home(){
    const [linkToken, setLinkToken] = useState()
    const [publicToken, setPublicToken] = useState()

    useEffect(() => {
        async function fetch(){
            const response = await axios.post("http://localhost:3001/create_link_token")
            setLinkToken(response.data.link_token)
            // console.log("response", response.data)
        }
        fetch()
    }, [])

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
            setPublicToken(public_token)
            // console.log("success", public_token, metadata)
            // send public_token to server
        },
    });

    return publicToken ? ( <PlaidAuth publicToken={publicToken} />) : (
        <div className='align-center'>
            <h1>Welcome to your finance</h1>
            <button onClick={() => open()} disabled={!ready}>
                Connect a bank account
            </button> 
        </div>
    )
}

export default Home;