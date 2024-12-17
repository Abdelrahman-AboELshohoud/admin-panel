import SectionsLayout from "../components/sections/SectionsLayout";

import Header from "../components/common/MyHeader";
import MySidebar from "../components/common/MySidebar";

export default function ControlPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid mainM bg-[#242424] grid-cols-12 min-h-screen overflow-hidden">
      <MySidebar />
      <div className="col-span-10 h-screen overflow-y-auto">
        <Header />
        <SectionsLayout>{children}</SectionsLayout>
      </div>
    </main>
  );
}
