import LogoutButton from "./LogoutButton"
import ThemeSwitcher from "./ThemeSwitcher"

export default function Header() {
  return (
    <header className="fixed md:relative h-14 md:h-fit md:py-4 flex justify-end md:justify-between items-center w-full px-6 
    border-b border-gray-400 dark:border-gray-700 backdrop-blur-md bg-blue-50 dark:bg-zinc-950/80 z-40 lg:z-10">
      <h2 className="hidden md:inline text-2xl">Workspace</h2>
      <div className="flex gap-4">
        <ThemeSwitcher className="md:bg-gray-300 md:dark:bg-cyan-900 hover:bg-gray-400/70 hover:dark:bg-cyan-500/70" />
        <LogoutButton />
      </div>
    </header>
  )
}