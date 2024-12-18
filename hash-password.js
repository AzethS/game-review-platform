const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'password123'; // Replace with your desired password
  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('Hashed Password:', hashedPassword);
}

hashPassword();