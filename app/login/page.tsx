import AuthCard from "@/components/auth/SignupPage";

export const metadata = {
  title: "Log In — PrepGenie",
  description: "Log in to your PrepGenie account and continue your JAMB preparation.",
};

export default function LoginPage() {
  return <AuthCard mode="login" />;
}
