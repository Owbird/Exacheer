import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FormValues } from "@/schema/dashboard/question-bank";

export default function OptionsInput() {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    //@ts-expect-error primitive types not supported
    name: "options",
  });

  const correctIndex = watch("correctIndex");

  return (
    <div className="space-y-2">
      {fields.map((field, idx) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input
            {...register(`options.${idx}`)}
            placeholder={`Option ${idx + 1}`}
          />
          <Checkbox
            checked={correctIndex === idx}
            onCheckedChange={() => setValue("correctIndex", idx)}
            aria-label={`Mark option ${idx + 1} as correct`}
          />
          <span className="text-xs text-muted-foreground">Correct</span>
          {fields.length > 2 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                remove(idx);
                const updated =
                  correctIndex === idx
                    ? 0
                    : correctIndex > idx
                    ? correctIndex - 1
                    : correctIndex;
                setValue("correctIndex", updated);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
      >
        Add Option
      </Button>
      {errors.options && (
        <p className="text-sm text-red-500">
          {errors.options.message as string}
        </p>
      )}
    </div>
  );
}
