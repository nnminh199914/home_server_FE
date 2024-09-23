const SECRET_KEY = 'supersecretkey12345'; // Secret key (hardcoded, but exposed in client)

export const generateToken = async (username, expiration) => {
  const tokenData = `${username}.${expiration}.${SECRET_KEY}`; // Include secret key in the hash
  const tokenHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tokenData));

  // Convert the hash to a hex string
  const hashArray = Array.from(new Uint8Array(tokenHash));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return `${username}.${expiration}.${hashHex}`; // Return the token
};

export const validateToken = async (token) => {
    try {
      const [username, expiration, hash] = token.split('.');
  
      // Verify expiration
      if (new Date().getTime() > expiration) {
        return false; // Token has expired
      }
  
      // Recompute the hash with the same secret key
      const tokenData = `${username}.${expiration}.${SECRET_KEY}`;
      const expectedHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tokenData));
  
      // Convert the expectedHash to a hex string
      const expectedHashStr = Array.from(new Uint8Array(expectedHash))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
  
      return hash === expectedHashStr; // If the hashes match, the token is valid
    } catch (err) {
      return false; // Token is invalid
    }
  };