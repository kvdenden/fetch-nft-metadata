require("dotenv").config();
const _ = require("lodash");
const { Alchemy, Network } = require("alchemy-sdk");

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const [contractAddress] = process.argv.slice(2);

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
