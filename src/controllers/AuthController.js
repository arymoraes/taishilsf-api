const { getConnection } = require('typeorm');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../entities/UserSchema');
const errorHandler = require('../utils/errorHandler');
require('dotenv').config();

class AuthController {
  async register(req, res) {
    try {
      const {
        name, email, password
      } = req.body;
      
      if (!email || !name || !password || typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
        return errorHandler(res, 400, 'Missing or incorrect parameters');
      }
      
      if (password.length < 7 || password.length > 16) {
        return errorHandler(res, 400, 'Password should be between 8 and 16 characters');
      }
      
      const userExists = await getConnection()
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.name = :name', { name })
        .orWhere('user.email = :email', { email })
        .getOne();
      
      if (userExists) {
        return errorHandler(res, 400, 'Username or Email already exists');
      }

      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          return errorHandler(res, 401, 'There was some error with your password. Please, try again');
        }

        const user = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values([
            {
              name,
              email,
              password: hashedPassword,
            },
          ])
          .execute();

        const token = jwt.sign({ id: user.raw[0].id }, process.env.SECRET_KEY, {
          expiresIn: 1000 * 60 * 60 * 24 * 7,
        });

        return res.status(200).json({
          user: {
            name,
            email,
          },
          token,
        });
      });
      return null;
    } catch (error) {
      return errorHandler(res, 500, 'Server error');
    }
  }
}

//   async login(req, res) {
//     try {
//       const { email, password } = req.body;
//       const user = await getConnection()
//         .createQueryBuilder()
//         .select('user')
//         .from(User, 'user')
//         .where('user.email = :email', { email })
//         .getOne();

//       if (!user) return errorHandler(res, 404, 'A user with this email does not exist');

//       const isValid = await bcrypt.compare(password, user.password);

//       if (!isValid) return errorHandler(res, 401, 'Invalid password');

//       const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
//         expiresIn: 1000 * 60 * 60 * 24 * 7,
//       });

//       return res.status(200).json({
//         user: {
//           username: user.username,
//           email: user.email,
//           id: user.id,
//         },
//         token,
//       });
//     } catch (err) {
//       return errorHandler(res, 500, 'Server error');
//     }
//   }

//   async me(req, res) {
//     try {
//       const { user } = req;

//       const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
//         expiresIn: 1000 * 60 * 60 * 24 * 7,
//       });

//       return res.status(200).json({
//         user: {
//           email: user.email,
//           username: user.username,
//           id: user.id,
//           gender: user.gender,
//           role: user.role,
//         },
//         token,
//       });
//     } catch (error) {
//       return errorHandler(res, 500, 'Server error');
//     }
//   }
// }

module.exports = new AuthController();
