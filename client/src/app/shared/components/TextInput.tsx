/* PSEUDOCODE/PLAN:
1. Add a file-level JSDoc comment describing the purpose of this file and the component:
   - Explain that this is a wrapper around MUI's TextField integrated with react-hook-form via useController.
   - Describe the generic T extends FieldValues and that props include UseControllerProps and TextFieldProps.
   - Provide a short usage example showing how to wire the component with useForm.
   - Note behavior: merges controller field bindings, maps fieldState.error to TextField error/helperText, sets default fullWidth and variant.
2. Add JSDoc for the Props type to clarify composition of controller props + TextField props.
3. Add JSDoc for the component function describing parameters and what it returns.
4. Keep original implementation intact and ensure comments are valid TypeScript comments so file remains compilable.
*/

import { TextField, type TextFieldProps } from "@mui/material";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";

/**
 * Props for `TextInput` component.
 *
 * Combines react-hook-form's controller props with MUI's TextField props.
 * - Provide `name`, `control`, and optional `rules` via `UseControllerProps<T>`.
 * - Provide any `TextFieldProps` to customize appearance and behavior.
 *
 * Generic `T` should extend `FieldValues` and represent the form's values shape.
 */
type Props<T extends FieldValues> = {} & UseControllerProps<T> & TextFieldProps

/**
 * TextInput
 *
 * A small adapter component that binds MUI's `TextField` to `react-hook-form` using `useController`.
 *
 * Behavior:
 * - Calls `useController` with the provided controller props.
 * - Spreads `field` onto the `TextField` so `value`, `onChange`, `onBlur`, and `name` are connected.
 * - Uses `fieldState.error` to populate `error` and `helperText` on the `TextField`.
 * - Sets sensible defaults: `fullWidth` and `variant="outlined"` (can be overridden via props).
 *
 * Example:
 * ```
 * const methods = useForm<{ firstName: string }>();
 * <TextInput
 *   name="firstName"
 *   control={methods.control}
 *   label="First name"
 *   rules={{ required: "First name is required" }}
 * />
 * ```
 *
 * Note: Explicit `error` or `helperText` props passed to this component will be overridden
 * by the validation state from `react-hook-form`.
 *
 * @param props - Combined `UseControllerProps<T>` and `TextFieldProps`.
 * @returns A Material-UI `TextField` bound to react-hook-form control.
 */
export default function TextInput<T extends FieldValues>(props : Props<T>) {
    const {field, fieldState} = useController({...props});
    
    return (
        <TextField 
            {...props}
            {...field}
            value={field.value || ''}
            fullWidth
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />
  )
}
