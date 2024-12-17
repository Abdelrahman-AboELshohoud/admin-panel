export default function SectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden h-fit text-quaternary px-8 py-4 sectionM">
      {children}
    </section>
  );
}
