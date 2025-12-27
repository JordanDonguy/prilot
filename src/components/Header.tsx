import ThemeSwitcher from "./ThemeSwitcher"
import LogoutButton from "./LogoutButton"

export default function Header() {
  return (
    <header className="flex justify-end md:justify-between items-center w-full h-14 md:h-20 px-6 border-b border-gray-400 dark:border-gray-700">
      <h2 className="hidden md:inline text-2xl">Workspace</h2>
      <div className="flex gap-4">
        <ThemeSwitcher className="md:bg-gray-300 md:dark:bg-cyan-900 hover:bg-gray-400/70 hover:dark:bg-cyan-500/70" />
        <LogoutButton />
      </div>
    </header>
  )
}