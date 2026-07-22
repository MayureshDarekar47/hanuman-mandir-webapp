"use client";

interface DeleteButtonProps {
  action: () => Promise<void>;
  message?: string;
  label?: string;
  className?: string;
}

export default function DeleteButton({
  action,
  message = "Are you sure you want to delete this? This cannot be undone.",
  label = "Delete",
  className = "text-red-400 hover:text-red-600 text-xs font-bold",
}: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={async () => {
        if (confirm(message)) {
          await action();
        }
      }}
      className={className}
    >
      {label}
    </button>
  );
}
