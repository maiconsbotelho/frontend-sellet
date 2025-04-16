import Image from "next/image";
import LogoSellet from "@/../public/logo.svg";

export const Logo = () => {
  return <Image src={LogoSellet} alt="Logo" className="w-[91px] " />;
};

export default Logo;
