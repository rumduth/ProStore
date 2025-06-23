import Image from "next/image";
import loader from "@/assets/loader.gif";

export default function LoadingPage() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Image src={loader} height={150} width={150} alt="Loading..." />
    </div>
  );
}
