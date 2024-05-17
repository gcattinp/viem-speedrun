
import { Hex, createPublicClient, http, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";

import dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(privateKey as Hex);

// Info about the account
// npx ts-node src/1-account.ts
// console.log(account);

//IIFE
(async () => {
  const client = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(process.env.API_URL),
  });

  const balance = await client.getBalance({
    address: account.address
  });
  // formatEther is a helper function to convert wei to ether
  console.log(formatEther(balance));

  const nonce = await client.getTransactionCount({
    address: account.address
  });
  console.log(nonce);
})();
