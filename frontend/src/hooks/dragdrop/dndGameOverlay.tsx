import { DragOverlay } from "@dnd-kit/core"

interface DndGameOverlayProps {
    overlayCondition: boolean,
    children: React.ReactNode
}

export const DndGameOverlay: React.FC<DndGameOverlayProps> = ({ overlayCondition, children }) => {
    return (
        <>
        {children}
        </>
    )
}