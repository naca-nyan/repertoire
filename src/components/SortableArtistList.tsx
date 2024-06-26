import React, { useState } from "react";
import {
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Theme } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableArtistItem: React.FC<{
  artist: string;
}> = ({ artist }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: artist });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card sx={{ marginBottom: 2 }}>
        <ListItem disableGutters disablePadding>
          <ListItemButton sx={{ paddingRight: "10px" }}>
            <ListItemText
              primary={artist}
              primaryTypographyProps={{ fontWeight: "bold" }}
            />
            <ExpandMore />
          </ListItemButton>
        </ListItem>
      </Card>
    </div>
  );
};

const SortableArtistList: React.FC<{
  artists: string[];
  onSortEnd: (aritsts: string[]) => void;
}> = React.memo(({ artists, onSortEnd }) => {
  const styles = (theme: Theme) => ({
    [theme.breakpoints.up("sm")]: { columnCount: 2 },
    [theme.breakpoints.up("md")]: { columnCount: 3 },
    [theme.breakpoints.up("lg")]: { columnCount: 4 },
    [theme.breakpoints.up("xl")]: { columnCount: 5 },
  });

  const [items, setItems] = useState(artists);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over === null) return;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((a) => a === active.id);
        const newIndex = items.findIndex((a) => a === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        onSortEnd(newArray);
        return newArray;
      });
    }
  };
  return (
    <List dense sx={styles}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((artist) => (
            <SortableArtistItem key={artist} artist={artist} />
          ))}
        </SortableContext>
      </DndContext>
    </List>
  );
});

export default SortableArtistList;
