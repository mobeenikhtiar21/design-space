import { DrawToolbar } from "@/components/Studio/DrawToolBar";
import { MenuBar } from "@/components/Studio/MenuBar";
import SheetTabs from "@/components/Studio/SheetTabs";
import Sidebar from "@/components/Studio/Sidebar";
import Toolbar from "@/components/Studio/ToolBar";

export default function Studio() {
    return (
        <>
            <DrawToolbar />
            <div className="flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden">
                <MenuBar />
                <Toolbar />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />

                    <div className="flex-1 bg-primary overflow-auto">
                    </div>
                </div>
                <SheetTabs />
            </div>
        </>
    );
}

