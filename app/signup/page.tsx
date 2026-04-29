import AuthCard from "@/components/auth/SignupPage";

export const metadata = {
  title: "Sign Up — PrepGenie",
  description: "Create your free PrepGenie account and start preparing for JAMB today.",
};

export default function SignupPage() {
  return <AuthCard mode="signup" />;
}
