import { Children } from "@alloy-js/core/jsx-runtime";

export interface Parameter {
  name: string;
  type?: string;
  defaultValue?: Children;
}

export interface ParametersProps {
  parameters?: Parameter[];
}

/**
 * Renders PHP function/method parameters
 */
export function Parameters(props: ParametersProps) {
  const { parameters = [] } = props;

  return (
    <>
      (
      {parameters.map((param, index) => (
        <>
          {index > 0 && ", "}
          {param.type && <>{param.type} </>}${param.name}
          {param.defaultValue && <> = {param.defaultValue}</>}
        </>
      ))}
      )
    </>
  );
}
