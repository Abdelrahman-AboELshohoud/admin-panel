import { TabsList, TabsTrigger, TabsContent, Tabs } from "../ui/tabs";

export default function MyTabs({
  tabs,
  tabsContent,
  setActiveTab,
}: {
  tabs: {
    title: string;
    value: string;
  }[];
  tabsContent: {
    value: string;
    content: React.ReactNode;
  }[];
  setActiveTab: (tab: string) => void;
}) {
  return (
    <Tabs defaultValue={tabs[0].value} className="w-full bg-transparent">
      <TabsList className="bg-zinc-800 text-zinc-400 border-zinc-700 bg-transparent">
        {tabs.map((tab) => (
          <TabsTrigger
            value={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className="custom-tabs select-none"
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabsContent.map((content) => (
        <TabsContent
          key={content.value}
          value={content.value}
          className="mt-4  bg-transparent rounded-xl p-4"
        >
          {content.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
