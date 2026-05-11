type AdSlotProps = {
  id: string;
  label?: string;
  size?: string;
  position?: 'top' | 'sidebar' | 'in-feed' | 'detail' | 'footer' | 'mobile';
  className?: string;
};

export function AdSlot({
  id,
  label = 'Advertisement',
  size = '728x90',
  position = 'top',
  className = '',
}: AdSlotProps) {
  return (
    <div
      className={`ad-slot ad-slot--${position} ${className}`}
      data-ad-id={id}
      data-ad-size={size}
    >
      <span>{label}</span>
      <strong>{size}</strong>
    </div>
  );
}