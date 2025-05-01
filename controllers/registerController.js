//controllers/register.js

import db from "../config/db.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs"

const { query } = db;
const HASH_SALT = 10

export default async function registerHandler(req, res, next) {
  const { firstName, lastName, email, password } = req.body
  try {
    const userCheckQuery = 'SELECT email FROM users WHERE email = $1';
    const userCheckResult = await query(userCheckQuery, [email])

    if (userCheckResult.rows.length > 0) {
      logger.warn(`Registrationg attempt failed: Email already exists - ${email}`)
      return res.status(409).json({ message: "Email already in use" })
    }
    const passwordHash = await bcrypt.hash(password, HASH_SALT)
    logger.debug(`Password hashed for email: ${email}`)

    const insertSql = `INSERT INTO users (first_name, last_name, email, password) 
                        VALUES($1,$2,$3,$4)
                        RETURNING id`
    const newUserResult = await query(insertSql, [firstName, lastName, email, passwordHash])

    const newUser = newUserResult.rows[0]
    logger.info(`User registered successfully: ${newUser.id}`)

    return res.status(201).json({
      message: "User registered successfully",
      userId: {
        id: newUser.id
      }
    })
  } catch (error) {
    logger.error(`Error during user registration for ${email}: `, error)
    next(error)
  }
}

export async function registerAsProviderHandler(req, res) {
    const userId = req.user.id;
    const { name, service_type, email } = req.body;
  
    try {
      const insertSql = `
        INSERT INTO service_providers (id, name, service_type, email)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result = await db.query(insertSql, [userId, name, service_type, email]);
  
      return res.status(201).json({
        message: 'User registered as provider successfully',
        provider: result.rows[0]
      });
    } catch (error) {
      console.error('Error registering provider:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }