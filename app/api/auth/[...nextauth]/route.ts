// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Таны Backend рүү Google-ээс ирсэн датаг илгээнэ
          const res = await fetch("https://purenest-app.onrender.com/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              full_name: user.name,
              email: user.email,
            }),
          });
          return true; // Амжилттай бол нэвтрүүлнэ
        } catch (error) {
          console.error("Backend login error:", error);
          return false;
        }
      }
      return true;
    },
  },
})

export { handler as GET, handler as POST }