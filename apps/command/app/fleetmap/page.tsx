"use client";

import dynamic from 'next/dynamic'

const FleetMap = dynamic(() => import('@shared/components/FleetMap'), {
  ssr: false,
})

export default function Page() {
  return <FleetMap nodes={[]} nodlrs={[]} loading={false} onNodeSelect={() => {}} />
}
