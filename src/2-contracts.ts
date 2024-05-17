import { Hex, createWalletClient, http, publicActions, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import funJson from "../artifacts/Fun.json"

import dotenv from "dotenv";

const { abi, bin } = funJson["contracts"]["contracts/Fun.sol:Fun"];

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(privateKey as Hex);

(async () => {
  const client = createWalletClient({
    account,
    chain: arbitrumSepolia,
    transport: http(process.env.API_URL)
  }).extend(publicActions);

  const hash = await client.deployContract({
    abi,
    bytecode: `0x${bin}`,
    args: [23n],
  });
  console.log(hash);

  const { contractAddress } = await client.getTransactionReceipt({ hash });

  if(contractAddress) {
    const contract = getContract({
      address: contractAddress,
      abi,
      client
    });

    // SHORT METHOD
    console.log(await contract.read.x());
    await contract.write.changeX([42n]);
    console.log(await contract.read.x());

    console.log({ contractAddress });

    // LONG METHOD
    // const x = await client.readContract({
    //   address: contractAddress,
    //   abi,
    //   functionName: 'x'
    // });
    // console.log(x);

    // await client.writeContract({
    //   address: contractAddress,
    //   abi,
    //   functionName: "changeX",
    //   args: [42n],
    // });


    // const x2 = await client.readContract({
    //   address: contractAddress,
    //   abi,
    //   functionName: 'x'
    // });

    // console.log(x2);

  }
})();
