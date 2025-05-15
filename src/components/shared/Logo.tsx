import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/logoSellet.svg"
        alt="Logo"
        width={100}
        height={100}
        className="block "
      />
    </Link>
  );
}
