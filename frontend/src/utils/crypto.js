// src/utils/crypto.js

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function getCryptoKey() {
  const rawKey = hexToBytes(ENCRYPTION_KEY);
  return await window.crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(plaintext) {
  if (plaintext === undefined || plaintext === null || plaintext === '') return plaintext;
  try {
    const enc = new TextEncoder();
    const encoded = enc.encode(plaintext.toString());
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const cryptoKey = await getCryptoKey();

    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
        tagLength: 128, // 16 bytes tag
      },
      cryptoKey,
      encoded
    );

    const combined = new Uint8Array(iv.length + ciphertextBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertextBuffer), iv.length);

    let binary = "";
    const len = combined.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return window.btoa(binary);
  } catch (error) {
    console.error("Encryption failed:", error);
    return plaintext;
  }
}

export async function decrypt(base64Ciphertext) {
  if (base64Ciphertext === undefined || base64Ciphertext === null || base64Ciphertext === '') return base64Ciphertext;
  try {
    const binaryString = window.atob(base64Ciphertext);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    if (bytes.byteLength < 28) {
      // 12 bytes IV + 16 bytes tag + 0+ bytes ciphertext
      return base64Ciphertext;
    }

    const iv = bytes.slice(0, 12);
    const ciphertextWithTag = bytes.slice(12);
    const cryptoKey = await getCryptoKey();

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
        tagLength: 128,
      },
      cryptoKey,
      ciphertextWithTag
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    // Decryption failed. Return as-is (e.g. if it wasn't encrypted or key mismatched)
    return base64Ciphertext;
  }
}
