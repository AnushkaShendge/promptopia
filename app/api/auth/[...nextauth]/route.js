import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectToDB();

        const sessionUser = await User.findOne({ email: session.user.email });
        
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
        
        return session;
      } catch (err) {
        console.error("Session callback error:", err);
        return session;
      }
    },
    async signIn({ profile }) {
      try {
        await connectToDB();
        const user = await User.findOne({ email: profile.email });
        if (!user) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(/\s+/g, "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (err) {
        console.error("Sign-in callback error:", err);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
