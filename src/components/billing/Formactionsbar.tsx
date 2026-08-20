"use client";

import { useState } from "react";
import { RotateCcw, Printer, Eye, FileCheck2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface FormActionsBarProps {
  isDirty: boolean;
  isSubmitting: boolean;
  draftSavedLabel?: string;
  onSaveDraft: () => void;
  onGenerateLR: () => void;
  onSaveAndPrint: () => void;
  onPreview: () => void;
  onReset: () => void;
}

export function FormActionsBar({
  isDirty,
  isSubmitting,
  draftSavedLabel,
  onSaveDraft,
  onGenerateLR,
  onSaveAndPrint,
  onPreview,
  onReset,
}: FormActionsBarProps) {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const requestReset = () => {
    if (isDirty) {
      setResetDialogOpen(true);
    } else {
      onReset();
    }
  };

  return (
    <>
      <div className="sticky bottom-0 z-10 -mx-6 mt-6 border-t border-neutral-200 bg-white/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80 print:hidden">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-5 text-caption text-neutral-500">{draftSavedLabel}</div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={requestReset} type="button">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </Button>
            <Button variant="ghost" size="sm" onClick={onPreview} type="button">
              <Eye className="h-4 w-4" aria-hidden="true" />
              Preview
            </Button>
            <Button variant="outline" size="sm" isLoading={isSubmitting} onClick={onSaveDraft} type="button">
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Draft
            </Button>
            <Button variant="secondary" size="sm" isLoading={isSubmitting} onClick={onSaveAndPrint} type="button">
              <Printer className="h-4 w-4" aria-hidden="true" />
              Save & Print
            </Button>
            <Button variant="primary" size="sm" isLoading={isSubmitting} onClick={onGenerateLR} type="button">
              <FileCheck2 className="h-4 w-4" aria-hidden="true" />
              Save & Generate LR
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        title="Discard all changes?"
        description="This will clear every field you've entered on this consignment note. This can't be undone."
        confirmLabel="Discard changes"
        destructive
        onConfirm={() => {
          setResetDialogOpen(false);
          onReset();
        }}
        onCancel={() => setResetDialogOpen(false)}
      />
    </>
  );
}