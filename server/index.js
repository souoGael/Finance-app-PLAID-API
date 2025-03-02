const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserModel = require("./models/Users")
const bodyParser = require("body-parser")
// const dotenv = require("dotenv")
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: { // use a .env to ID this info before deployment
      'PLAID-CLIENT-ID': 'PASTE YOURS HERE',
      'PLAID-SECRET': 'PASTE YOURS HERE',
    },
  },
});

const plaidClient = new PlaidApi(configuration)
const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.json());

app.post('/create_link_token', async function (req, res) {
    // Get the client_user_id by searching for the current user
    // Check this line when inserting into mongoDB
    // const user = await User.find(...);
    // const clientUserId = user.id;

    const plaidRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: 'user',
      },
      client_name: 'Plaid Test App',
      products: ['auth', 'transactions'],
      language: 'en',
      redirect_uri: 'http://localhost:5173/',
      country_codes: ['US'],
    };
    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
        res.json(createTokenResponse.data);
    } catch (error) {
        // handle error
        res.status(500).send("failure")
    }
});

app.post('/auth', async function (req, res) {
    
    try {
      const access_token = req.body.access_token;
      const plaidRequest = {
        access_token: access_token,
      };
      const plaidResponse = await plaidClient.authGet(plaidRequest);
      res.json( plaidResponse.data );

    } catch (error) {
      // handle error
      res.status(500).send("failure")
    }
});

app.post('/exchange_public_token', async function (
    req,
    res,
    next,
  ) {
    const publicToken = req.body.public_token;
    try {
      const plaidResponse = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
      // These values should be saved to a persistent database and
      // associated with the currently signed-in user
      const accessToken = plaidResponse.data.access_token;
      res.json({ accessToken });
    } catch (error) {
      // handle error
      res.status(500).send("failure")
    }
});

app.post('/transactions', async (req, res) => {
    const { access_token, cursor } = req.body;

    const allTransactions = { added: [], modified: [], removed: [] }; // Collect all transactions

    let hasMore = true;
    let currentCursor = cursor || null;
  
    try {
      // Iterate through each page of new transaction updates for the item
      while (hasMore) {
        const plaidResponse = await plaidClient.transactionsSync({
          access_token: access_token,
          cursor: currentCursor,
        });
  
        const data = plaidResponse.data;
  
        // Concatenate this page of results to the respective arrays
        allTransactions.added.push(...data.added);
        allTransactions.modified.push(...data.modified);
        allTransactions.removed.push(...data.removed);
  
        // Check if there are more transactions to fetch
        hasMore = data.has_more;
        currentCursor = data.next_cursor; // Update cursor to the next cursor for subsequent syncs
      }
      
        // Save all transactions and the final cursor in MongoDB
        await UserModel.updateOne(
            { _id: 'PASTE YOURS HERE' }, // *** modify this to get userId dynamically
            {
                $set: {
                    transactions: allTransactions, 
                    transactionsCursor: currentCursor,

                },
            },
            { upsert: true } // Create the document if it doesn't exist
        );

      // Respond with all transactions gathered across all pages and the final cursor
      res.json({
        transactions: allTransactions,
        nextCursor: currentCursor, // Save this cursor for future syncs
      });
  
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: error.message });
    }
});


// ------------------- MongoDB ------------------- //

mongoose.connect("mongodb://localhost:PASTE YOURS HERE")


app.post('/login', (req,res) => {
    const {email, password} = req.body;
    
    UserModel.findOne({email: email})
    .then(user => {
        if(user){
            if(user.password === password){
                res.json("Success")
            }else {
                res.json("Password is incorrect")
            }
        }else {
            res.json("No matching record exists")
        }
    }) // user beacause I want to find the user ( naming convention )
    .catch(err => res.json(err))
}) 

app.post('/signup', (req,res) => {
    UserModel.create(req.body)
    .then(users => res.json(users)) // users because I am registering different users ( naming convention )
    .catch(err => res.json(err))
})

app.listen(3001, () => {
    console.log("server is running")
})
