import { Hex, createWalletClient, http, publicActions, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import funJson from "../artifacts/Fun.json"

import dotenv from "dotenv";

const { abi, bin } = funJson["contracts"]["contracts/Fun.sol:Fun"];

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(privateKey as Hex);
const contractAddress = "0x23c899a3c84b7bfb7d569b049ea5f6e7e21d53d1";

(async () => {
  const client = await createWalletClient({
    account,
    transport: http(process.env.API_URL),
    chain: arbitrumSepolia,
  });

  const contract = await getContract({
    address: contractAddress,
    abi,
    client
  })

  await contract.watchEvent.XWasChanged({
    onLogs: (logs) => console.log(logs)
  });

  let x = 55n;
  setInterval(async () => {
    await contract.write.changeX([x]);
    x++;
  }, 3000);
})();
