"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected = [],
  onChange,
  placeholder = "Виберіть елементи...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const filteredOptions = searchValue
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    : options;

  const toggleOption = (value: string) => {
    const isSelected = selected.includes(value);

    if (isSelected) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const selectAll = () => {
    onChange(options.map((option) => option.value));
  };

  const clearAll = () => {
    onChange([]);
    setOpen(false);
  };

  const selectedLabels = selected.map(
    (value) => options.find((option) => option.value === value)?.label || value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto", className)}
        >
          {selected.length > 0 ? (
            <div className="flex gap-1 items-center flex-wrap">
              {selected.length <= 5 ? (
                selectedLabels.map((label, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="mr-1"
                  >
                    {label}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary">
                  Вибрано {selected.length}{" "}
                  {selected.length < 5 ? "користувача" : "користувачів"}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Пошук..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="border-none focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>Нічого не знайдено.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => selectAll()}
                className="flex items-center cursor-pointer"
              >
                <Checkbox
                  checked={
                    selected.length === options.length && options.length > 0
                  }
                  className="mr-2"
                  onCheckedChange={() => selectAll()}
                />
                <span>Вибрати всіх</span>
              </CommandItem>
              <CommandItem
                onSelect={() => clearAll()}
                className="flex items-center cursor-pointer"
              >
                <div className="w-4 h-4 mr-2" />
                <span>Очистити вибір</span>
              </CommandItem>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => toggleOption(option.value)}
                  className="flex items-center cursor-pointer"
                >
                  <Checkbox
                    checked={selected.includes(option.value)}
                    className="mr-2"
                    onCheckedChange={() => toggleOption(option.value)}
                  />
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
