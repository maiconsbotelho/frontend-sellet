import Menu from './menu';
import Logo from './logo';

export default function Header() {
  return (
    <header className="fixed flex w-full z-50 items-center h-24 bg-pink-950/60 self-stretch">
      <nav className="flex items-center text-white justify-between container">
        <Logo />
        <Menu />
      </nav>
    </header>
  );
}
