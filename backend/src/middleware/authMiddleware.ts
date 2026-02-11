import { Request,Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//Extend express request type to include userId

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try{
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if( !authHeader )
    {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; 


    if( !token)
    {
        return res.status(401).json({ error: 'Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number , email:string};
    
    req.userId = decoded.userId;
  
    next();

    }
    catch(error)
    {
        if(error instanceof jwt.JsonWebTokenError)
        {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if(error instanceof jwt.TokenExpiredError)
        return res.status(500).json({ error: 'Internal server error' });

    }
};
