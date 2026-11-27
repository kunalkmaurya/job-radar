import Image from 'next/image';
import dashboardTableDark from '../../../docs/screenshots/dashboard-table-sanitized.png';
import dashboardTableLight from '../../../docs/screenshots/dashboard-table-light.png';

export function LandingPreview() {
  return (
    <div className="landing-product-backdrop" aria-hidden="true">
      <div className="landing-product-backdrop-frame">
        <Image
          src={dashboardTableLight}
          alt=""
          priority
          className="w-full h-auto dark:hidden"
          sizes="100vw"
        />
        <Image
          src={dashboardTableDark}
          alt=""
          priority
          className="hidden w-full h-auto dark:block"
          sizes="100vw"
        />
      </div>
    </div>
  );
}
