import { IDataControls } from "../models/balsamiq-resource";

export function injectEmptyProperties({
  controls,
}: IDataControls): IDataControls {
  return {
    controls: {
      ...controls,
      control: controls.control.map(({ children, properties, ...rest }) => ({
        properties: properties ?? {},
        children: children ? injectEmptyProperties(children) : undefined,
        ...rest,
      })),
    },
  };
}
