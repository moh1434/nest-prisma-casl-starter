//TODO: Do it in order:
//DONE__ migrate POST POST /auth/register  AND  PATCH /user/{id}
//use OmitType for authUser password, as an example.
//DONE__BUT TEST JWT AUTH SECRET use normal class validator or object instead of OurConfigService

// https://www.npmjs.com/package/prisma-class-generator
//multiple global prisma DB (for apple test), nest support it per request?, i may decide it inside Jwt auth when it injects req.user
// use argon2 instead of bicrypt
//refresh token
//redis
//cacheWrapper
//pm2 with logger
//OTP
