import { createElement } from 'react';
import { containerIconFor } from '../../../lib/containerIcon.js';

export default function ContainerIconTile({ container, color }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-lg border-2 text-white"
      style={{ backgroundColor: color.base, borderColor: color.dark }}
    >
      {createElement(containerIconFor(container), { size: 18, strokeWidth: 2.5 })}
    </span>
  );
}
