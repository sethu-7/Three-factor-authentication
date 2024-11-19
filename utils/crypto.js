
// // File: utils/crypto.js
// const crypto = require('crypto');
// const bigInt = require('big-integer');

// class CryptoUtils {
  








// File: utils/crypto.js
const crypto = require('crypto');
const bigInt = require('big-integer');

class CryptoUtils {
  static hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static modPow(base, exponent, modulus) {
    return bigInt(base).modPow(bigInt(exponent), bigInt(modulus));
  }

  static generatePrime() {
    return crypto.generatePrimeSync(64).toString('hex');
  }

  // Chinese Remainder Theorem implementation
  static crt(a, n) {
    let prod = n.reduce((acc, val) => acc * val, 1n);
    let sum = 0n;
    
    for (let i = 0; i < a.length; i++) {
      let p = prod / n[i];
      sum += a[i] * p * this.modInverse(p, n[i]);
    }
    
    return sum % prod;
  }

  static modInverse(a, m) {
    let m0 = m;
    let y = 0n;
    let x = 1n;
    
    if (m === 1n) return 0n;
    
    while (a > 1n) {
      let q = a / m;
      let t = m;
      m = a % m;
      a = t;
      t = y;
      y = x - q * y;
      x = t;
    }
    
    return x < 0n ? x + m0 : x;
  }

  static Rep(BIOui, deltaui) {
    // Simulate biometric reconstruction
    return this.hash(BIOui + deltaui);
  }

  static xor(a, b) {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    const result = Buffer.alloc(bufA.length);
    
    for (let i = 0; i < bufA.length; i++) {
      result[i] = bufA[i] ^ bufB[i];
    }
    
    return result.toString('hex');
  }

  static generateNonce() {
    return crypto.randomBytes(32).toString('hex');
  }

  static generateRandomNonce() {
    return crypto.randomBytes(32).toString('hex');
  }

  static hash(data) {
    return crypto.createHash('sha256').update(String(data)).digest('hex');
  }

  static generatePrime() {
    return crypto.generatePrimeSync(64).toString('hex');
  }



  static crt(remainders, moduli) {
    let product = bigInt(1);
    for (const mod of moduli) {
      product = product.multiply(bigInt(mod));
    }
    
    let result = bigInt(0);
    for (let i = 0; i < remainders.length; i++) {
      const pi = product.divide(bigInt(moduli[i]));
      const inv = pi.modInv(bigInt(moduli[i]));
      result = result.add(bigInt(remainders[i]).multiply(pi).multiply(inv));
    }
    
    return result.mod(product);
  }

  

  

  // Simulate biometric processing
  static Gen(BIOui) {
    const oui = this.hash(BIOui);
    const deltaui = this.hash(BIOui + oui);
    return { oui, deltaui };
  }
}

module.exports = CryptoUtils;