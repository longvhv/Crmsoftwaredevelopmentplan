import * as React from "react";
import { cn } from "./utils";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, MoreVertical, GripVertical } from "lucide-react";

/* ============================================================
 * KANBAN BOARD - Drag-and-drop task board with swimlanes
 * ============================================================
 * Supports WIP limits, card templates, and column customization
 */

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order: number;
  metadata?: Record<string, any>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
  wipLimit?: number;
  collapsed?: boolean;
}

export interface KanbanBoardProps {
  /**
   * Columns with cards
   */
  columns: KanbanColumn[];
  
  /**
   * Card moved handler
   */
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string, newOrder: number) => void;
  
  /**
   * Card clicked handler
   */
  onCardClick?: (card: KanbanCard) => void;
  
  /**
   * Add card handler
   */
  onAddCard?: (columnId: string) => void;
  
  /**
   * Column actions handler
   */
  onColumnAction?: (columnId: string, action: string) => void;
  
  /**
   * Custom card render
   */
  renderCard?: (card: KanbanCard) => React.ReactNode;
  
  /**
   * Show add card button
   * @default true
   */
  showAddButton?: boolean;
  
  /**
   * Show WIP limits
   * @default true
   */
  showWipLimits?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * DRAG & DROP TYPES
 * ============================================================ */

const ItemTypes = {
  CARD: 'card',
};

interface DragItem {
  id: string;
  columnId: string;
  order: number;
}

/* ============================================================
 * KANBAN CARD COMPONENT
 * ============================================================ */

interface KanbanCardComponentProps {
  card: KanbanCard;
  index: number;
  onMove: (dragIndex: number, hoverIndex: number, dragColumnId: string, hoverColumnId: string) => void;
  onClick?: (card: KanbanCard) => void;
  renderCard?: (card: KanbanCard) => React.ReactNode;
}

const KanbanCardComponent: React.FC<KanbanCardComponentProps> = ({
  card,
  index,
  onMove,
  onClick,
  renderCard,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CARD,
    item: (): DragItem => ({
      id: card.id,
      columnId: card.columnId,
      order: index,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ItemTypes.CARD,
    hover: (item, monitor) => {
      if (!ref.current) return;
      
      const dragIndex = item.order;
      const hoverIndex = index;
      const dragColumnId = item.columnId;
      const hoverColumnId = card.columnId;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex && dragColumnId === hoverColumnId) {
        return;
      }
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      
      if (dragColumnId === hoverColumnId) {
        // Dragging within same column
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
      }
      
      // Time to actually perform the action
      onMove(dragIndex, hoverIndex, dragColumnId, hoverColumnId);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.order = hoverIndex;
      item.columnId = hoverColumnId;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  
  drag(drop(ref));
  
  return (
    <div
      ref={ref}
      className={cn(
        'bg-background border border-border rounded-lg p-3 mb-2 cursor-move transition-all',
        isDragging && 'opacity-50',
        isOver && 'border-primary',
        onClick && 'hover:border-primary/50'
      )}
      onClick={() => onClick?.(card)}
    >
      {renderCard ? (
        renderCard(card)
      ) : (
        <>
          <div className="flex items-start gap-2">
            <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{card.title}</div>
              {card.description && (
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {card.description}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ============================================================
 * KANBAN COLUMN COMPONENT
 * ============================================================ */

interface KanbanColumnComponentProps {
  column: KanbanColumn;
  onCardMove: (cardId: string, fromColumnId: string, toColumnId: string, newOrder: number) => void;
  onCardClick?: (card: KanbanCard) => void;
  onAddCard?: (columnId: string) => void;
  onColumnAction?: (columnId: string, action: string) => void;
  renderCard?: (card: KanbanCard) => React.ReactNode;
  showAddButton: boolean;
  showWipLimits: boolean;
}

const KanbanColumnComponent: React.FC<KanbanColumnComponentProps> = ({
  column,
  onCardMove,
  onCardClick,
  onAddCard,
  onColumnAction,
  renderCard,
  showAddButton,
  showWipLimits,
}) => {
  const [cards, setCards] = React.useState(column.cards);
  
  React.useEffect(() => {
    setCards(column.cards);
  }, [column.cards]);
  
  const moveCard = React.useCallback(
    (dragIndex: number, hoverIndex: number, dragColumnId: string, hoverColumnId: string) => {
      if (dragColumnId === hoverColumnId) {
        // Moving within same column
        setCards((prevCards) => {
          const newCards = [...prevCards];
          const [removed] = newCards.splice(dragIndex, 1);
          newCards.splice(hoverIndex, 0, removed);
          return newCards;
        });
      } else {
        // Moving to different column - handled by parent
        const dragCard = cards[dragIndex];
        if (dragCard) {
          onCardMove(dragCard.id, dragColumnId, hoverColumnId, hoverIndex);
        }
      }
    },
    [cards, onCardMove]
  );
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item: DragItem) => {
      if (item.columnId !== column.id) {
        onCardMove(item.id, item.columnId, column.id, cards.length);
      }
    },
    canDrop: () => {
      // Check WIP limit
      if (column.wipLimit && cards.length >= column.wipLimit) {
        return false;
      }
      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  
  const isAtWipLimit = column.wipLimit && cards.length >= column.wipLimit;
  
  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-[var(--muted)]/30 rounded-lg p-3">
        {/* Column Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {column.color && (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: column.color }}
              />
            )}
            <h3 className="font-semibold text-sm">{column.title}</h3>
            <span className="text-xs text-muted-foreground">
              {cards.length}
              {showWipLimits && column.wipLimit && ` / ${column.wipLimit}`}
            </span>
          </div>
          
          {onColumnAction && (
            <button
              type="button"
              onClick={() => onColumnAction(column.id, 'menu')}
              className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* WIP Limit Warning */}
        {isAtWipLimit && (
          <div className="mb-2 px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded">
            WIP limit reached
          </div>
        )}
        
        {/* Cards Drop Zone */}
        <div
          ref={drop}
          className={cn(
            'min-h-[200px] transition-colors',
            isOver && canDrop && 'bg-primary/5',
            isOver && !canDrop && 'bg-red-50'
          )}
        >
          {cards.map((card, index) => (
            <KanbanCardComponent
              key={card.id}
              card={card}
              index={index}
              onMove={moveCard}
              onClick={onCardClick}
              renderCard={renderCard}
            />
          ))}
          
          {/* Empty State */}
          {cards.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Drop cards here
            </div>
          )}
        </div>
        
        {/* Add Card Button */}
        {showAddButton && onAddCard && !isAtWipLimit && (
          <button
            type="button"
            onClick={() => onAddCard(column.id)}
            className="w-full mt-2 py-2 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ============================================================
 * KANBAN BOARD COMPONENT
 * ============================================================ */

export function KanbanBoard({
  columns,
  onCardMove,
  onCardClick,
  onAddCard,
  onColumnAction,
  renderCard,
  showAddButton = true,
  showWipLimits = true,
  className,
}: KanbanBoardProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={cn('overflow-x-auto', className)}>
        <div className="flex gap-4 pb-4">
          {columns.map((column) => (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              onCardMove={onCardMove}
              onCardClick={onCardClick}
              onAddCard={onAddCard}
              onColumnAction={onColumnAction}
              renderCard={renderCard}
              showAddButton={showAddButton}
              showWipLimits={showWipLimits}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

/* ============================================================
 * KANBAN HOOK
 * ============================================================ */

export interface UseKanbanOptions {
  initialColumns: KanbanColumn[];
  onMove?: (cardId: string, fromColumnId: string, toColumnId: string) => void;
}

export interface UseKanbanReturn {
  columns: KanbanColumn[];
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string, newOrder: number) => void;
  addCard: (columnId: string, card: Omit<KanbanCard, 'id' | 'columnId' | 'order'>) => void;
  updateCard: (cardId: string, updates: Partial<KanbanCard>) => void;
  removeCard: (cardId: string) => void;
  addColumn: (column: Omit<KanbanColumn, 'cards'>) => void;
  removeColumn: (columnId: string) => void;
}

export function useKanban({ initialColumns, onMove }: UseKanbanOptions): UseKanbanReturn {
  const [columns, setColumns] = React.useState<KanbanColumn[]>(initialColumns);
  
  const moveCard = React.useCallback(
    (cardId: string, fromColumnId: string, toColumnId: string, newOrder: number) => {
      setColumns((prev) => {
        const newColumns = prev.map((col) => ({ ...col, cards: [...col.cards] }));
        
        // Find card in source column
        const sourceColumn = newColumns.find((col) => col.id === fromColumnId);
        const targetColumn = newColumns.find((col) => col.id === toColumnId);
        
        if (!sourceColumn || !targetColumn) return prev;
        
        const cardIndex = sourceColumn.cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prev;
        
        // Remove card from source
        const [card] = sourceColumn.cards.splice(cardIndex, 1);
        
        // Update card's columnId
        card.columnId = toColumnId;
        
        // Insert into target at newOrder
        targetColumn.cards.splice(newOrder, 0, card);
        
        // Update order for all cards in target column
        targetColumn.cards.forEach((c, idx) => {
          c.order = idx;
        });
        
        onMove?.(cardId, fromColumnId, toColumnId);
        
        return newColumns;
      });
    },
    [onMove]
  );
  
  const addCard = React.useCallback(
    (columnId: string, cardData: Omit<KanbanCard, 'id' | 'columnId' | 'order'>) => {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: [
                  ...col.cards,
                  {
                    ...cardData,
                    id: Math.random().toString(36).substring(2, 9),
                    columnId,
                    order: col.cards.length,
                  },
                ],
              }
            : col
        )
      );
    },
    []
  );
  
  const updateCard = React.useCallback((cardId: string, updates: Partial<KanbanCard>) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((card) =>
          card.id === cardId ? { ...card, ...updates } : card
        ),
      }))
    );
  }, []);
  
  const removeCard = React.useCallback((cardId: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      }))
    );
  }, []);
  
  const addColumn = React.useCallback((columnData: Omit<KanbanColumn, 'cards'>) => {
    setColumns((prev) => [...prev, { ...columnData, cards: [] }]);
  }, []);
  
  const removeColumn = React.useCallback((columnId: string) => {
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
  }, []);
  
  return {
    columns,
    moveCard,
    addCard,
    updateCard,
    removeCard,
    addColumn,
    removeColumn,
  };
}
