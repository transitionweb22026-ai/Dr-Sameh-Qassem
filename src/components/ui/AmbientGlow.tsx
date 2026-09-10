/**
 * Decorative blurred color orbs used behind glass cards on flat-background
 * sections. Purely visual (aria-hidden) — the parent section must set
 * `relative overflow-hidden` so the blur radius never causes page scroll.
 */
export function AmbientGlow() {
  return (
    <>
      <div
        className="absolute -top-24 -start-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-gold/10 blur-3xl animate-float pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -end-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-700/10 blur-3xl animate-float-slow pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
}
