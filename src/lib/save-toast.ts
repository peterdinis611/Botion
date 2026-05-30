import { toast } from "sonner";

const AUTOSAVE_TOAST_ID = "botion-autosave";

export function toastSaveSuccess(message = "Changes saved") {
  toast.success(message, {
    id: AUTOSAVE_TOAST_ID,
    duration: 2200,
  });
}

export function toastSaveError(message = "Couldn't save changes", description?: string) {
  toast.error(message, {
    id: `${AUTOSAVE_TOAST_ID}-error`,
    description,
    duration: 5000,
  });
}

export function toastSaving() {
  toast.loading("Saving…", {
    id: AUTOSAVE_TOAST_ID,
    duration: Infinity,
  });
}

export function dismissSaveToast() {
  toast.dismiss(AUTOSAVE_TOAST_ID);
}
