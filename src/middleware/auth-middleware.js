import tokenService from '../service/token-service.js';

export const authMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');
    if (!token) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        //  const user = await prismaClient.user.findFirst({
        //     where: {
        //         token: token
        //     }
        // });
        const user = await tokenService.verify(token);
        if (!user) {
            res.status(401).json({
                errors: "Unauthorized"
            }).end();
        } else {
            req.user = user;
            next();
        }
    }
}
