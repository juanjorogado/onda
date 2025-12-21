export function Header({ name, location }: { name: string; location: string }) {
  return (
    <div className="flex px-1 items-center gap-2 self-stretch text-ink">
      <span className="inline-flex w-2 h-2 rounded-full border border-brand"></span>
      <div className="text-m tracking-wide">
        <span className="font-normal">{name}</span> <span className="font-light">— {location}</span>
      </div>
    </div>
  );
}
