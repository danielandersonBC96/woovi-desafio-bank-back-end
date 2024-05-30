const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    cpfCnpj: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    }
  });
  
  userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });
  
  userSchema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  
// Pré-processamento para criptografar a senha antes de salvar no banco de dados
userSchema.pre('save', async function(next) {
    try {
        // Verifica se a senha foi modificada ou é nova
        if (!this.isModified('password')) {
            return next();
        }
        // Criptografa a senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
