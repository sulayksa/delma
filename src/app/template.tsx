/** Re-mounts on every navigation → a soft fade/lift between pages; header stays fixed. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
