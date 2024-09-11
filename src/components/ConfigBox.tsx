import { ReactNode } from "react";

interface IConfigBoxProps {
  children: ReactNode | ReactNode[];
}

const ConfigBox = ({ children }: IConfigBoxProps) => {
  return <div className="config-box">{children}</div>;
};

export default ConfigBox;
