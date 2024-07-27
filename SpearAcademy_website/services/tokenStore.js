// tokenStore.js

const tokenStore = new Map();

function storeToken(identity, token) {
  tokenStore.set(identity, token);
}


function getToken(identity) {
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
