import Mahaprasad from "@/components/Mahaprasad";

export const revalidate = 60;

export default function MahaprasadPage() {
  return (
    <main className="min-h-screen bg-orange-50/30">
      <div className="pt-24 pb-12">
        <Mahaprasad />
      </div>
    </main>
  );
}
