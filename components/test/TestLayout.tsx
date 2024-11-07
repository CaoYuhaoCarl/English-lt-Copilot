import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Settings2, Play } from 'lucide-react';
import TestConfigPanel from './TestConfigPanel';
import TestContent from './TestContent';

interface TestLayoutProps {
  isTestActive: boolean;
  configPanelProps: any;
  contentProps: any;
}

export default function TestLayout({
  isTestActive,
  configPanelProps,
  contentProps
}: TestLayoutProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      {!isTestActive ? (
        <>
          <div className="flex gap-4">
            <Button 
              onClick={configPanelProps.startTest}
              size="lg"
              className="flex-1"
            >
              <Play className="w-5 h-5 mr-2" />
              开始测试
            </Button>
            
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-[120px]">
                  <Settings2 className="w-4 h-4 mr-2" />
                  测试配置
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="max-w-4xl mx-auto w-full p-6">
                  <TestConfigPanel {...configPanelProps} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </>
      ) : (
        <TestContent {...contentProps} />
      )}
    </div>
  );
} 