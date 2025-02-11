import { DragOverlay } from "@dnd-kit/core"

interface DndGameOverlayProps {
    overlayCondition: boolean,
    children: React.ReactNode
}

export const DndGameOverlay: React.FC<DndGameOverlayProps> = ({ overlayCondition, children }) => {
    return (
        <>
            <DragOverlay>
                {overlayCondition? <div className="h-10 w-10 bg-red-500"></div>: null}
            </DragOverlay>
            {children}
        </>
    )
}