type EmptyStateProps = {
  title: string
  description: string
  className?: string
}

export function EmptyState({ className = '', description, title }: EmptyStateProps) {
  return (
    <div
      className={[
        'rounded-[1.35rem] border border-white/12 bg-[#151515] px-5 py-12 text-center shadow-[0_0_34px_rgba(192,57,43,0.12)]',
        className,
      ].join(' ')}
    >
      <p className="text-xl font-black text-white">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-white/55">
        {description}
      </p>
    </div>
  )
}
