function modPow(base, exp, modulus) {
    let result = 1;
    base = base % modulus;

    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % modulus;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % modulus;
    }

    return result;
}

// Function to calculate the modular inverse using the extended Euclidean algorithm
function modInverse(a, m) {
    let m0 = m;
    let x0 = 0;
    let x1 = 1;

    if (m === 1) return 1;

    while (a > 1) {
        let q = Math.floor(a / m);
        let t = m;

        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }

    if (x1 < 0) x1 += m0;

    return x1;
}

// RSA Encryption
function encrypt() {
    let message = document.getElementById('message').value.toUpperCase();
    
    // Handle odd-length messages by adding padding
    if (message.length % 2 !== 0) {
        message += 'X'; // Adding 'X' as padding
    }
    
    const p = parseInt(document.getElementById('pValue').value);
    const q = parseInt(document.getElementById('qValue').value);
    const e = parseInt(document.getElementById('eValue').value);
    const n = p * q;

    const mapCharToNumber = (char) => {
        return char.charCodeAt(0) - 'A'.charCodeAt(0);
    };

    // Convert message to blocks of four digits
    let blocks = [];
    for (let i = 0; i < message.length; i += 2) {
        let block = mapCharToNumber(message[i]);
        if (i + 1 < message.length) {
            block = block * 100 + mapCharToNumber(message[i + 1]); // Concatenate digits
        }
        blocks.push(block);
    }

    let encryptedMessage = '';
    for (const block of blocks) {
        const encryptedBlock = modPow(block, e, n);
        encryptedMessage += encryptedBlock.toString().padStart(4, '0') + ' ';
    }

    document.getElementById('output').value = encryptedMessage.trim();
}

// RSA Decryption
function decrypt() {
    const encryptedMessage = document.getElementById('output').value.trim();
    const p = parseInt(document.getElementById('pValue').value);
    const q = parseInt(document.getElementById('qValue').value);
    const e = parseInt(document.getElementById('eValue').value);
    const n = p * q;
    const phiN = (p - 1) * (q - 1);
    const d = modInverse(e, phiN);

    const mapNumberToChar = (num) => {
        return String.fromCharCode(num + 'A'.charCodeAt(0));
    };

    let decryptedMessage = '';
    const encryptedBlocks = encryptedMessage.split(' ').filter(code => code !== '');
    for (const encryptedBlock of encryptedBlocks) {
        const decryptedBlock = modPow(parseInt(encryptedBlock), d, n);
        const blockStr = decryptedBlock.toString().padStart(4, '0');
        for (let i = 0; i < blockStr.length; i += 2) {
            const num = parseInt(blockStr.substring(i, i + 2));
            decryptedMessage += mapNumberToChar(num);
        }
    }

    // Remove padding if it was added
    if (decryptedMessage.endsWith('X')) {
        decryptedMessage = decryptedMessage.slice(0, -1);
    }

    document.getElementById('output').value = decryptedMessage;
}

// Clear the input fields
function clean() {
    document.getElementById('message').value = '';
    document.getElementById('output').value = '';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('encryptBtn').addEventListener('click', encrypt);
    document.getElementById('decryptBtn').addEventListener('click', decrypt);
    document.getElementById('cleanBtn').addEventListener('click', clean);
});