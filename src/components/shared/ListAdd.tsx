import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ListAddProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  max?: number;
  variant?: "rows" | "chips";
}

export function ListAdd({
  items,
  onChange,
  placeholder = "Add an item…",
  addLabel = "Add",
  max = 50,
  variant = "rows",
}: ListAddProps) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const text = draft.trim();
    if (!text || items.length >= max) return;
    onChange([...items, text]);
    setDraft("");
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) =>
        variant === "chips" ? (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-foreground"
          >
            {item}
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-muted-foreground hover:text-danger"
              aria-label={`Remove ${item}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ) : (
          <div
            key={i}
            className="group flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/30 px-3 py-2.5"
          >
            <span className="flex-1 text-sm leading-snug text-foreground">
              {item}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              className={cn(
                "rounded-full p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger",
              )}
              aria-label={`Remove ${item}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      )}

      {items.length < max && (
        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") add();
            }}
            placeholder={placeholder}
            className="h-9"
          />
          <Button type="button" size="sm" onClick={add} disabled={!draft.trim()}>
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
