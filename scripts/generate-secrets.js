const crypto = require('crypto');

console.log('=== CAC Project - Secure Secrets Generator ===\n');

console.log('JWT_SECRET (64 bytes):');
console.log(crypto.randomBytes(64).toString('hex'));

console.log('\nADMIN_DEFAULT_PASSWORD (optional, for seed script):');
console.log(crypto.randomBytes(16).toString('base64'));

console.log('\n=== Instructions ===');
console.log('1. Copy the JWT_SECRET to your backend/.env file');
console.log('2. Optionally add ADMIN_DEFAULT_PASSWORD to backend/.env for seed script');
console.log('3. Never commit these values to version control!');
