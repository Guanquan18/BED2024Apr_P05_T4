// tokenStore.js

const tokenStore = new Map();

function storeToken(identity, token) {
  console.log(`Storing token for ${identity}`);
  console.log(token);
  tokenStore.set(identity, token);
}


function getToken(identity) {
  console.log(`Getting token for ${identity}`);
  console.log(tokenStore.get(identity));
  return tokenStore.get(identity) || null;
}

function deleteToken(identity) {
  tokenStore.delete(identity);
}

module.exports = {
  storeToken,
  getToken,
  deleteToken
};
