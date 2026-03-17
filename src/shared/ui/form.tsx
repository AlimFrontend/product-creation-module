"use client";

import * as React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext
} from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/ui/label";

export type FormProps<TFieldValues extends FieldValues> = {
  children: React.ReactNode;
  methods: any;
} & React.FormHTMLAttributes<HTMLFormElement>;

export function RHFForm<TFieldValues extends FieldValues>({
  children,
  methods,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...methods}>
      <form {...props}>{children}</form>
    </FormProvider>
  );
}

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FormItem({ className, ...props }: FormItemProps) {
  return (
    <div className={cn("space-y-1.5", className)} {...props} />
  );
}

export interface FormLabelProps
  extends React.ComponentPropsWithoutRef<typeof Label> {}

export function FormLabel(props: FormLabelProps) {
  return <Label {...props} />;
}

export interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FormMessage({ className, ...props }: FormMessageProps) {
  const {
    formState: { errors }
  } = useFormContext();
  const name = (props as any)["data-field-name"] as string | undefined;
  const error = name ? (errors as any)[name]?.message : undefined;

  if (!error) return null;

  return (
    <p
      className={cn("text-xs font-medium text-destructive", className)}
      {...props}
    >
      {String(error)}
    </p>
  );
}

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = ControllerProps<TFieldValues, TName> & {
  render: ControllerProps<TFieldValues, TName>["render"];
};

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: FormFieldProps<TFieldValues, TName>) {
  return <Controller {...props} />;
}

