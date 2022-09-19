import NextAuth from 'next-auth';
import SlackProvider from 'next-auth/providers/slack';

console.log(process.env.NEXT_PUBLIC_CLIENT_ID, process.env.NEXT_PUBLIC_CLIENT_SECRET)

export default NextAuth({
  providers: [
    SlackProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {},
  pages: {},
  callbacks: {
    async signIn() {
      return true;
    },
  },
  events: {},
  debug: true,
});
