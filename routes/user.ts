import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/user";
import HttpStatusCode from "http-status-codes";
import { generateCookie } from "../helpers/helpers";
import passport from "passport";

export const userRouter = Router();
import { initPassportUserStrategy } from "../passport-strategies/user";
initPassportUserStrategy(passport);

userRouter.post("/user/register", passport.authenticate('local-signup'), (req, res) => {
  const user = req.user;
  if (!user)
    return res.status(HttpStatusCode.NOT_FOUND).send({ error: "no such user" });
    
  //TODO: this is a questionable decision, rewrite later?
  req.login(user, (error) => {
    if (error) return res.status(HttpStatusCode.UNAUTHORIZED).send({error: 'wrong password'});

    return res.status(HttpStatusCode.OK).send(user);
  })
});

userRouter.post('/user/restore', async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  const user = req.user;

  if (isAuthenticated && user) {
    return res.status(HttpStatusCode.OK).send(user);
  } else {
    return res.status(HttpStatusCode.UNAUTHORIZED);
  }
})

userRouter.post("/user/login", passport.authenticate("local-signin"), (req, res) => {
  const user = req.user;
  if (!user)
    return res.status(HttpStatusCode.NOT_FOUND).send({ error: "no such user" });
    
  req.login(user, (error) => {
    if (error) return res.status(HttpStatusCode.UNAUTHORIZED).send({error: 'wrong password'});

    return res.status(HttpStatusCode.OK).send(user);
  })
  
});

// userRouter.post("/user/login", async (req, res) => {
//   console.log("got a request", req.body);
//   try {
//     const user = await User.findOne({
//       username: req.body.username,
//     });
//
//     if (!!user) {
//       user.comparePasswords(req.body.password, (err: any, match: boolean) => {
//         console.log(user, req.body, err);
//
//         if (err) throw err;
//
//         if (match) {
//           if (!req.cookies.cookieName) {
//             const cookie = generateCookie(user.get("username"));
//             res.cookie(cookie.name, cookie.key, cookie.params);
//             console.log(cookie);
//           }
//
//           res.send(user);
//         } else {
//           res.status(HttpStatusCode.UNAUTHORIZED);
//           res.send("wrong password");
//         }
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(HttpStatusCode.BAD_REQUEST);
//     res.send(error);
//   }
// });
