const jwt = require('jsonwebtoken');
const { createQueryBuilder } = require("typeorm");
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(404).json({ error: 'Header does not exist' });
        const [, token] = authHeader.split(' ');
        const jwtCheck = jwt.verify(token, process.env.SECRET_KEY);
    
        const user = await createQueryBuilder('user')
          .where('id = :id', { id: jwtCheck.id })
          .getOne();
    
        if (!user) return res.status(403).json({ error: 'Invalid User' });
        req.user = user;
        next();
    } catch (error) {
        console.error(`Server error: ${error}`);
        res.status(500).json({ error });
    }
}

module.exports = authMiddleware;
