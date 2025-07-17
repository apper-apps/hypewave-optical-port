// Secure encryption service for browser data protection
// Uses AES-256-GCM with PBKDF2 key derivation

const ENCRYPTION_CONFIG = {
  algorithm: 'AES-GCM',
  keyLength: 256,
  ivLength: 12,
  saltLength: 16,
  iterations: 100000,
  tagLength: 128
};

// Generate or retrieve a persistent encryption key for this browser session
const getOrCreateMasterKey = async () => {
  const sessionId = sessionStorage.getItem('hypewave_session_id');
  const browserId = localStorage.getItem('hypewave_browser_id');
  
  if (!sessionId || !browserId) {
    const newSessionId = crypto.randomUUID();
    const newBrowserId = crypto.randomUUID();
    
    sessionStorage.setItem('hypewave_session_id', newSessionId);
    localStorage.setItem('hypewave_browser_id', newBrowserId);
    
    return newSessionId + newBrowserId;
  }
  
  return sessionId + browserId;
};

// Derive encryption key from master key and salt
const deriveKey = async (masterKey, salt) => {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(masterKey),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ENCRYPTION_CONFIG.iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: ENCRYPTION_CONFIG.algorithm, length: ENCRYPTION_CONFIG.keyLength },
    false,
    ['encrypt', 'decrypt']
  );
};

export const encryptionService = {
  // Encrypt sensitive data before storing
  async encrypt(data) {
    try {
      const masterKey = await getOrCreateMasterKey();
      const encoder = new TextEncoder();
      const salt = window.crypto.getRandomValues(new Uint8Array(ENCRYPTION_CONFIG.saltLength));
      const iv = window.crypto.getRandomValues(new Uint8Array(ENCRYPTION_CONFIG.ivLength));
      
      const key = await deriveKey(masterKey, salt);
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: ENCRYPTION_CONFIG.algorithm,
          iv: iv
        },
        key,
        encoder.encode(data)
      );
      
      // Combine salt + iv + encrypted data
      const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encrypted), salt.length + iv.length);
      
      return btoa(String.fromCharCode.apply(null, combined));
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  },
  
  // Decrypt stored data
  async decrypt(encryptedData) {
    try {
      const masterKey = await getOrCreateMasterKey();
      const decoder = new TextDecoder();
      const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
      
      const salt = combined.slice(0, ENCRYPTION_CONFIG.saltLength);
      const iv = combined.slice(ENCRYPTION_CONFIG.saltLength, ENCRYPTION_CONFIG.saltLength + ENCRYPTION_CONFIG.ivLength);
      const encrypted = combined.slice(ENCRYPTION_CONFIG.saltLength + ENCRYPTION_CONFIG.ivLength);
      
      const key = await deriveKey(masterKey, salt);
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: ENCRYPTION_CONFIG.algorithm,
          iv: iv
        },
        key,
        encrypted
      );
      
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null; // Return null for corrupted/tampered data
    }
  },
  
  // Clear all encryption keys (for logout/reset)
  clearEncryptionKeys() {
    sessionStorage.removeItem('hypewave_session_id');
    localStorage.removeItem('hypewave_browser_id');
  }
};