require("dotenv").config();
const yargs = require("yargs/yargs");
const _ = require("lodash");
const { Alchemy, Network } = require("alchemy-sdk");

const argv = yargs(process.argv.slice(2))
  .command("$0 <contractAddress>", "fetch NFT contract metadata", (yargs) =>
    yargs.positional("contractAddress", { type: "string", required: true }).demandOption("contractAddress")
  )
  .option("network", {
    alias: "n",
    describe: "Network",
    choices: Object.values(Network),
    default: Network.ETH_MAINNET,
  })
  .option("apiKey", { alias: "k", describe: "Alchemy API key" }).argv;

const { contractAddress, network, apiKey } = argv;

const settings = {
  apiKey,
  network,
};

const alchemy = new Alchemy(settings);

async function getNftsForContract(contractAddress) {
  try {
    // Get the async iterable for the contract's NFTs.
    const iterator = alchemy.nft.getNftsForContractIterator(contractAddress);

    const nfts = [];
    for await (const nft of iterator) nfts.push(nft);

    return nfts;
  } catch (error) {
    console.log(error);
  }
}

getNftsForContract(contractAddress).then((nfts) => {
  const metadata = _.chain(nfts)
    .keyBy("tokenId")
    .mapValues((nft) => {
      const { name, image_data, attributes } = nft.rawMetadata;
      return { name, image_data, attributes };
    })
    .value();
  console.log(JSON.stringify(metadata, null, 2));
});
