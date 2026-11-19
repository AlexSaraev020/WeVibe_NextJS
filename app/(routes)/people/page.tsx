import PeopleScreen from "@/components/wevibe/People";

export const viewport = { themeColor: "#0b0d0f" };

export const metadata = {
  title: "Meet people - WeVibe",
  description: "Meet new WeVibe accounts, most-followed first.",
};

export default function Page() {
  return <PeopleScreen />;
}
