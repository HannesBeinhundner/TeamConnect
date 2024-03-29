import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma";

export const options = {
    adapter: PrismaAdapter(prisma),
    providers: [
        // {
        //     id: 'teamconnect',
        //     name: 'Teamconnect',
        //     type: 'oauth',
        //     version: '2.0',
        //     scope: 'public identity',
        //     params: { grant_type: 'authorization_code' },
        //     profileUrl: 'https://auth.projects.multimediatechnology.at/api/v1/me.json',
        //     userinfo: {
        //         url: "https://auth.projects.multimediatechnology.at/api/v1/me.json",
        //         async request({ client, tokens }) {
        //             // console.log("!!!!!!!!!!!", tokens.created_at)
        //             delete tokens.created_at;
        //             const profile = await client.userinfo(tokens.access_token)
        //             console.log(profile)
        //             console.log(client)
        //             console.log(tokens)
        //             return profile
        //         },
        //     },
        //     async profile(profile, tokens) {
        //         return {
        //             id: profile.id,
        //             name: profile.firstname + " " + profile.lastname,
        //             firstname: profile.firstname,
        //             lastname: profile.lastname,
        //             email: profile.email,
        //             image: profile.picture,
        //             status: profile.status,
        //             department: profile.department,
        //             studies: profile.studies,
        //             username: profile.username
        //         }
        //     },
        //     clientId: process.env.FH_ID,
        //     clientSecret: process.env.FH_SECRET,
        //     authorization: {
        //         url: 'https://auth.projects.multimediatechnology.at/oauth/authorize',
        //         params: { scope: "public identity" },
        //         prompt: 'login',
        //     },
        //     token: 'https://auth.projects.multimediatechnology.at/oauth/token',
        // },
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.SECRET,

    callbacks: {
        // async signIn({ account, profile }) {
        //     if (!profile?.email) {
        //         throw new Error('No email returned from the identity provider')
        //     }

        //     await prisma.user.upsert({
        //         where: { email: profile.email },
        //         create: {
        //             email: profile.email,
        //             name: profile.name,
        //         },
        //         update: {
        //             name: profile.name,
        //         }
        //     })

        //     return true
        // },
        // async signIn({ user, account, profile, email, credentials }) {
        //     console.log(user)
        //     console.log(account)
        //     const urlParams = new URL(account.callbackUrl).searchParams;
        //     const eventId = urlParams.get('eventId');
        //     console.log(eventId)
        //     if (user) {
        //         await prisma.user.update({
        //             where: { id: user.id },
        //             data: { eventId: eventId },
        //         });
        //     }

        //     return true;
        // },
        async jwt({ token, user }) {
            //if (user) token.role = user.role;
            return token;
        },
        async session({ session, token }) {
            // if (session?.user) session.user.role = token.role;
            if (session?.user)
                return session;
        },
    },
};