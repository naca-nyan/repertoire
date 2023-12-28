import { useEffect } from "react";

const Header: React.FC<{ title: string }> = ({ title }) => {
  const suffix = "Repertoire";
  useEffect(() => {
    document.title = title ? `${title} | ${suffix}` : suffix;
  }, [title]);
  return <></>;
};

export default Header;
