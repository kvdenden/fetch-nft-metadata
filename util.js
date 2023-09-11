const _ = require("lodash");

const toCSV = (data) => {
  const attributeKeys = _.chain(data).values().map("attributes").flatten().map("trait_type").uniq().value();
  const header = ["tokenId", "name", "image", ...attributeKeys];
  const rows = Object.entries(data).map(([tokenId, { name, image, attributes }]) => [
    tokenId,
    name,
    image,
    ...attributeKeys.map((key) =>
      attributes
        .filter((attribute) => attribute.trait_type === key)
        .map((attribute) => attribute.value || "YES")
        .join(",")
    ),
  ]);
  return [header, ...rows].map((row) => row.map((val) => `"${val}"`).join(",")).join("\n");
};

module.exports = {
  toCSV,
};
